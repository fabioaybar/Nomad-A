// Base API Service Class for PHP/MySQL Backend Integration

import { API_ENDPOINTS, HTTP_METHODS, API_STATUS_CODES, API_HEADERS, CONTENT_TYPES } from '../config/endpoints'
import type { ApiResponse, PaginationParams, SearchParams } from '../types/dto'

export interface ApiConfig {
  baseURL: string
  timeout: number
  retries: number
  retryDelay: number
}

export interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
  params?: Record<string, any>
  timeout?: number
  retries?: number
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

export class BaseApiService {
  protected config: ApiConfig
  protected token: string | null = null

  constructor(config: ApiConfig) {
    this.config = config
    this.loadTokenFromStorage()
  }

  // Token Management
  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  private loadTokenFromStorage() {
    const token = localStorage.getItem('auth_token')
    if (token) {
      this.token = token
    }
  }

  // Request Headers
  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      [API_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
      [API_HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
      ...customHeaders,
    }

    if (this.token) {
      headers[API_HEADERS.AUTHORIZATION] = `Bearer ${this.token}`
    }

    return headers
  }

  // URL Building
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.config.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  // Request Method
  protected async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = HTTP_METHODS.GET,
      headers = {},
      body,
      params,
      timeout = this.config.timeout,
      retries = this.config.retries,
    } = options

    const url = this.buildURL(endpoint, params)
    const requestHeaders = this.getHeaders(headers)

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout),
    }

    if (body && method !== HTTP_METHODS.GET) {
      if (body instanceof FormData) {
        delete requestHeaders[API_HEADERS.CONTENT_TYPE] // Let browser set it
        requestOptions.body = body
      } else {
        requestOptions.body = JSON.stringify(body)
      }
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions)
        
        if (!response.ok) {
          const errorData = await this.parseResponse(response)
          throw new ApiError(
            response.status,
            response.statusText,
            errorData,
            errorData?.message || `HTTP ${response.status}: ${response.statusText}`
          )
        }

        const data = await this.parseResponse(response)
        return data as ApiResponse<T>
      } catch (error) {
        lastError = error as Error
        
        // Don't retry on client errors (4xx) or if it's the last attempt
        if (error instanceof ApiError && error.status < 500) {
          throw error
        }
        
        if (attempt < retries) {
          await this.delay(this.config.retryDelay * Math.pow(2, attempt))
        }
      }
    }

    throw lastError || new Error('Request failed after all retries')
  }

  // Response Parsing
  private async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      return await response.json()
    }
    
    if (contentType?.includes('text/')) {
      return await response.text()
    }
    
    return await response.blob()
  }

  // Utility Methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // HTTP Method Shortcuts
  protected async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options: Omit<RequestOptions, 'method' | 'params'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: HTTP_METHODS.GET, params })
  }

  protected async post<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: HTTP_METHODS.POST, body })
  }

  protected async put<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: HTTP_METHODS.PUT, body })
  }

  protected async patch<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: HTTP_METHODS.PATCH, body })
  }

  protected async delete<T = any>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: HTTP_METHODS.DELETE })
  }

  // File Upload
  protected async uploadFile<T = any>(
    endpoint: string,
    file: File,
    additionalData: Record<string, any> = {},
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)
    
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    return this.request<T>(endpoint, {
      ...options,
      method: HTTP_METHODS.POST,
      body: formData,
    })
  }

  // Pagination Helper
  protected buildPaginationParams(params: PaginationParams): Record<string, any> {
    return {
      page: params.page || 1,
      per_page: params.per_page || 15,
      sort_by: params.sort_by,
      sort_order: params.sort_order || 'desc',
    }
  }

  // Search Helper
  protected buildSearchParams(params: SearchParams): Record<string, any> {
    const paginationParams = this.buildPaginationParams(params)
    
    return {
      ...paginationParams,
      search: params.search,
      ...params.filters,
    }
  }

  // Error Handling
  protected handleApiError(error: any): never {
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error.name === 'AbortError') {
      throw new ApiError(408, 'Request Timeout', null, 'Request timed out')
    }
    
    throw new ApiError(500, 'Internal Server Error', null, error.message || 'An unexpected error occurred')
  }
}

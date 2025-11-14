// Auth API Service for PHP/MySQL Backend

import { BaseApiService } from './BaseApiService'
import { API_ENDPOINTS } from '../config/endpoints'
import type { 
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  UserUpdateRequest,
  ApiResponse
} from '../types'

export class AuthApiService extends BaseApiService {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
    
    // Store token if login successful
    if (response.success && response.data?.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await this.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, userData)
    
    // Store token if registration successful
    if (response.success && response.data?.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  // Logout user
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await this.post<void>(API_ENDPOINTS.AUTH.LOGOUT)
      this.setToken(null) // Clear token regardless of API response
      return response
    } catch (error) {
      // Clear token even if logout fails
      this.setToken(null)
      throw error
    }
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>(API_ENDPOINTS.AUTH.REFRESH)
    
    // Update token if refresh successful
    if (response.success && response.data?.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  // Get current user profile
  async getProfile(): Promise<ApiResponse<User>> {
    return this.get<User>(API_ENDPOINTS.AUTH.PROFILE)
  }

  // Update user profile
  async updateProfile(data: UserUpdateRequest): Promise<ApiResponse<User>> {
    return this.put<User>(API_ENDPOINTS.AUTH.PROFILE, data)
  }

  // Forgot password
  async forgotPassword(data: PasswordResetRequest): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
  }

  // Reset password
  async resetPassword(data: PasswordResetConfirmRequest): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
  }

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  }

  // Resend verification email
  async resendVerification(): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.AUTH.RESEND_VERIFICATION)
  }

  // Check if user is authenticated
  async checkAuth(): Promise<boolean> {
    try {
      const response = await this.getProfile()
      return response.success
    } catch (error) {
      return false
    }
  }

  // Get user permissions
  async getUserPermissions(): Promise<ApiResponse<{
    permissions: string[]
    role: string
  }>> {
    return this.get(API_ENDPOINTS.AUTH.PROFILE + '/permissions')
  }

  // Change password
  async changePassword(data: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.AUTH.PROFILE + '/change-password', data)
  }

  // Delete account
  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.AUTH.PROFILE + '/delete', { password })
  }

  // Get login history
  async getLoginHistory(): Promise<ApiResponse<Array<{
    ip_address: string
    user_agent: string
    login_at: string
    logout_at?: string
  }>>> {
    return this.get(API_ENDPOINTS.AUTH.PROFILE + '/login-history')
  }

  // Revoke all sessions
  async revokeAllSessions(): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.AUTH.PROFILE + '/revoke-sessions')
  }

  // Enable two-factor authentication
  async enable2FA(): Promise<ApiResponse<{
    qr_code: string
    secret: string
    backup_codes: string[]
  }>> {
    return this.post(API_ENDPOINTS.AUTH.PROFILE + '/2fa/enable')
  }

  // Disable two-factor authentication
  async disable2FA(code: string): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.AUTH.PROFILE + '/2fa/disable', { code })
  }

  // Verify two-factor authentication
  async verify2FA(code: string): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.AUTH.PROFILE + '/2fa/verify', { code })
  }

  // Get backup codes
  async getBackupCodes(): Promise<ApiResponse<string[]>> {
    return this.get(API_ENDPOINTS.AUTH.PROFILE + '/2fa/backup-codes')
  }

  // Regenerate backup codes
  async regenerateBackupCodes(): Promise<ApiResponse<string[]>> {
    return this.post(API_ENDPOINTS.AUTH.PROFILE + '/2fa/regenerate-backup-codes')
  }
}

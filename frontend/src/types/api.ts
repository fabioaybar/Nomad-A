export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

// Format Rupiah
export interface FormatRupiahOptions {
  withFraction?: boolean;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

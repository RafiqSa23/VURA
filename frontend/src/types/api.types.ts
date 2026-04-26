// Error response dari API
export interface ErrorResponse {
  message?: string;
  errors?: string[];
}

// Axios error structure
export interface AxiosError {
  response?: {
    data?: ErrorResponse;
    status?: number;
  };
  message?: string;
  code?: string;
}

// Type guard untuk mengecek Axios error
export const isAxiosError = (error: unknown): error is AxiosError => {
  return typeof error === "object" && error !== null && "response" in error;
};

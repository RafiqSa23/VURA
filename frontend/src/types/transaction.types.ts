import type { Pagination } from "./common.types";

// Transaksi
export interface Transaction {
  _id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

// Request untuk menambah transaksi
export interface AddTransactionRequest {
  amount: number;
  category: string;
  note: string;
  date: string;
}

// Request untuk update transaksi
export interface UpdateTransactionRequest {
  amount?: number;
  category?: string;
  note?: string;
  date?: string;
}

// Request untuk delete transaksi
export interface DeleteTransactionResponse {
  success: boolean;
  message?: string;
}

// Filter untuk transaksi
export interface TransactionFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Response dari API /transactions
export interface TransactionsResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    pagination: Pagination;
  };
  message?: string;
}

// Response single transaction
export interface TransactionResponse {
  success: boolean;
  data: Transaction;
  message?: string;
}

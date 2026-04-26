// Category untuk setup budget
export interface Category {
  name: string;
  percentage: number;
}

// Category untuk setup budget (dengan balance)
export interface CategoryWithBalance extends Category {
  balance: number;
}

// Category dari API (lengkap)
export interface CategoryFromAPI {
  name: string;
  percentage: number;
  allocated: number;
  remaining: number;
  spent: number;
}

// Category untuk dropdown (simplified)
export interface CategoryDropdown {
  name: string;
  remaining: number;
}

// Data budget yang disimpan
export interface BudgetData {
  monthlyIncome: number;
  categories: Category[];
}

// Data untuk dashboard
export interface DashboardData {
  monthlyIncome: number;
  month: string;
  totalSpent: number;
  totalRemaining: number;
  categories: CategoryFromAPI[];
}

// Response dari API /budget
export interface BudgetResponse {
  success: boolean;
  data: DashboardData;
  message?: string;
}

// Request untuk setup budget
export interface SetupBudgetRequest {
  monthlyIncome: number;
  categories: Category[];
}

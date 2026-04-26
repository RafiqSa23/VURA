// Category report
export interface ReportCategory {
  name: string;
  percentage: number;
  allocated: number;
  spent: number;
  remaining: number;
  usagePercentage: number;
}

// Data laporan bulanan
export interface ReportData {
  month: string;
  totalIncome: number;
  totalSpent: number;
  totalRemaining: number;
  categories: ReportCategory[];
}

// Response dari API /reports
export interface ReportResponse {
  success: boolean;
  data: ReportData;
  message?: string;
}

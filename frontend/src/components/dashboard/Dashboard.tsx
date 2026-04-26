import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  RefreshCw,
  Calendar,
  AlertCircle,
} from "lucide-react";
import API from "@/services/api";
import { formatRupiah } from "@/lib/utils";

interface CategoryData {
  name: string;
  percentage: number;
  allocated: number;
  remaining: number;
  spent: number;
}

interface DashboardData {
  monthlyIncome: number;
  month: string;
  totalSpent: number;
  totalRemaining: number;
  categories: CategoryData[];
}

interface ErrorResponse {
  message?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [isNewMonth, setIsNewMonth] = useState(false);

  // Fetch available months
  const fetchAvailableMonths = useCallback(async () => {
    try {
      const response = await API.get("/budget/months");
      if (response.data.success) {
        setAvailableMonths(response.data.data);

        // Set default selected month to latest
        if (response.data.data.length > 0 && !selectedMonth) {
          setSelectedMonth(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch months:", error);
    }
  }, [selectedMonth]);

  // Fetch dashboard data
  const fetchDashboard = useCallback(
    async (month?: string) => {
      setLoading(true);
      setError("");

      try {
        const url = month ? `/budget?month=${month}` : "/budget";
        const response = await API.get(url);
        console.log("Dashboard data:", response.data);

        if (response.data.success) {
          setDashboard(response.data.data);
          if (response.data.data?.month) {
            setSelectedMonth(response.data.data.month);
          }
        } else {
          setError(response.data.message || "Gagal memuat data");
        }
      } catch (err) {
        console.error("Fetch dashboard error:", err);

        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as {
            response: { status: number; data: ErrorResponse };
          };
          if (axiosError.response.status === 404) {
            setError("Belum ada budget. Silakan setup budget terlebih dahulu.");
            setTimeout(() => navigate("/setup-budget"), 2000);
          } else {
            setError(
              axiosError.response.data.message || "Gagal memuat dashboard"
            );
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal memuat dashboard");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Cek apakah bulan baru
  const checkNewMonth = useCallback(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    if (availableMonths.length > 0 && !availableMonths.includes(currentMonth)) {
      setIsNewMonth(true);
    } else {
      setIsNewMonth(false);
    }
  }, [availableMonths]);

  useEffect(() => {
    fetchAvailableMonths();
  }, [fetchAvailableMonths]);

  useEffect(() => {
    if (selectedMonth) {
      fetchDashboard(selectedMonth);
    }
  }, [selectedMonth, fetchDashboard]);

  useEffect(() => {
    checkNewMonth();
  }, [availableMonths, checkNewMonth]);

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen p-4">
            <Card className="max-w-md w-full">
              <CardContent className="pt-6 text-center">
                <div className="text-red-600 mb-4">⚠️ {error}</div>
                <Button onClick={() => navigate("/setup-budget")}>
                  Setup Budget
                </Button>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!dashboard) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <p>No data available</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const totalSpent = dashboard.totalSpent;
  const totalRemaining = dashboard.totalRemaining;
  const spentPercentage = (totalSpent / dashboard.monthlyIncome) * 100;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <span className="text-sm font-medium">KantongVura</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Title & Month Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">
                Lihat ringkasan keuangan Anda
              </p>
            </div>

            {availableMonths.length > 0 && (
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-48">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {formatMonth(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Alert Bulan Baru */}
          {isNewMonth && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-yellow-800 font-medium">
                      Bulan baru telah tiba!
                    </p>
                    <p className="text-yellow-700 text-sm">
                      Buat budget baru untuk bulan{" "}
                      {new Date().toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/setup-budget")}
                  variant="outline"
                  className="border-yellow-400 text-yellow-800 hover:bg-yellow-100"
                >
                  Buat Budget Baru
                </Button>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Gaji
                </CardTitle>
                <Wallet className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatRupiah(dashboard.monthlyIncome)}
                </div>
                <p className="text-xs text-gray-500">
                  {formatMonth(dashboard.month)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Terpakai
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatRupiah(totalSpent)}
                </div>
                <p className="text-xs text-gray-500">
                  {spentPercentage.toFixed(1)}% dari gaji
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Sisa Bulan Ini
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatRupiah(totalRemaining)}
                </div>
                <p className="text-xs text-gray-500">Masih bisa digunakan</p>
              </CardContent>
            </Card>
          </div>

          {/* Penggunaan Budget Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Penggunaan Budget</span>
                <span className="text-gray-600">
                  {spentPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Saldo per Kategori */}
          <h2 className="text-xl font-semibold text-gray-900 mt-2">
            Saldo per Kategori
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.categories.map((category, index) => {
              const percentageUsed =
                (category.spent / category.allocated) * 100;
              const isOverBudget = percentageUsed > 100;

              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      <span className="text-sm text-gray-500">
                        {category.percentage}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full ${
                          isOverBudget ? "bg-red-600" : "bg-blue-600"
                        }`}
                        style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                      />
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Anggaran</span>
                        <span className="font-medium">
                          {formatRupiah(category.allocated)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Terpakai</span>
                        <span className="text-red-600">
                          {formatRupiah(category.spent)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sisa</span>
                        <span
                          className={`font-medium ${
                            isOverBudget ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {formatRupiah(category.remaining)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tombol Tambah Pengeluaran */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => navigate("/add-expense")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah Pengeluaran
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;

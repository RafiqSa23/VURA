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
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
} from "lucide-react";
import API from "@/services/api";
import { formatRupiah } from "@/lib/utils";
import { type ReportData, type ReportResponse } from "@/types";

const MonthlyReport = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  // Fetch report
  const fetchReport = useCallback(async (month?: string) => {
    setLoading(true);
    try {
      const url = month
        ? `/reports/monthly?month=${month}`
        : "/reports/monthly";
      const response = await API.get<ReportResponse>(url);
      console.log("Report response:", response.data);

      if (response.data.success) {
        setReport(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate available months (last 6 months)
  useEffect(() => {
    const months: string[] = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      months.push(monthStr);
    }
    setAvailableMonths(months);
    setSelectedMonth(months[0]);
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchReport(selectedMonth);
    }
  }, [selectedMonth, fetchReport]);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  const handleExport = () => {
    // TODO: Implement export to PDF/Excel
    console.log("Export report for month:", selectedMonth);
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

  if (!report) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-center h-96">
              <Card className="max-w-md w-full">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">
                    Belum ada data untuk bulan ini
                  </p>
                  <Button
                    onClick={() => navigate("/add-expense")}
                    variant="outline"
                    className="mt-4"
                  >
                    + Tambah Pengeluaran
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const totalSpentPercentage = (report.totalSpent / report.totalIncome) * 100;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
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
                <BreadcrumbPage>Laporan Bulanan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Title & Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Laporan Bulanan
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Lihat ringkasan keuangan per bulan
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {formatMonth(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Pendapatan
                </CardTitle>
                <Wallet className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatRupiah(report.totalIncome)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatMonth(report.month)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Pengeluaran
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatRupiah(report.totalSpent)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {totalSpentPercentage.toFixed(1)}% dari pendapatan
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Sisa
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatRupiah(report.totalRemaining)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Bisa ditabung</p>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Penggunaan Budget</span>
                <span className="text-gray-600">
                  {totalSpentPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(totalSpentPercentage, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories Report */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Detail per Kategori
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.categories.map((category, index) => {
                const isOverBudget = category.usagePercentage > 100;

                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {category.percentage}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isOverBudget ? "bg-red-600" : "bg-blue-600"
                          }`}
                          style={{
                            width: `${Math.min(
                              category.usagePercentage,
                              100
                            )}%`,
                          }}
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
          </div>

          {/* Empty state if no categories */}
          {report.categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada data kategori</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MonthlyReport;

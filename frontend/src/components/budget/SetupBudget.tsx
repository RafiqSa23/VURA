import { useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, Trash2, Calendar, Save } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import API from "@/services/api";

interface CategoryInput {
  name: string;
  percentage: number;
}

const defaultCategories: CategoryInput[] = [
  { name: "Kebutuhan", percentage: 50 },
  { name: "Tabungan", percentage: 20 },
  { name: "Hiburan", percentage: 10 },
  { name: "Investasi", percentage: 20 },
];

const SetupBudget = () => {
  const navigate = useNavigate();
  const [income, setIncome] = useState("");
  const [categories, setCategories] =
    useState<CategoryInput[]>(defaultCategories);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPercentage = categories.reduce((s, c) => s + c.percentage, 0);
  const incomeNum = Number(income) || 0;

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }
    setIncome(value);
  };

  const updateCategory = (
    index: number,
    field: keyof CategoryInput,
    value: string | number
  ) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  const addCategory = () => {
    setCategories([...categories, { name: "", percentage: 0 }]);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (totalPercentage !== 100) {
      setError(`Total persentase harus 100% (sekarang ${totalPercentage}%)`);
      return;
    }

    if (!incomeNum || incomeNum <= 0) {
      setError("Masukkan gaji bulanan yang valid");
      return;
    }

    const emptyCategory = categories.find((c) => !c.name.trim());
    if (emptyCategory) {
      setError("Semua kategori harus memiliki nama");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/budget", {
        monthlyIncome: incomeNum,
        month: selectedMonth,
        categories: categories.map((c) => ({
          name: c.name,
          percentage: c.percentage,
        })),
      });

      console.log("Budget saved:", response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to save budget:", err);
      setError("Gagal menyimpan budget. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header dengan Breadcrumb */}
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
                <BreadcrumbPage>Setup Budget</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Setup Budget</h1>
            <p className="text-sm text-gray-500 mt-1">
              Atur gaji bulanan dan bagi ke kategori pengeluaran Anda
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-2xl mx-auto w-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  Informasi Budget
                </CardTitle>
                <CardDescription>
                  Masukkan gaji bulanan dan tentukan persentase untuk setiap
                  kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Input Gaji */}
                  <div className="space-y-2">
                    <Label htmlFor="income" className="text-gray-700">
                      Gaji Bulanan (Rp) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="income"
                      type="text"
                      inputMode="numeric"
                      placeholder="5000000"
                      value={income}
                      onChange={handleIncomeChange}
                      required
                      className="h-12 text-lg"
                    />
                    {incomeNum > 0 && (
                      <p className="text-sm text-green-600 font-medium text-right">
                        {formatRupiah(incomeNum)}
                      </p>
                    )}
                  </div>

                  {/* Pilih Bulan */}
                  <div className="space-y-2">
                    <Label htmlFor="month" className="text-gray-700">
                      Periode Bulan <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="month"
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="h-12 pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Budget akan dibuat untuk bulan{" "}
                      {formatMonth(selectedMonth)}
                    </p>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Kategori Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-700 font-semibold">
                        Kategori Pengeluaran
                      </Label>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          totalPercentage === 100
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        Total: {totalPercentage}%
                      </span>
                    </div>

                    {categories.map((cat, i) => {
                      const allocatedAmount =
                        (incomeNum * cat.percentage) / 100;
                      return (
                        <div
                          key={i}
                          className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-100"
                        >
                          <div className="flex gap-3">
                            <Input
                              placeholder="Nama kategori"
                              value={cat.name}
                              onChange={(e) =>
                                updateCategory(i, "name", e.target.value)
                              }
                              className="flex-1 bg-white"
                              required
                            />
                            {categories.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCategory(i)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                inputMode="numeric"
                                value={cat.percentage}
                                onChange={(e) =>
                                  updateCategory(
                                    i,
                                    "percentage",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-20 text-center bg-white"
                                required
                              />
                              <span className="text-gray-500">%</span>
                            </div>
                            {incomeNum > 0 && (
                              <span className="text-sm text-gray-500">
                                = {formatRupiah(allocatedAmount)}
                              </span>
                            )}
                          </div>

                          {/* Progress bar preview */}
                          {incomeNum > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${cat.percentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCategory}
                      className="w-full border-dashed"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Kategori
                    </Button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading || totalPercentage !== 100 || !incomeNum}
                  >
                    {loading ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Budget
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SetupBudget;

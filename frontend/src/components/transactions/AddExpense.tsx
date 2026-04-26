import { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCw } from "lucide-react";
import API from "../../services/api";
import { formatRupiah } from "../../lib/utils";

// ✅ Import semua types dari file terpisah
import {
  type CategoryDropdown,
  type BudgetResponse,
  type AddTransactionRequest,
  type TransactionsResponse,
  isAxiosError,
} from "../../types";

const AddExpense = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categories, setCategories] = useState<CategoryDropdown[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch categories dari dashboard
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get<BudgetResponse>("/budget");
        console.log("Budget response:", response.data);

        if (response.data.success && response.data.data) {
          const cats = response.data.data.categories.map((c) => ({
            name: c.name,
            remaining: c.remaining,
          }));
          setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Gagal mengambil data kategori");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle input amount: hanya angka, tidak bisa minus
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const amountNum = Number(amount);

    if (!amountNum || amountNum <= 0) {
      setError("Masukkan jumlah pengeluaran yang valid");
      return;
    }

    if (!category) {
      setError("Pilih kategori");
      return;
    }

    // Cek saldo cukup
    const selectedCat = categories.find((c) => c.name === category);
    if (selectedCat && selectedCat.remaining < amountNum) {
      setError(
        `Saldo tidak cukup untuk kategori ${category}. Sisa: ${formatRupiah(
          selectedCat.remaining
        )}`
      );
      return;
    }

    setLoading(true);

    try {
      const requestData: AddTransactionRequest = {
        amount: amountNum,
        category,
        note: note || "",
        date,
      };

      const response = await API.post<TransactionsResponse>(
        "/transactions",
        requestData
      );

      console.log("Transaction added:", response.data);
      setSuccess("Pengeluaran berhasil ditambahkan!");

      // Reset form
      setAmount("");
      setCategory("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);

      // Refresh categories
      const budgetResponse = await API.get<BudgetResponse>("/budget");
      if (budgetResponse.data.success && budgetResponse.data.data) {
        const cats = budgetResponse.data.data.categories.map((c) => ({
          name: c.name,
          remaining: c.remaining,
        }));
        setCategories(cats);
      }

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Add expense error:", err);

      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal menambahkan pengeluaran");
      }
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCategoryRemaining = () => {
    const selected = categories.find((c) => c.name === category);
    return selected ? formatRupiah(selected.remaining) : "";
  };

  if (fetchLoading) {
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
                <BreadcrumbPage>Tambah Pengeluaran</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Tambah Pengeluaran
          </h1>
          <p className="text-sm text-gray-500">
            Catat pengeluaran Anda hari ini
          </p>

          <div className="max-w-md mx-auto w-full">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
                      {success}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-700">
                      Kategori <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            <div className="flex justify-between items-center w-full gap-3">
                              <span className="font-medium">{cat.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {category && (
                      <p className="text-xs text-green-600">
                        Sisa saldo: {getSelectedCategoryRemaining()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-gray-700">
                      Jumlah (Rp) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="amount"
                      type="text"
                      inputMode="numeric"
                      placeholder="50000"
                      value={amount}
                      onChange={handleAmountChange}
                      className="h-12 text-lg"
                      required
                    />
                    {Number(amount) > 0 && (
                      <p className="text-sm text-green-600 font-medium text-right">
                        {formatRupiah(Number(amount))}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note" className="text-gray-700">
                      Catatan (Opsional)
                    </Label>
                    <Input
                      id="note"
                      type="text"
                      placeholder="Contoh: Belanja bulanan"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-gray-700">
                      Tanggal <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white mt-4"
                    disabled={loading || !category || !amount}
                  >
                    {loading ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Pengeluaran
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

export default AddExpense;

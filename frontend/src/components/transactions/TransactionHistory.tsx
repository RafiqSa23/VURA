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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, RefreshCw, Trash2, Pencil } from "lucide-react";
import API from "@/services/api";
import { formatRupiah } from "@/lib/utils";
import {
  type Transaction,
  type TransactionsResponse,
  type BudgetResponse,
  type UpdateTransactionRequest,
} from "@/types";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
    page: 1,
  });

  // State untuk Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // State untuk Delete Alert
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State untuk notifikasi
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "Semua Kategori") {
        params.append("category", filters.category);
      }
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      params.append("page", filters.page.toString());
      params.append("limit", "10");

      const response = await API.get<TransactionsResponse>(
        `/transactions?${params}`
      );
      console.log("Transactions response:", response.data);

      if (response.data.success) {
        setTransactions(response.data.data.transactions);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await API.get<BudgetResponse>("/budget");
      if (response.data.success && response.data.data) {
        const cats = response.data.data.categories.map((c) => c.name);
        setCategories(cats);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle Edit
  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditAmount(transaction.amount.toString());
    setEditCategory(transaction.category);
    setEditNote(transaction.note || "");
    setEditDate(transaction.date.split("T")[0]);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;

    const amountNum = Number(editAmount);
    if (!amountNum || amountNum <= 0) {
      setNotification({ type: "error", message: "Masukkan jumlah yang valid" });
      return;
    }

    if (!editCategory) {
      setNotification({ type: "error", message: "Pilih kategori" });
      return;
    }

    setEditLoading(true);

    try {
      const updateData: UpdateTransactionRequest = {
        amount: amountNum,
        category: editCategory,
        note: editNote,
        date: editDate,
      };

      const response = await API.put(
        `/transactions/${editingTransaction._id}`,
        updateData
      );
      console.log("Update response:", response.data);

      if (response.data.success) {
        setNotification({
          type: "success",
          message: "Transaksi berhasil diupdate!",
        });
        setEditModalOpen(false);
        fetchTransactions(); // Refresh data
        fetchCategories(); // Refresh categories untuk update saldo
      } else {
        setNotification({
          type: "error",
          message: response.data.message || "Gagal mengupdate transaksi",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      setNotification({
        type: "error",
        message: "Terjadi kesalahan saat mengupdate",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteClick = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return;

    setDeleteLoading(true);

    try {
      const response = await API.delete(
        `/transactions/${deletingTransaction._id}`
      );
      console.log("Delete response:", response.data);

      if (response.data.success) {
        setNotification({
          type: "success",
          message: "Transaksi berhasil dihapus!",
        });
        setDeleteAlertOpen(false);
        fetchTransactions(); // Refresh data
        fetchCategories(); // Refresh categories untuk update saldo
      } else {
        setNotification({
          type: "error",
          message: response.data.message || "Gagal menghapus transaksi",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setNotification({
        type: "error",
        message: "Terjadi kesalahan saat menghapus",
      });
    } finally {
      setDeleteLoading(false);
      setDeletingTransaction(null);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, page: 1 });
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      startDate: "",
      endDate: "",
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading && transactions.length === 0) {
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
                <BreadcrumbPage>Riwayat Transaksi</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Notification */}
          {notification && (
            <div
              className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              } text-white animate-in slide-in-from-right`}
            >
              {notification.message}
            </div>
          )}

          {/* Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Riwayat Transaksi
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Lihat dan kelola semua pengeluaran Anda
              </p>
            </div>
            <Button
              onClick={() => navigate("/add-expense")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              + Tambah Pengeluaran
            </Button>
          </div>

          {/* Filter Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-gray-700">Kategori</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters({ ...filters, category: value, page: 1 })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semua Kategori">
                        Semua Kategori
                      </SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-gray-700">Dari Tanggal</Label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        startDate: e.target.value,
                        page: 1,
                      })
                    }
                    className="h-10"
                  />
                </div>

                <div>
                  <Label className="text-sm text-gray-700">
                    Sampai Tanggal
                  </Label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        endDate: e.target.value,
                        page: 1,
                      })
                    }
                    className="h-10"
                  />
                </div>

                <div className="flex gap-2 items-end">
                  <Button
                    onClick={handleSearch}
                    className="flex-1 h-10 bg-blue-600 hover:bg-blue-700"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Cari
                  </Button>
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="h-10"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardContent className="pt-6">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Belum ada transaksi</p>
                  <Button
                    onClick={() => navigate("/add-expense")}
                    variant="outline"
                    className="mt-4"
                  >
                    + Tambah Pengeluaran Pertama
                  </Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Kategori</TableHead>
                          <TableHead>Catatan</TableHead>
                          <TableHead className="text-right">Jumlah</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx) => (
                          <TableRow key={tx._id}>
                            <TableCell className="whitespace-nowrap">
                              {formatDate(tx.date)}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                {tx.category}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {tx.note || "-"}
                            </TableCell>
                            <TableCell className="text-right font-medium text-red-600">
                              -{formatRupiah(tx.amount)}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleEditClick(tx)}
                                  className="text-blue-500 hover:text-blue-700 transition"
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(tx)}
                                  className="text-red-500 hover:text-red-700 transition"
                                  title="Hapus"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                      >
                        Previous
                      </Button>
                      <span className="py-2 px-3 text-sm">
                        Halaman {filters.page} dari {pagination.pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
            <DialogDescription>
              Ubah data pengeluaran Anda di bawah ini
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategori</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-amount">Jumlah (Rp)</Label>
                <Input
                  id="edit-amount"
                  type="text"
                  inputMode="numeric"
                  value={editAmount}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length > 1 && value.startsWith("0")) {
                      value = value.replace(/^0+/, "");
                    }
                    setEditAmount(value);
                  }}
                  placeholder="50000"
                  required
                />
                {Number(editAmount) > 0 && (
                  <p className="text-xs text-green-600 text-right">
                    {formatRupiah(Number(editAmount))}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-note">Catatan (Opsional)</Label>
                <Input
                  id="edit-note"
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Contoh: Belanja bulanan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-date">Tanggal</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={editLoading}
              >
                {editLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Transaksi "{deletingTransaction?.category}" sebesar{" "}
              {formatRupiah(deletingTransaction?.amount || 0)} akan dihapus
              secara permanen.
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default TransactionHistory;

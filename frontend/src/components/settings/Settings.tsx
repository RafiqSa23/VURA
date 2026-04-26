import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Key, Save, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import API from "@/services/api";
import {
  type UpdateProfileRequest,
  type ChangePasswordRequest,
} from "../../types";

const Settings = () => {
  // Hapus navigate karena tidak digunakan
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Profile form state
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email] = useState(user?.email || "");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const request: UpdateProfileRequest = {};
      if (name !== user?.name) request.name = name;
      if (username !== user?.username) request.username = username;

      if (Object.keys(request).length === 0) {
        setNotification({
          type: "error",
          message: "Tidak ada perubahan yang dilakukan",
        });
        setLoading(false);
        return;
      }

      const response = await API.put("/users/profile", request);
      console.log("Update profile response:", response.data);

      if (response.data.success) {
        updateUser({
          name: response.data.data.name,
          username: response.data.data.username,
        });
        setNotification({
          type: "success",
          message: "Profil berhasil diperbarui!",
        });
      } else {
        setNotification({
          type: "error",
          message: response.data.message || "Gagal memperbarui profil",
        });
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setNotification({
        type: "error",
        message: "Terjadi kesalahan saat memperbarui profil",
      });
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setNotification({ type: "error", message: "Password baru tidak sama" });
      return;
    }

    if (newPassword.length < 6) {
      setNotification({
        type: "error",
        message: "Password minimal 6 karakter",
      });
      return;
    }

    setLoading(true);

    try {
      const request: ChangePasswordRequest = {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      };

      const response = await API.put("/users/change-password", request);
      console.log("Change password response:", response.data);

      if (response.data.success) {
        setNotification({
          type: "success",
          message: "Password berhasil diubah!",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setNotification({
          type: "error",
          message: response.data.message || "Gagal mengubah password",
        });
      }
    } catch (error) {
      console.error("Change password error:", error);
      setNotification({
        type: "error",
        message: "Terjadi kesalahan saat mengubah password",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (user?.name && user.name !== "")
      return user.name.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  if (!user) {
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
                <BreadcrumbPage>Pengaturan</BreadcrumbPage>
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola profil dan keamanan akun Anda
            </p>
          </div>

          <div className="max-w-2xl mx-auto w-full">
            {/* Profile Card */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 bg-blue-600">
                    <AvatarFallback className="text-white text-xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user?.name || user?.username || user?.email}
                    </h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profil
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  Keamanan
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Profil</CardTitle>
                    <CardDescription>
                      Ubah informasi profil Anda di sini
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          Nama yang akan ditampilkan di aplikasi
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Masukkan username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          Username unik untuk login
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="bg-gray-100"
                        />
                        <p className="text-xs text-gray-500">
                          Email tidak dapat diubah
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Ganti Password</CardTitle>
                    <CardDescription>
                      Ubah password akun Anda di sini
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Password Saat Ini
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Masukkan password saat ini"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">Password Baru</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Minimal 6 karakter"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Konfirmasi Password Baru
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Ketik ulang password baru"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? "Menyimpan..." : "Ganti Password"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Settings;

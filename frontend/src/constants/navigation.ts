import {
  LayoutDashboard,
  PlusCircle,
  History,
  BarChart3,
  Settings,
  CalendarPlus, // Tambah icon ini
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navMain: NavGroup[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Transaksi",
    items: [
      {
        title: "Tambah Pengeluaran",
        url: "/add-expense",
        icon: PlusCircle,
      },
      {
        title: "Riwayat Transaksi",
        url: "/history",
        icon: History,
      },
    ],
  },
  {
    title: "Laporan",
    items: [
      {
        title: "Laporan Bulanan",
        url: "/report",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Budget",
    items: [
      {
        title: "Budget Baru",
        url: "/setup-budget",
        icon: CalendarPlus,
      },
    ],
  },
  {
    title: "Pengaturan",
    items: [
      {
        title: "Pengaturan",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];

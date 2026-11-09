"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Receipt,
  History,
  Users,
  ShieldCheck,
  Settings,
  Bell,
  Plus,
  LogOut,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";
import { useBank } from "@/context/BankContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import Logo from "@/components/public/Logo";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, balance, notifications, markNotificationsAsRead } = useBank();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Strict Authentication Guard
  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      if (!isSupabaseConfigured) {
        router.replace("/login");
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session || !session.user) {
          if (isMounted) {
            setIsAuthenticated(false);
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
          }
          return;
        }

        if (isMounted) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (isMounted) {
          setIsAuthenticated(false);
          router.replace("/login");
        }
      }
    }

    verifyAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        if (isMounted) {
          setIsAuthenticated(false);
          router.replace("/login");
        }
      } else if (session) {
        if (isMounted) {
          setIsAuthenticated(true);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Fund Transfer", href: "/dashboard/transfer", icon: Send },
    { name: "Deposit Money", href: "/dashboard/deposit", icon: ArrowDownLeft },
    { name: "Withdraw", href: "/dashboard/withdraw", icon: ArrowUpRight },
    { name: "Virtual Cards", href: "/dashboard/cards", icon: CreditCard },
    { name: "My DPS", href: "/dashboard/dps", icon: PiggyBank },
    { name: "My FDR", href: "/dashboard/fdr", icon: TrendingUp },
    { name: "My Loans", href: "/dashboard/loans", icon: Receipt },
    { name: "Pay Bills", href: "/dashboard/bills", icon: Receipt },
    { name: "Transactions", href: "/dashboard/transactions", icon: History },
    { name: "Referral Rewards", href: "/dashboard/referral", icon: Users },
    { name: "KYC Verification", href: "/dashboard/kyc", icon: ShieldCheck },
    { name: "Support Tickets", href: "/dashboard/tickets", icon: Bell },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Strict Security Shield: Never render dashboard until auth is verified
  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-[#2E1A11]">
        <div className="w-16 h-16 rounded-3xl bg-[#4E342E] text-white flex items-center justify-center mb-6 shadow-xl shadow-[#4E342E]/25 animate-pulse">
          <ShieldCheck className="w-8 h-8 text-[#D4A373]" />
        </div>
        <Logo href="/" size="lg" />
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#8D6E63] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A16207] animate-ping" />
          Verifying PennyWiseTrust Security...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FAF7F2] text-[#2C1D16] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-20 shrink-0 bg-white/95 backdrop-blur-md border-b border-[#EADFD5] shadow-xs px-4 sm:px-8 flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#4E342E] hover:text-[#2E1A11]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Logo href="/dashboard" size="md" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EADFD5] text-xs font-mono text-[#5D4037]">
            <span className="text-[#8D6E63] font-sans font-semibold">A/C:</span>
            <span className="font-bold">{user.accountNumber}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Quick Balance indicator */}
          <div className="hidden md:flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5]">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#8D6E63]">Available Balance</p>
              <p className="text-base font-black text-[#2E1A11]">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
              </p>
            </div>
            <Link
              href="/dashboard/deposit"
              className="p-2 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white transition-colors shadow-xs"
              title="Add Money"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markNotificationsAsRead();
              }}
              className="relative p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#5D4037] hover:text-[#2E1A11] hover:bg-[#F2ECE4] transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4A373] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white border border-[#EADFD5] shadow-2xl p-4 z-50 animate-slide-up">
                <div className="flex items-center justify-between pb-3 border-b border-[#EADFD5] mb-3">
                  <h4 className="text-sm font-bold text-[#2E1A11]">Notifications</h4>
                  <span className="text-xs text-[#8D6E63] font-semibold">All updates</span>
                </div>
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-xs space-y-1"
                    >
                      <p className="font-semibold text-[#2E1A11]">{n.title}</p>
                      <p className="text-[10px] text-[#8D6E63]">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4E342E] to-[#795548] text-white font-bold flex items-center justify-center text-sm shadow-md shadow-[#4E342E]/20">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#2E1A11]">{user.name}</span>
                {user.kycStatus === "approved" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5D4037]" />
                )}
              </div>
              <p className="text-[11px] text-[#8D6E63] font-mono">@{user.username}</p>
            </div>
            <button
              onClick={async () => {
                if (isSupabaseConfigured) {
                  await supabase.auth.signOut();
                }
                router.push("/");
              }}
              className="p-2 text-[#8D6E63] hover:text-[#2E1A11] transition-colors ml-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-[#EADFD5] p-4 space-y-1 overflow-y-auto h-full overscroll-contain">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#8D6E63]">
            Account Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  active
                    ? "bg-[#4E342E] text-white shadow-md shadow-[#4E342E]/25 -translate-r-0.5"
                    : "text-[#6D4C41] hover:text-[#2E1A11] hover:bg-[#FAF7F2]"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-[#8D6E63]"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-6 mt-auto">
            <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#EADFD5] text-center space-y-2">
              <p className="text-xs font-bold text-[#2E1A11]">Need Support?</p>
              <p className="text-[11px] text-[#6D4C41]">
                Our banking concierges are available 24/7.
              </p>
              <Link
                href="/contact"
                className="inline-block w-full py-1.5 rounded-lg bg-white border border-[#D7CCC8] hover:bg-[#FAF7F2] text-xs font-bold text-[#4E342E] transition-colors shadow-2xs"
              >
                Open Ticket
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#FDFBF7]/95 flex flex-col p-6 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between pb-6 border-b border-[#EADFD5] mb-4">
              <Logo href="/dashboard" size="md" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#4E342E] hover:text-[#2E1A11]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                      active
                        ? "bg-[#4E342E] text-white"
                        : "text-[#5D4037] hover:bg-[#F2ECE4]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 h-full w-full overscroll-contain">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Transaction {
  id: string;
  trx: string;
  type: "deposit" | "transfer" | "withdraw" | "dps" | "fdr" | "loan" | "bill" | "bonus";
  title: string;
  amount: number;
  charge: number;
  status: "success" | "pending" | "failed";
  method: string;
  date: string;
  rawDate?: string;
  details?: string;
}

export interface VirtualCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  cardType: "Visa" | "Mastercard";
  tier: "Standard" | "Platinum" | "Black";
  isFrozen: boolean;
  isPaid: boolean;
  creationFee: number;
  limit: number;
  spent: number;
}

export interface DpsScheme {
  id: string;
  planName: string;
  installment: number; // monthly
  totalInstallments: number;
  givenInstallments: number;
  interestRate: number; // e.g. 8.5%
  matureAmount: number;
  nextInstallmentDate: string;
  status: "active" | "matured" | "closed";
}

export interface FdrDeposit {
  id: string;
  planName: string;
  depositAmount: number;
  profitRate: number; // e.g. 12%
  profitAmount: number;
  durationMonths: number;
  matureDate: string;
  status: "running" | "matured";
}

export interface LoanApplication {
  id: string;
  loanName: string;
  amount: number;
  installment: number;
  totalInstallments: number;
  paidInstallments: number;
  status: "approved" | "pending" | "rejected";
  nextPaymentDate: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  username: string;
  email: string;
  accountNumber: string;
  phone: string;
  country: string;
  address: string;
  kycStatus: "approved" | "pending" | "unverified";
  twoFactorEnabled: boolean;
  referralCode: string;
  referralCount: number;
  referralBonus: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  status?: string;
  details?: string;
}

interface BankContextType {
  user: UserProfile;
  balance: number;
  transactions: Transaction[];
  cards: VirtualCard[];
  dpsSchemes: DpsScheme[];
  fdrDeposits: FdrDeposit[];
  loans: LoanApplication[];
  notifications: NotificationItem[];
  isSupabaseConnected: boolean;
  makeTransfer: (recipientAccount: string, amount: number, note: string) => boolean;
  deposit: (method: string, amount: number, reference?: string) => void;
  withdraw: (method: string, amount: number, accountDetails: string) => boolean;
  createDps: (planName: string, monthlyAmount: number, months: number, rate: number) => boolean;
  createFdr: (planName: string, amount: number, months: number, rate: number) => boolean;
  applyLoan: (loanName: string, amount: number, months: number) => void;
  payBill: (biller: string, category: string, amount: number, reference: string) => boolean;
  toggleFreezeCard: (cardId: string) => void;
  payCardFee: (cardId: string) => { success: boolean; error?: string };
  createVirtualCard: (tier: "Standard" | "Platinum" | "Black", type: "Visa" | "Mastercard") => { success: boolean; error?: string };
  updateKycStatus: (status: "approved" | "pending" | "unverified") => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  markNotificationsAsRead: () => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

// Helpers to normalize snake_case Supabase records & camelCase local state
const mapCard = (c: any): VirtualCard => ({
  id: c.id,
  cardNumber: c.card_number || c.cardNumber || "4532 **** **** ****",
  cardHolder: c.card_holder || c.cardHolder || "PENNYWISE CLIENT",
  expiry: c.expiry || "09/29",
  cvv: c.cvv || "000",
  cardType: c.card_type || c.cardType || "Visa",
  tier: c.tier || "Platinum",
  isFrozen: Boolean(c.is_frozen ?? c.isFrozen),
  isPaid: Boolean(c.is_paid ?? c.isPaid),
  creationFee: Number(c.creation_fee ?? c.creationFee ?? 50),
  limit: Number(c.spend_limit ?? c.limit ?? 5000),
  spent: Number(c.spent ?? 0),
});

const mapDps = (d: any): DpsScheme => ({
  id: d.id,
  planName: d.plan_name || d.planName || "DPS Scheme",
  installment: Number(d.installment ?? 0),
  totalInstallments: Number(d.total_installments ?? d.totalInstallments ?? 0),
  givenInstallments: Number(d.given_installments ?? d.givenInstallments ?? 1),
  interestRate: Number(d.interest_rate ?? d.interestRate ?? 0),
  matureAmount: Number(d.mature_amount ?? d.matureAmount ?? 0),
  nextInstallmentDate: d.next_installment_date || d.nextInstallmentDate || "",
  status: d.status || "active",
});

const mapFdr = (f: any): FdrDeposit => ({
  id: f.id,
  planName: f.plan_name || f.planName || "Fixed Deposit",
  depositAmount: Number(f.deposit_amount ?? f.depositAmount ?? 0),
  profitRate: Number(f.profit_rate ?? f.profitRate ?? 0),
  profitAmount: Number(f.profit_amount ?? f.profitAmount ?? 0),
  durationMonths: Number(f.duration_months ?? f.durationMonths ?? 12),
  matureDate: f.mature_date || f.matureDate || "",
  status: f.status || "running",
});

const mapLoan = (l: any): LoanApplication => ({
  id: l.id,
  loanName: l.loan_name || l.loanName || "Loan Facility",
  amount: Number(l.amount ?? 0),
  installment: Number(l.installment ?? 0),
  totalInstallments: Number(l.total_installments ?? l.totalInstallments ?? 0),
  paidInstallments: Number(l.paid_installments ?? l.paidInstallments ?? 0),
  status: l.status || "pending",
  nextPaymentDate: l.next_payment_date || l.nextPaymentDate || "Upon approval",
});

const initialFallbackTransactions: Transaction[] = [
  {
    id: "tx-wire-1",
    trx: "TRX-WIRE-8500-B",
    type: "transfer",
    title: "Wire Transfer Failed",
    amount: 8500.0,
    charge: 0.0,
    status: "failed",
    method: "Wire",
    date: "09 Nov 2026, 18:25",
    rawDate: "2026-11-09T17:25:00.000Z",
    details: "Wire transfer failed - Outgoing wire facility locked. Funds were not debited.",
  },
  {
    id: "tx-wire-2",
    trx: "TRX-WIRE-8500-A",
    type: "transfer",
    title: "Wire Transfer Failed",
    amount: 8500.0,
    charge: 0.0,
    status: "failed",
    method: "Wire",
    date: "09 Nov 2026, 17:50",
    rawDate: "2026-11-09T16:50:00.000Z",
    details: "Wire transfer failed - Compliance security protocol active. Funds were not debited.",
  },
];

function formatNotificationTime(rawDate?: string, formattedDate?: string): string {
  if (rawDate) {
    try {
      const parsed = new Date(rawDate);
      const diffMs = Date.now() - parsed.getTime();
      if (!isNaN(diffMs)) {
        if (diffMs < 60 * 1000 && diffMs >= -30000) return "Just now";
        if (diffMs >= 60 * 1000 && diffMs < 3600 * 1000) {
          const mins = Math.floor(diffMs / (60 * 1000));
          return `${mins} minute${mins === 1 ? "" : "s"} ago`;
        }
        if (diffMs >= 3600 * 1000 && diffMs < 24 * 3600 * 1000) {
          const hours = Math.floor(diffMs / (3600 * 1000));
          return `${hours} hour${hours === 1 ? "" : "s"} ago`;
        }
      }
    } catch {}
  }
  return formattedDate || "Recently";
}

function createNotificationsFromTransactions(
  txList: Transaction[],
  existingNotifications?: NotificationItem[],
  useRelativeTime = false
): NotificationItem[] {
  const readMap = new Map(existingNotifications?.map((n) => [n.id, n.read]));
  return txList.slice(0, 2).map((t, idx) => {
    const isCredit = t.type === "deposit" || t.type === "bonus";
    const sign = t.status === "failed" ? "-" : (isCredit ? "+" : "-");
    const formattedAmount = `$${Number(t.amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} USD`;
    const notifId = `notif-tx-${t.id || t.trx || idx}`;

    return {
      id: notifId,
      title: `${t.title}: ${sign}${formattedAmount}`,
      details: t.details,
      status: t.status,
      time: useRelativeTime ? formatNotificationTime(t.rawDate, t.date) : (t.date || "Recently"),
      read: readMap.get(notifId) ?? false,
    };
  });
}

export function BankProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    name: "PennyWise Client",
    username: "pennywise_client",
    email: "client@pennywisetrust.com",
    accountNumber: "19571391378",
    phone: "+1 (555) 019-2831",
    country: "United States",
    address: "Wall Street, New York, NY",
    kycStatus: "approved",
    twoFactorEnabled: false,
    referralCode: "PWT7821",
    referralCount: 0,
    referralBonus: 0.0,
  });

  const [balance, setBalance] = useState<number>(8.0);

  const [transactions, setTransactions] = useState<Transaction[]>(initialFallbackTransactions);

  const [cards, setCards] = useState<VirtualCard[]>([
    {
      id: "card-1",
      cardNumber: "4532 8920 1934 8841",
      cardHolder: "PENNYWISE CLIENT",
      expiry: "09/29",
      cvv: "492",
      cardType: "Visa",
      tier: "Platinum",
      isFrozen: false,
      isPaid: false,
      creationFee: 50,
      limit: 5000,
      spent: 0,
    },
  ]);

  const [dpsSchemes, setDpsSchemes] = useState<DpsScheme[]>([]);

  const [fdrDeposits, setFdrDeposits] = useState<FdrDeposit[]>([]);

  const [loans, setLoans] = useState<LoanApplication[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    createNotificationsFromTransactions(initialFallbackTransactions, undefined, false)
  );

  useEffect(() => {
    if (transactions.length > 0) {
      setNotifications((prev) => createNotificationsFromTransactions(transactions, prev, true));
    }
  }, [transactions]);

  // Load from Supabase if configured, otherwise localStorage
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured) {
        try {
          const { data: authData } = await supabase.auth.getUser();
          const authUser = authData?.user;

          if (authUser) {
            setUser((prev) => ({
              ...prev,
              id: authUser.id,
              email: authUser.email || prev.email,
              name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || prev.name,
              username: authUser.user_metadata?.username || authUser.email?.split("@")[0] || prev.username,
            }));

            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", authUser.id)
              .single();

            if (profile) {
              setBalance(Number(profile.balance));
              setUser((prev) => ({
                ...prev,
                id: profile.id,
                name: profile.full_name || prev.name,
                email: profile.email || prev.email,
                username: profile.username || prev.username,
                balance: Number(profile.balance),
                kycStatus: profile.kyc_status || prev.kycStatus,
                accountNumber: profile.account_number || prev.accountNumber,
                phone: profile.phone || prev.phone,
                referralCode: profile.referral_code || prev.referralCode,
                referralCount: profile.referral_count ?? prev.referralCount,
                referralBonus: Number(profile.referral_bonus ?? prev.referralBonus),
              }));
            }

            const { data: txs } = await supabase
              .from("transactions")
              .select("*")
              .eq("user_id", authUser.id)
              .order("created_at", { ascending: false });

            if (txs && txs.length > 0) {
              setTransactions(
                txs.map((t: any) => ({
                  id: t.id,
                  trx: t.trx_id,
                  type: t.type,
                  title: t.title,
                  amount: Number(t.amount),
                  charge: Number(t.charge),
                  status: t.status,
                  method: t.method,
                  date: new Date(t.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  rawDate: t.created_at,
                  details: t.details,
                }))
              );
            } else {
              // Guaranteed $8.00 signup bonus transaction
              setTransactions([
                {
                  id: "tx-bonus-" + authUser.id,
                  trx: "TRX" + authUser.id.replace(/-/g, "").substring(0, 10).toUpperCase(),
                  type: "bonus",
                  title: "Signup Bonus",
                  amount: 8.0,
                  charge: 0.0,
                  status: "success",
                  method: "System",
                  date: "Just now",
                  details: "Welcome bonus for opening PennyWiseTrust digital account",
                },
              ]);
            }

            const { data: cardsData } = await supabase
              .from("virtual_cards")
              .select("*")
              .eq("user_id", authUser.id);

            if (cardsData) {
              setCards(cardsData.map(mapCard));
            }

            const { data: dpsData } = await supabase
              .from("dps_schemes")
              .select("*")
              .eq("user_id", authUser.id);
            if (dpsData) {
              setDpsSchemes(dpsData.map(mapDps));
            }

            const { data: fdrData } = await supabase
              .from("fdr_deposits")
              .select("*")
              .eq("user_id", authUser.id);
            if (fdrData) {
              setFdrDeposits(fdrData.map(mapFdr));
            }

            const { data: loanData } = await supabase
              .from("loans")
              .select("*")
              .eq("user_id", authUser.id);
            if (loanData) {
              setLoans(loanData.map(mapLoan));
            }
          } else {
            // No authenticated user
            setBalance(0);
            setTransactions([]);
            setCards([]);
            setDpsSchemes([]);
            setFdrDeposits([]);
            setLoans([]);
          }
          return;
        } catch (e) {
          console.warn("Supabase load fallback:", e);
        }
      }

      // Local storage fallback
      try {
        const saved = localStorage.getItem("pennywise_bank_data");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (
            (parsed.user && (parsed.user.name?.includes("Hito") || parsed.user.username?.includes("hitohoc"))) ||
            parsed.dpsSchemes?.some((d: any) => d.id === "dps-1") ||
            parsed.fdrDeposits?.some((f: any) => f.id === "fdr-1")
          ) {
            // Clean up old stale demo balances and user from previous session
            localStorage.removeItem("pennywise_bank_data");
          } else {
            if (parsed.balance !== undefined) setBalance(parsed.balance);
            if (parsed.user) setUser(parsed.user);
            if (parsed.transactions) setTransactions(parsed.transactions);
            if (parsed.cards) setCards(parsed.cards.map(mapCard));
            if (parsed.dpsSchemes) setDpsSchemes(parsed.dpsSchemes.map(mapDps));
            if (parsed.fdrDeposits) setFdrDeposits(parsed.fdrDeposits.map(mapFdr));
            if (parsed.loans) setLoans(parsed.loans.map(mapLoan));
          }
        }
      } catch (e) {
        console.warn("Local storage fallback:", e);
      }
    }

    loadData();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          try {
            localStorage.removeItem("pennywise_bank_data");
          } catch (e) {}
          setUser({
            name: "PennyWise Client",
            username: "client",
            email: "client@pennywisetrust.com",
            accountNumber: "19570000000",
            phone: "+1 (555) 000-0000",
            country: "United States",
            address: "",
            kycStatus: "unverified",
            twoFactorEnabled: false,
            referralCode: "",
            referralCount: 0,
            referralBonus: 0,
          });
          setBalance(0);
          setTransactions([]);
          setCards([]);
          return;
        }

        if (session?.user) {
          const authUser = session.user;
          setUser((prev) => ({
            ...prev,
            id: authUser.id,
            email: authUser.email || prev.email,
            name: authUser.user_metadata?.full_name || prev.name,
            username: authUser.user_metadata?.username || prev.username,
          }));
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .single();
          if (profile) {
            setBalance(Number(profile.balance));
            setUser((prev) => ({
              ...prev,
              id: profile.id,
              name: profile.full_name || prev.name,
              balance: Number(profile.balance),
              accountNumber: profile.account_number || prev.accountNumber,
              referralCode: profile.referral_code || prev.referralCode,
              referralCount: profile.referral_count ?? prev.referralCount,
              referralBonus: Number(profile.referral_bonus ?? prev.referralBonus),
            }));
          }

          const { data: txs } = await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", authUser.id)
            .order("created_at", { ascending: false });

          if (txs && txs.length > 0) {
            setTransactions(
              txs.map((t: any) => ({
                id: t.id,
                trx: t.trx_id,
                type: t.type,
                title: t.title,
                amount: Number(t.amount),
                charge: Number(t.charge),
                status: t.status,
                method: t.method,
                date: new Date(t.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                rawDate: t.created_at,
                details: t.details,
              }))
            );
          } else {
            setTransactions([
              {
                id: "tx-bonus-" + authUser.id,
                trx: "TRX" + authUser.id.replace(/-/g, "").substring(0, 10).toUpperCase(),
                type: "bonus",
                title: "Signup Bonus",
                amount: 8.0,
                charge: 0.0,
                status: "success",
                method: "System",
                date: "Just now",
                details: "Welcome bonus for opening PennyWiseTrust digital account",
              },
            ]);
          }

          const { data: cardsData } = await supabase
            .from("virtual_cards")
            .select("*")
            .eq("user_id", authUser.id);
          if (cardsData) setCards(cardsData.map(mapCard));

          const { data: dpsData } = await supabase
            .from("dps_schemes")
            .select("*")
            .eq("user_id", authUser.id);
          if (dpsData) setDpsSchemes(dpsData.map(mapDps));

          const { data: fdrData } = await supabase
            .from("fdr_deposits")
            .select("*")
            .eq("user_id", authUser.id);
          if (fdrData) setFdrDeposits(fdrData.map(mapFdr));

          const { data: loanData } = await supabase
            .from("loans")
            .select("*")
            .eq("user_id", authUser.id);
          if (loanData) setLoans(loanData.map(mapLoan));
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        "pennywise_bank_data",
        JSON.stringify({
          balance,
          user,
          transactions,
          cards,
          dpsSchemes,
          fdrDeposits,
          loans,
        })
      );
    } catch (e) {
      console.warn("Could not save to storage", e);
    }
  }, [balance, user, transactions, cards, dpsSchemes, fdrDeposits, loans]);

  const makeTransfer = (recipientAccount: string, amount: number, note: string) => {
    if (balance < amount) return false;
    const fee = amount * 0.005; // 0.5%
    const totalDeduction = amount + fee;
    if (balance < totalDeduction) return false;

    setBalance((prev) => prev - totalDeduction);
    const trxId = `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      trx: trxId,
      type: "transfer",
      title: `Transfer to A/C: ${recipientAccount}`,
      amount: amount,
      charge: fee,
      status: "success",
      method: "Internal Transfer",
      date: "Just now",
      details: note || "Direct account fund transfer",
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (isSupabaseConfigured) {
      supabase.from("transactions").insert({
        user_id: user?.id || null,
        trx_id: trxId,
        type: "transfer",
        title: `Transfer to A/C: ${recipientAccount}`,
        amount,
        charge: fee,
        status: "success",
        method: "Internal Transfer",
        details: note,
      }).then();
    }

    return true;
  };

  const deposit = (method: string, amount: number, reference?: string) => {
    const fee = amount * 0.015; // 1.5% charge
    const trxId = `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      trx: trxId,
      type: "deposit",
      title: `Deposit via ${method}`,
      amount: amount,
      charge: fee,
      status: "pending",
      method: method,
      date: "Just now",
      details: reference ? `Ref: ${reference}` : "Deposit request initiated",
    };

    setTransactions((prev) => [newTx, ...prev]);

    if (isSupabaseConfigured) {
      supabase.from("deposits").insert({
        user_id: user?.id || null,
        trx_id: trxId,
        method,
        amount,
        charge: fee,
        wallet_address: reference,
        status: "pending",
      }).then();

      supabase.from("transactions").insert({
        user_id: user?.id || null,
        trx_id: trxId,
        type: "deposit",
        title: `Deposit via ${method}`,
        amount,
        charge: fee,
        status: "pending",
        method,
        details: reference,
      }).then();
    }
  };

  const withdraw = (method: string, amount: number, accountDetails: string) => {
    if (balance < amount) return false;
    const fee = 2.5;
    if (balance < amount + fee) return false;

    setBalance((prev) => prev - (amount + fee));
    const trxId = `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      trx: trxId,
      type: "withdraw",
      title: `Withdrawal via ${method}`,
      amount: amount,
      charge: fee,
      status: "pending",
      method: method,
      date: "Just now",
      details: accountDetails,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const createDps = (planName: string, monthlyAmount: number, months: number, rate: number) => {
    if (balance < monthlyAmount) return false;
    setBalance((prev) => prev - monthlyAmount);

    const totalProfit = monthlyAmount * months * (rate / 100);
    const mature = monthlyAmount * months + totalProfit;

    const newScheme: DpsScheme = {
      id: `dps-${Date.now()}`,
      planName,
      installment: monthlyAmount,
      totalInstallments: months,
      givenInstallments: 1,
      interestRate: rate,
      matureAmount: Math.round(mature),
      nextInstallmentDate: "Next Month",
      status: "active",
    };

    setDpsSchemes((prev) => [newScheme, ...prev]);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      trx: `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      type: "dps",
      title: `DPS First Installment - ${planName}`,
      amount: monthlyAmount,
      charge: 0,
      status: "success",
      method: "Balance",
      date: "Just now",
      details: `Enrolled in ${months}-month DPS`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const createFdr = (planName: string, amount: number, months: number, rate: number) => {
    if (balance < amount) return false;
    setBalance((prev) => prev - amount);

    const profit = Math.round(amount * (rate / 100) * (months / 12));
    const newFdr: FdrDeposit = {
      id: `fdr-${Date.now()}`,
      planName,
      depositAmount: amount,
      profitRate: rate,
      profitAmount: profit,
      durationMonths: months,
      matureDate: `${months} Months from now`,
      status: "running",
    };

    setFdrDeposits((prev) => [newFdr, ...prev]);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      trx: `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      type: "fdr",
      title: `FDR Lock - ${planName}`,
      amount: amount,
      charge: 0,
      status: "success",
      method: "Balance",
      date: "Just now",
      details: `Term deposit locked at ${rate}% annual profit`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const applyLoan = (loanName: string, amount: number, months: number) => {
    const monthly = Math.round((amount * 1.08) / months);
    const newLoan: LoanApplication = {
      id: `loan-${Date.now()}`,
      loanName,
      amount,
      installment: monthly,
      totalInstallments: months,
      paidInstallments: 0,
      status: "pending",
      nextPaymentDate: "Upon approval",
    };
    setLoans((prev) => [newLoan, ...prev]);
  };

  const payBill = (biller: string, category: string, amount: number, reference: string) => {
    if (balance < amount) return false;
    setBalance((prev) => prev - amount);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      trx: `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      type: "bill",
      title: `Bill Payment - ${biller} (${category})`,
      amount: amount,
      charge: 0,
      status: "success",
      method: "Wallet",
      date: "Just now",
      details: `Ref / Meter: ${reference}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const toggleFreezeCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c))
    );
  };

  const payCardFee = (cardId: string): { success: boolean; error?: string } => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return { success: false, error: "Card not found" };
    if (card.isPaid) return { success: true };

    const fee = card.creationFee || 50;
    if (balance < fee) {
      return {
        success: false,
        error: `Insufficient balance ($${balance.toFixed(2)} USD). Card issuance fee is $${fee.toFixed(2)} USD. Please deposit funds first.`,
      };
    }

    setBalance((prev) => prev - fee);
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isPaid: true } : c))
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      trx: `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      type: "bill",
      title: `Virtual Card Issuance Fee - ${card.tier}`,
      amount: fee,
      charge: 0,
      status: "success",
      method: "Balance",
      date: "Just now",
      details: `Card activation and unmasking fee paid for ${card.tier} ${card.cardType}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    return { success: true };
  };

  const createVirtualCard = (
    tier: "Standard" | "Platinum" | "Black",
    type: "Visa" | "Mastercard"
  ): { success: boolean; error?: string } => {
    const fee = tier === "Black" ? 100 : tier === "Platinum" ? 50 : 25;
    if (balance < fee) {
      return {
        success: false,
        error: `Insufficient balance ($${balance.toFixed(2)} USD). Issuing a ${tier} card requires a $${fee.toFixed(2)} USD issuance fee. Please add funds via Bitcoin or Cash deposit.`,
      };
    }

    setBalance((prev) => prev - fee);

    const prefix = type === "Visa" ? "4" : "5";
    const randPart = Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
    const formatted = `${prefix}${randPart.substring(0, 3)} ${randPart.substring(3, 7)} ${randPart.substring(7, 11)} ${randPart.substring(11, 15)}`;
    const newCard: VirtualCard = {
      id: `card-${Date.now()}`,
      cardNumber: formatted,
      cardHolder: user.name.toUpperCase(),
      expiry: "11/30",
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      cardType: type,
      tier: tier,
      isFrozen: false,
      isPaid: true,
      creationFee: fee,
      limit: tier === "Black" ? 25000 : tier === "Platinum" ? 10000 : 2500,
      spent: 0,
    };
    setCards((prev) => [...prev, newCard]);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      trx: `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      type: "bill",
      title: `Virtual Card Issuance - ${tier}`,
      amount: fee,
      charge: 0,
      status: "success",
      method: "Balance",
      date: "Just now",
      details: `Card generation fee for ${tier} ${type}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    return { success: true };
  };

  const updateKycStatus = (status: "approved" | "pending" | "unverified") => {
    setUser((prev) => ({ ...prev, kycStatus: status }));
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <BankContext.Provider
      value={{
        user,
        balance,
        transactions,
        cards,
        dpsSchemes,
        fdrDeposits,
        loans,
        notifications,
        isSupabaseConnected: isSupabaseConfigured,
        makeTransfer,
        deposit,
        withdraw,
        createDps,
        createFdr,
        applyLoan,
        payBill,
        toggleFreezeCard,
        payCardFee,
        createVirtualCard,
        updateKycStatus,
        updateProfile,
        markNotificationsAsRead,
      }}
    >
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error("useBank must be used within a BankProvider");
  }
  return context;
}

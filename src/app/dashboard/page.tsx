"use client";

import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Receipt,
  Users,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { user, balance, transactions, dpsSchemes, fdrDeposits, loans, cards } = useBank();

  // Compute metrics
  const totalDeposit = transactions
    .filter((t) => t.type === "deposit" && t.status === "success")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalTransfer = transactions
    .filter((t) => t.type === "transfer" && t.status === "success")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDpsAmount = dpsSchemes.reduce(
    (acc, d) => acc + (Number(d.installment) || 0) * (Number(d.givenInstallments) || 1),
    0
  );

  const totalFdrAmount = fdrDeposits.reduce((acc, f) => acc + (Number(f.depositAmount) || 0), 0);

  const primaryCard = cards[0];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-slide-up">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1A11] border border-[#5D4037] shadow-xl text-white">
          <div>
            <span className="text-xs font-semibold text-[#D7CCC8] mb-1 block">Welcome Back,</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {user.name}
            </h1>
            <p className="text-xs text-[#D7CCC8] mt-1 font-mono">
              Account Num: {user.accountNumber}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/referral"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-all hover:scale-105"
            >
              <Users className="w-4 h-4 text-[#D4A373]" />
              <span>Earn $10 Referral Bonus</span>
            </Link>

            <Link
              href="/dashboard/deposit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#c29160] text-[#241611] text-xs font-black shadow-lg shadow-black/20 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Deposit Funds</span>
            </Link>
          </div>
        </div>

        {/* Primary Account Balances Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Main Wallet */}
          <div className="p-6 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:shadow-xl hover:border-[#8D6E63] hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#8D6E63]">Default Checking A/C</span>
              <span className="px-2 py-0.5 rounded bg-[#EFEBE9] text-[#4E342E] text-[10px] font-bold">
                Primary
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-[#2E1A11]">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-[#8D6E63] mt-1 font-mono">{user.accountNumber}</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-[#EADFD5]">
              <Link
                href="/dashboard/transfer"
                className="flex-1 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EFEBE9] text-center text-xs font-bold text-[#4E342E] transition-colors"
              >
                Send
              </Link>
              <Link
                href="/dashboard/withdraw"
                className="flex-1 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EFEBE9] text-center text-xs font-bold text-[#4E342E] transition-colors"
              >
                Withdraw
              </Link>
            </div>
          </div>

          {/* My DPS */}
          <div className="p-6 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:shadow-xl hover:border-[#8D6E63] hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#8D6E63]">Pension Scheme (DPS)</span>
              <PiggyBank className="w-4 h-4 text-[#5D4037]" />
            </div>
            <div>
              <p className="text-3xl font-black text-[#4E342E]">
                ${totalDpsAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-[#8D6E63] mt-1">
                {dpsSchemes.length} Active Plan{dpsSchemes.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="pt-2 border-t border-[#EADFD5]">
              <Link
                href="/dashboard/dps"
                className="block text-center text-xs font-bold text-[#4E342E] hover:text-[#2E1A11] transition-colors"
              >
                View Plans & Enroll →
              </Link>
            </div>
          </div>

          {/* My FDR */}
          <div className="p-6 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:shadow-xl hover:border-[#8D6E63] hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#8D6E63]">Fixed Deposits (FDR)</span>
              <TrendingUp className="w-4 h-4 text-[#795548]" />
            </div>
            <div>
              <p className="text-3xl font-black text-[#3E2723]">
                ${totalFdrAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-[#8D6E63] mt-1">
                {fdrDeposits.length} Locked Deposit{fdrDeposits.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="pt-2 border-t border-[#EADFD5]">
              <Link
                href="/dashboard/fdr"
                className="block text-center text-xs font-bold text-[#4E342E] hover:text-[#2E1A11] transition-colors"
              >
                Open FDR Deposit →
              </Link>
            </div>
          </div>

          {/* My Loan */}
          <div className="p-6 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:shadow-xl hover:border-[#8D6E63] hover:-translate-y-1 transition-all duration-300 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#8D6E63]">Active Credit / Loans</span>
              <Receipt className="w-4 h-4 text-[#8D6E63]" />
            </div>
            <div>
              <p className="text-3xl font-black text-[#2E1A11]">
                ${loans.reduce((acc, l) => acc + (Number(l.amount) || 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-[#8D6E63] mt-1">
                {loans.length} Ongoing Facility
              </p>
            </div>
            <div className="pt-2 border-t border-[#EADFD5]">
              <Link
                href="/dashboard/loans"
                className="block text-center text-xs font-bold text-[#4E342E] hover:text-[#2E1A11] transition-colors"
              >
                Request Commercial Loan →
              </Link>
            </div>
          </div>
        </div>

        {/* Action Widgets & Virtual Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Transfer & Action Shortcuts */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-[#2E1A11]">Quick Banking Services</h3>
                <span className="text-xs text-[#8D6E63] font-semibold">Instant Execution</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link
                  href="/dashboard/transfer"
                  className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EADFD5] hover:border-[#BCAAA4] text-center space-y-2 group hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-[#4E342E] shadow-2xs flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="block text-xs font-bold text-[#2E1A11]">Send Money</span>
                </Link>

                <Link
                  href="/dashboard/deposit"
                  className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EADFD5] hover:border-[#BCAAA4] text-center space-y-2 group hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-[#4E342E] shadow-2xs flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <span className="block text-xs font-bold text-[#2E1A11]">Deposit</span>
                </Link>

                <Link
                  href="/dashboard/withdraw"
                  className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EADFD5] hover:border-[#BCAAA4] text-center space-y-2 group hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-[#4E342E] shadow-2xs flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <span className="block text-xs font-bold text-[#2E1A11]">Withdraw</span>
                </Link>

                <Link
                  href="/dashboard/cards"
                  className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#EADFD5] hover:border-[#BCAAA4] text-center space-y-2 group hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-[#4E342E] shadow-2xs flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="block text-xs font-bold text-[#2E1A11]">Cards</span>
                </Link>
              </div>
            </div>

            {/* Quick Aggregate Stats */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs">
              <h3 className="text-base font-bold text-[#2E1A11] mb-5">Account Activity Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5]">
                  <p className="text-[11px] text-[#8D6E63] font-semibold">Total Deposits</p>
                  <p className="text-base font-black text-[#2E1A11] mt-1">
                    ${totalDeposit} USD
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5]">
                  <p className="text-[11px] text-[#8D6E63] font-semibold">Total Transfers</p>
                  <p className="text-base font-black text-[#2E1A11] mt-1">
                    ${totalTransfer} USD
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5]">
                  <p className="text-[11px] text-[#8D6E63] font-semibold">Referral Bonus</p>
                  <p className="text-base font-black text-[#4E342E] mt-1">
                    ${user.referralBonus} USD
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5]">
                  <p className="text-[11px] text-[#8D6E63] font-semibold">Total Referrals</p>
                  <p className="text-base font-black text-[#5D4037] mt-1">
                    {user.referralCount} Users
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Virtual Card Showcase */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#2E1A11]">Active Virtual Card</h3>
                <Link
                  href="/dashboard/cards"
                  className="text-xs text-[#4E342E] hover:text-[#2E1A11] font-bold"
                >
                  Manage Cards →
                </Link>
              </div>

              {primaryCard ? (
                <div className="relative w-full aspect-[1.58/1] rounded-2xl bg-gradient-to-tr from-[#241611] via-[#3E2723] to-[#5D4037] p-6 text-white shadow-xl border border-[#795548]/40 flex flex-col justify-between overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-[#D7CCC8] uppercase">
                        PennyWiseTrust Bank
                      </span>
                      <p className="text-sm font-black text-white">{primaryCard.tier} Card</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-white/10 text-xs font-mono font-bold">
                      {primaryCard.cardType}
                    </span>
                  </div>

                  <div className="my-auto font-mono text-lg sm:text-xl tracking-widest text-white drop-shadow">
                    {primaryCard.isPaid ? primaryCard.cardNumber : "•••• •••• •••• ••••"}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[9px] uppercase text-[#D7CCC8]">Cardholder</p>
                      <p className="font-bold text-white">{primaryCard.cardHolder}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-[#D7CCC8]">Expires</p>
                      <p className="font-bold text-white">{primaryCard.isPaid ? primaryCard.expiry : "••/••"}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold">
                      <span className={`w-1.5 h-1.5 rounded-full ${!primaryCard.isPaid ? "bg-amber-400" : primaryCard.isFrozen ? "bg-red-400" : "bg-emerald-400"}`} />
                      <span>{!primaryCard.isPaid ? "UNACTIVATED" : primaryCard.isFrozen ? "FROZEN" : "ACTIVE"}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-between text-xs text-[#8D6E63] font-medium pt-1">
                <span>Monthly Limit: $5,000</span>
                <span>Current Spent: ${primaryCard?.spent.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2E1A11]">Recent Transactions</h3>
            <Link
              href="/dashboard/transactions"
              className="text-xs font-bold text-[#4E342E] hover:text-[#2E1A11]"
            >
              View Full History →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EADFD5] text-[#8D6E63]">
                  <th className="pb-3 font-bold">Description</th>
                  <th className="pb-3 font-bold">Transaction ID</th>
                  <th className="pb-3 font-bold">Type</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Fee</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFD5]">
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 pr-4 font-bold text-[#2E1A11]">{tx.title}</td>
                    <td className="py-3.5 pr-4 font-mono text-[#5D4037] font-semibold">{tx.trx}</td>
                    <td className="py-3.5 pr-4 uppercase text-[#8D6E63] font-bold">{tx.type}</td>
                    <td className="py-3.5 pr-4 font-black text-[#2E1A11]">
                      {tx.type === "deposit" || tx.type === "bonus" ? "+" : "-"}
                      ${tx.amount.toFixed(2)} USD
                    </td>
                    <td className="py-3.5 pr-4 text-[#8D6E63]">
                      -${tx.charge.toFixed(2)} USD
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${tx.status === "success"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : tx.status === "pending"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                      >
                        {tx.status === "success" && <CheckCircle2 className="w-3 h-3" />}
                        {tx.status === "pending" && <Clock className="w-3 h-3" />}
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#8D6E63]">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

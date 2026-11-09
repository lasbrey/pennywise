"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { CheckCircle2, AlertCircle, DollarSign } from "lucide-react";

export default function FdrPage() {
  const { balance, fdrDeposits, createFdr } = useBank();
  const [amount, setAmount] = useState<number | "">("");
  const [selectedPlan, setSelectedPlan] = useState("Alpha 1-Year Shield (10.5%)");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const plans = [
    { name: "3-Month Sprint", months: 3, rate: 8.0 },
    { name: "6-Month Accelerator", months: 6, rate: 9.2 },
    { name: "Alpha 1-Year Shield", months: 12, rate: 10.5 },
    { name: "Supreme 3-Year Compounding", months: 36, rate: 12.5 },
  ];

  const currentPlan = plans.find((p) => p.name === selectedPlan) || plans[2];
  const lockAmount = Number(amount) || 0;
  const projectedProfit = Math.round(lockAmount * (currentPlan.rate / 100) * (currentPlan.months / 12));

  const handleOpenFdr = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (lockAmount < 100) {
      setError("Minimum FDR deposit is $100.00.");
      return;
    }

    if (lockAmount > balance) {
      setError(`Insufficient balance. Required: $${lockAmount.toFixed(2)}, Available: $${balance.toFixed(2)}.`);
      return;
    }

    const ok = createFdr(currentPlan.name, lockAmount, currentPlan.months, currentPlan.rate);
    if (ok) {
      setSuccess(true);
      setAmount("");
    } else {
      setError("Could not process FDR lock.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
            Fixed Deposit Receipts (FDR)
          </h1>
          <p className="text-sm text-[#6D4C41] mt-1">
            Lock in guaranteed high-yield term deposits with fixed returns up to 12.5% APY.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>FDR Term Deposit successfully locked! Profit will accrue directly to your portfolio.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create FDR form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] space-y-6 shadow-xs">
            <h3 className="text-base font-bold text-[#2E1A11]">Open New Fixed Term Deposit</h3>

            <form onSubmit={handleOpenFdr} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                  Select FDR Yield Plan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {plans.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setSelectedPlan(p.name)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedPlan === p.name
                          ? "bg-[#F5EFE6] border-[#4E342E] shadow-2xs"
                          : "bg-[#FAF7F2] border-[#EADFD5] text-[#6D4C41] hover:bg-[#EFEBE9]"
                      }`}
                    >
                      <p className="text-xs font-bold text-[#2E1A11]">{p.name}</p>
                      <p className="text-[11px] text-[#4E342E] font-bold mt-1">
                        {p.rate}% APY • {p.months} Mos
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-[#6D4C41]">
                    Deposit Principal (USD)
                  </label>
                  <span className="text-xs text-[#8D6E63]">
                    Available: <strong className="text-[#4E342E] font-mono">${balance.toFixed(2)}</strong>
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8D6E63]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                    placeholder="1000.00"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm font-black"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#EADFD5] grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8D6E63] font-semibold">Guaranteed Profit:</span>
                  <p className="text-xl font-black text-[#2E1A11] mt-0.5">
                    +${projectedProfit.toLocaleString()} USD
                  </p>
                </div>
                <div>
                  <span className="text-[#8D6E63] font-semibold">Total at Maturity:</span>
                  <p className="text-xl font-black text-[#4E342E] mt-0.5">
                    ${(lockAmount + projectedProfit).toLocaleString()} USD
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-sm shadow-md shadow-[#4E342E]/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                Lock FDR Deposit
              </button>
            </form>
          </div>

          {/* Active FDR list */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-[#2E1A11]">Active Locked Deposits</h3>
            {fdrDeposits.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-[#EADFD5] text-center text-xs text-[#8D6E63]">
                No active FDR deposits currently running.
              </div>
            ) : (
              fdrDeposits.map((f) => (
                <div
                  key={f.id}
                  className="p-5 rounded-2xl bg-white border border-[#EADFD5] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2E1A11]">{f.planName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      {f.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#8D6E63]">Principal:</span>
                      <p className="font-bold text-[#2E1A11]">${f.depositAmount.toLocaleString()} USD</p>
                    </div>
                    <div>
                      <span className="text-[#8D6E63]">Profit Rate:</span>
                      <p className="font-bold text-[#4E342E]">{f.profitRate}% APY</p>
                    </div>
                    <div>
                      <span className="text-[#8D6E63]">Est. Return:</span>
                      <p className="font-bold text-[#5D4037]">+${f.profitAmount.toLocaleString()} USD</p>
                    </div>
                    <div>
                      <span className="text-[#8D6E63]">Maturity:</span>
                      <p className="font-semibold text-[#2E1A11]">{f.matureDate}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

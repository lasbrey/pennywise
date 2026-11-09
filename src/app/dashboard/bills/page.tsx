"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { CheckCircle2, AlertCircle, DollarSign, Zap, Wifi, Tv, Droplet } from "lucide-react";

export default function BillsPage() {
  const { balance, payBill } = useBank();
  const [category, setCategory] = useState("Electricity");
  const [biller, setBiller] = useState("National Grid Power");
  const [amount, setAmount] = useState<number | "">("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = [
    { name: "Electricity", icon: Zap, billers: ["National Grid Power", "Pacific Gas & Electric", "ConEdison"] },
    { name: "Internet & Telecom", icon: Wifi, billers: ["Starlink Global", "AT&T Fiber", "Verizon Wireless"] },
    { name: "Water & Utilities", icon: Droplet, billers: ["Metropolitan Water District", "City Municipal Water"] },
    { name: "Digital Subscriptions", icon: Tv, billers: ["Netflix Streaming", "Amazon Prime", "Spotify Premium"] },
  ];

  const currentCategoryObj = categories.find((c) => c.name === category) || categories[0];
  const billAmount = Number(amount) || 0;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (billAmount <= 0) {
      setError("Please specify a valid bill amount.");
      return;
    }

    if (billAmount > balance) {
      setError(`Insufficient balance. Required: $${billAmount.toFixed(2)}, Available: $${balance.toFixed(2)}.`);
      return;
    }

    const ok = payBill(biller, category, billAmount, reference);
    if (ok) {
      setSuccess(true);
      setAmount("");
      setReference("");
    } else {
      setError("Could not settle bill.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
            Pay Utilities & Invoices
          </h1>
          <p className="text-sm text-[#6D4C41] mt-1">
            Settle utility, telecommunications, and subscription bills instantly from your checking balance.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] shadow-xs">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EFEBE9] text-[#4E342E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#2E1A11]">Bill Payment Authorized!</h3>
              <p className="text-[#6D4C41] text-sm max-w-md mx-auto">
                Your payment to <strong className="text-[#2E1A11]">{biller}</strong> has been debited and transmitted to the billing authority.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#4E342E] text-white text-xs font-bold hover:bg-[#3E2723] transition-colors"
              >
                Pay Another Bill
              </button>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-6">
              {/* Category picker */}
              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                  Service Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {categories.map((c) => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setCategory(c.name);
                          setBiller(c.billers[0]);
                        }}
                        className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                          category === c.name
                            ? "bg-[#F5EFE6] border-[#4E342E] text-[#2E1A11]"
                            : "bg-[#FAF7F2] border-[#EADFD5] text-[#6D4C41] hover:bg-[#EFEBE9]"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-[#4E342E]" />
                        <span className="text-xs font-bold">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                  Select Provider / Biller
                </label>
                <select
                  value={biller}
                  onChange={(e) => setBiller(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-sm font-semibold"
                >
                  {currentCategoryObj.billers.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                  Account / Meter / Reference Number
                </label>
                <input
                  type="text"
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. ACC-8841920-01"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-[#6D4C41]">
                    Payment Amount (USD)
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
                    placeholder="75.00"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm font-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-sm shadow-md shadow-[#4E342E]/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                Execute Bill Payment
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

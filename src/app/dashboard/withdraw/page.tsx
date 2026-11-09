"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { ArrowUpRight, CheckCircle2, AlertCircle, DollarSign } from "lucide-react";

export default function WithdrawPage() {
  const { balance, withdraw } = useBank();
  const [method, setMethod] = useState("Bank Wire (SWIFT / ACH)");
  const [amount, setAmount] = useState<number | "">("");
  const [accountDetails, setAccountDetails] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const withdrawAmount = Number(amount) || 0;
  const fee = 2.5;
  const total = withdrawAmount + fee;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (withdrawAmount < 500) {
      setError("Minimum withdrawable amount is $500.00 USD.");
      return;
    }

    if (total > balance) {
      setError(`Insufficient balance. Required: $${total.toFixed(2)}, Available: $${balance.toFixed(2)}`);
      return;
    }

    const ok = withdraw(method, withdrawAmount, accountDetails);
    if (ok) {
      setSuccess(true);
      setAmount("");
      setAccountDetails("");
    } else {
      setError("Withdrawal could not be processed. Please check available funds.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
            Withdraw Funds
          </h1>
          <p className="text-sm text-[#6D4C41] mt-1">
            Cash out funds from your digital balance directly to external bank accounts or crypto addresses.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] shadow-xs">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EFEBE9] text-[#4E342E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#2E1A11]">Withdrawal Request Dispatched!</h3>
              <p className="text-[#6D4C41] text-sm max-w-md mx-auto">
                Your withdrawal has been registered in the system queue. Payouts are dispatched within 1-2 business hours.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#4E342E] text-white text-xs font-bold hover:bg-[#3E2723] transition-all hover:scale-105"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleWithdraw} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                  Withdrawal Destination Channel
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] focus:outline-none focus:border-[#4E342E] text-sm font-semibold"
                >
                  <option value="Bank Wire (SWIFT / ACH)">
                    Bank Wire (SWIFT / ACH)
                  </option>
                  <option value="Crypto USDT TRC20">
                    Crypto USDT (TRC20 Network)
                  </option>
                  <option value="Crypto Bitcoin (BTC)">
                    Crypto Bitcoin (BTC)
                  </option>
                  <option value="Debit Card Cashout">
                    Direct Card Cashout (Visa Direct)
                  </option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#6D4C41]">
                    Withdrawal Amount (USD)
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
                    placeholder="500.00"
                    min="500"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm font-black"
                  />
                </div>
                <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-lg mt-2 font-bold flex items-center justify-between">
                  <span>Minimum withdrawable: $500.00 USD</span>
                  <span>Network clearing fee: $2.50 USD</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                  Destination Details (Account Number / IBAN / Wallet Address)
                </label>
                <textarea
                  rows={3}
                  required
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="Provide recipient bank routing, account number, or crypto wallet address..."
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm font-mono"
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#EADFD5] space-y-2 text-xs">
                <div className="flex justify-between text-[#6D4C41]">
                  <span>Gross Withdrawal:</span>
                  <span className="font-mono font-bold text-[#2E1A11]">${withdrawAmount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-[#6D4C41]">
                  <span>Network Handling Fee:</span>
                  <span className="font-mono font-bold text-[#2E1A11]">${fee.toFixed(2)} USD</span>
                </div>
                <div className="pt-2 border-t border-[#D7CCC8] flex justify-between font-bold text-sm">
                  <span className="text-[#2E1A11]">Total Deducted:</span>
                  <span className="text-[#4E342E] font-mono font-black">${total.toFixed(2)} USD</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-sm shadow-md shadow-[#4E342E]/25 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Confirm Withdrawal</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

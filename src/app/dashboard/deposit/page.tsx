"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import {
  Copy,
  Check,
  Upload,
  AlertTriangle,
  History,
  CheckCircle2,
  DollarSign,
  Banknote,
} from "lucide-react";

export default function DepositPage() {
  const { deposit } = useBank();
  const [gateway, setGateway] = useState<"bitcoin" | "cash">("bitcoin");
  const [amount, setAmount] = useState<string>("5003");
  const [copied, setCopied] = useState(false);
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const btcAddress = process.env.NEXT_PUBLIC_BTC_DEPOSIT_ADDRESS || "bc1qed0jznt99dsc8d6qdffdr4janr634nem8n580x";
  const numAmount = parseFloat(amount) || 0;
  const chargeRate = 0.015; // 1.5%
  const charge = numAmount * chargeRate;
  const total = numAmount + charge;
  const btcRate = 0.000016; // 1 USD = 0.000016 BTC
  const payableBtc = (total * btcRate).toFixed(7);

  const handleCopy = () => {
    navigator.clipboard?.writeText(btcAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (numAmount < 500) {
      setError("Minimum deposit amount is 500 USD.");
      return;
    }

    if (numAmount > 5000000) {
      setError("Maximum deposit amount is 5,000,000 USD.");
      return;
    }

    deposit(
      gateway === "bitcoin" ? "Bitcoin deposit" : "Cash deposit",
      numAmount,
      gateway === "bitcoin" ? `BTC Tx to ${btcAddress.slice(0, 10)}...` : "Branch Counter Cash Deposit"
    );
    setSubmitted(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
              Add Money
            </h1>
            <p className="text-sm text-[#6D4C41] mt-1">
              Deposit funds directly via Bitcoin blockchain or Cash counter branch.
            </p>
          </div>
          <Link
            href="/dashboard/transactions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white text-xs font-bold shadow-md shadow-[#4E342E]/25 transition-all self-start sm:self-auto hover:scale-105"
          >
            <History className="w-4 h-4" />
            <span>Deposit History</span>
          </Link>
        </div>

        {submitted ? (
          <div className="p-10 rounded-3xl bg-white border border-[#EADFD5] text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#EFEBE9] text-[#4E342E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#2E1A11]">Deposit Request Recorded!</h3>
            <p className="text-[#6D4C41] text-sm max-w-lg mx-auto">
              Your <strong className="text-[#2E1A11]">{gateway === "bitcoin" ? "Bitcoin" : "Cash"}</strong> deposit of{" "}
              <strong className="text-[#2E1A11]">${numAmount.toLocaleString()} USD</strong> has been registered in the system.
              {gateway === "bitcoin"
                ? " Once confirmed on the blockchain network, your balance will be updated automatically."
                : " Your cashier deposit ticket is active for teller processing."}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFileSelected(null);
              }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#4E342E] text-white text-xs font-bold hover:bg-[#3E2723] transition-all hover:scale-105"
            >
              Make Another Deposit
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Input Row: Gateway & Amount */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Select Gateway */}
                <div>
                  <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                    Select Gateway<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gateway}
                    onChange={(e) => setGateway(e.target.value as "bitcoin" | "cash")}
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] font-bold text-sm focus:outline-none focus:border-[#4E342E]"
                  >
                    <option value="bitcoin">₿ Bitcoin deposit</option>
                    <option value="cash">💵 Cash deposit</option>
                  </select>
                  <p className="text-[11px] text-[#A1887F] font-semibold mt-1">Charge 1.5 %</p>
                </div>

                {/* Enter Amount */}
                <div>
                  <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                    Enter Amount:<span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      required
                      min={500}
                      max={5000000}
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="5003"
                      className="w-full px-4 py-3.5 rounded-l-2xl bg-[#FAF7F2] border border-r-0 border-[#EADFD5] text-[#2E1A11] font-black text-sm focus:outline-none focus:border-[#4E342E]"
                    />
                    <div className="px-5 py-3.5 bg-[#FAF7F2] border border-l-0 border-[#EADFD5] rounded-r-2xl font-bold text-xs text-[#6D4C41] flex items-center">
                      USD
                    </div>
                  </div>
                  <p className="text-[11px] text-[#A1887F] font-semibold mt-1">
                    Minimum 500 USD and Maximum 5000000 USD
                  </p>
                </div>
              </div>

              {/* Informational Box: Fund Your Account */}
              {gateway === "bitcoin" ? (
                <div className="p-6 rounded-2xl bg-[#FFF8E7] border border-[#FFE082] space-y-4 text-xs text-[#5D4037]">
                  <h4 className="font-extrabold text-[#3E2723] text-sm uppercase tracking-wide">
                    Fund Your Account
                  </h4>
                  <p className="leading-relaxed">
                    To complete your deposit, send funds to the wallet address provided below. Please ensure you copy the full address to avoid any loss of funds.
                  </p>

                  <div>
                    <p className="text-[11px] font-bold text-[#8D6E63] uppercase tracking-wider mb-1">
                      Wallet Address:
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3.5 rounded-xl bg-white border border-[#FFE082] font-mono font-bold text-xs text-[#2E1A11] break-all select-all">
                        {btcAddress}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="px-4 py-3.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all shadow-xs"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-amber-900 font-semibold pt-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Important:</strong> Double-check the address before sending. Funds sent to an incorrect address cannot be recovered.
                    </span>
                  </div>

                  <p className="text-[11px] text-[#795548]">
                    Once the transaction is confirmed on the network, your account will be credited automatically.
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#FFF8E7] border border-[#FFE082] space-y-4 text-xs text-[#5D4037]">
                  <h4 className="font-extrabold text-[#3E2723] text-sm uppercase tracking-wide">
                    Direct Cash Counter Deposit
                  </h4>
                  <p className="leading-relaxed">
                    Present your deposit ticket to the cashier counter at any PennyWiseTrust Bank authorized branch or partner financial kiosk.
                  </p>
                  <div>
                    <p className="text-[11px] font-bold text-[#8D6E63] uppercase tracking-wider mb-1">
                      Teller Voucher Code:
                    </p>
                    <div className="p-3.5 rounded-xl bg-white border border-[#FFE082] font-mono font-bold text-xs text-[#2E1A11]">
                      PWT-CASH-8841-NYC (Floor 4, Financial District)
                    </div>
                  </div>
                </div>
              )}

              {/* Proof of Deposit Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#6D4C41]">
                  Proof of deposit (Screenshot, receipt)
                </label>
                <label className="border-2 border-dashed border-[#D7CCC8] hover:border-[#4E342E] rounded-3xl p-8 text-center flex flex-col items-center justify-center cursor-pointer bg-[#FAF7F2] transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFileSelected(e.target.files[0].name);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#4E342E] flex items-center justify-center mb-3 shadow-2xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#4E342E]">
                    {fileSelected ? `Selected: ${fileSelected}` : "Select Proof of deposit (Screenshot, reciept)"}
                  </span>
                  <span className="text-[10px] text-[#A1887F] mt-1">PNG, JPG, or PDF under 10MB</span>
                </label>
              </div>
            </div>

            {/* Review Details Table - Exactly matching Image 4 */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-4">
              <h3 className="text-base font-black text-[#2E1A11]">Review Details:</h3>

              <div className="divide-y divide-[#EADFD5] text-xs">
                <div className="py-3.5 flex justify-between items-center">
                  <span className="font-bold text-[#6D4C41]">Amount:</span>
                  <span className="font-bold text-[#2E1A11]">{numAmount.toLocaleString()} USD</span>
                </div>

                <div className="py-3.5 flex justify-between items-center">
                  <span className="font-bold text-[#6D4C41]">Charge:</span>
                  <span className="font-bold text-red-600">{charge.toFixed(2)} USD</span>
                </div>

                <div className="py-3.5 flex justify-between items-center">
                  <span className="font-bold text-[#6D4C41]">Payment Method:</span>
                  <span className="px-3 py-1 rounded-full bg-[#EFEBE9] text-[#4E342E] font-bold text-[11px]">
                    {gateway === "bitcoin" ? "Bitcoin Deposit" : "Cash Deposit"}
                  </span>
                </div>

                <div className="py-3.5 flex justify-between items-center">
                  <span className="font-bold text-[#6D4C41]">Payment Method Logo:</span>
                  <span className="w-6 h-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {gateway === "bitcoin" ? "₿" : "$"}
                  </span>
                </div>

                {gateway === "bitcoin" && (
                  <div className="py-3.5 flex justify-between items-center">
                    <span className="font-bold text-[#6D4C41]">Conversion Rate:</span>
                    <span className="font-bold text-[#2E1A11]">1 USD = 0.000016 BTC</span>
                  </div>
                )}

                <div className="py-3.5 flex justify-between items-center">
                  <span className="font-bold text-[#6D4C41]">Total:</span>
                  <span className="font-black text-[#2E1A11] text-sm">{total.toFixed(2)} USD</span>
                </div>

                {gateway === "bitcoin" && (
                  <div className="py-3.5 flex justify-between items-center">
                    <span className="font-bold text-[#6D4C41]">Payable Amount:</span>
                    <span className="font-mono font-black text-[#4E342E] text-sm">{payableBtc} BTC</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-black text-sm shadow-md shadow-[#4E342E]/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                Confirm Deposit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

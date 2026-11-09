"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { CheckCircle2, AlertCircle, ArrowRight, DollarSign, Lock, ShieldAlert, Building2, MapPin } from "lucide-react";
import Link from "next/link";

export default function TransferPage() {
  const { balance } = useBank();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [type, setType] = useState<"internal" | "wire">("internal");
  const [showHoldModal, setShowHoldModal] = useState(false);

  const handleTransferAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHoldModal(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-12">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
            Fund Transfer
          </h1>
          <p className="text-sm text-[#6D4C41] mt-1">
            Send money securely to internal PennyWiseTrust accounts or external bank wire destinations.
          </p>
        </div>

        {/* SECURITY LOCK NOTICE */}
        <div className="p-6 sm:p-7 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 shadow-xs">
              <Lock className="w-6 h-6 text-amber-800" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  Security Protocol Active
                </span>
                <span className="text-xs font-bold text-amber-900">Transfer Facility Locked</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-amber-950">
                Outgoing Fund Transfers Are Temporarily Restricted
              </h3>
              <p className="text-xs text-amber-900/90 leading-relaxed max-w-2xl">
                For account compliance and anti-fraud verification on newly established accounts, outgoing wires and internal fund transfers are locked by default.
                <strong> Please hold and visit your nearest PennyWiseTrust branch</strong> with a valid government-issued ID to activate wire capabilities.
              </p>
            </div>
          </div>
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowHoldModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>Locate Nearest Branch</span>
            </button>
            <Link
              href="/dashboard/tickets"
              className="px-4 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100/50 transition-colors"
            >
              Contact Support Concierge
            </Link>
          </div>
        </div>

        {/* Transfer Mode Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-white border border-[#EADFD5] max-w-md shadow-xs opacity-75">
          <button
            type="button"
            onClick={() => setType("internal")}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              type === "internal"
                ? "bg-[#4E342E] text-white shadow-md shadow-[#4E342E]/25"
                : "text-[#6D4C41] hover:text-[#2E1A11]"
            }`}
          >
            PennyWiseTrust Internal (Locked)
          </button>
          <button
            type="button"
            onClick={() => setType("wire")}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              type === "wire"
                ? "bg-[#4E342E] text-white shadow-md shadow-[#4E342E]/25"
                : "text-[#6D4C41] hover:text-[#2E1A11]"
            }`}
          >
            International Wire (Locked)
          </button>
        </div>

        {/* Transfer Form Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] shadow-xs relative overflow-hidden">
          <form onSubmit={handleTransferAttempt} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                {type === "internal" ? "Recipient Account Number" : "IBAN / SWIFT Routing Code"}
              </label>
              <input
                type="text"
                required
                disabled
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={type === "internal" ? "e.g. 19570029182" : "e.g. US29PWTR0001928371"}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-sm font-semibold opacity-70 cursor-not-allowed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#6D4C41]">
                  Transfer Amount (USD)
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
                  disabled
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-sm font-black opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                Payment Reference / Memo
              </label>
              <textarea
                rows={2}
                disabled
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional transfer description..."
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-xs opacity-70 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-sm shadow-xl shadow-[#4E342E]/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <Lock className="w-4 h-4 text-[#D4A373]" />
              <span>Dispatch Transfer (Locked — Hold & Visit Branch)</span>
            </button>
          </form>
        </div>
      </div>

      {/* HOLD & VISIT BRANCH MODAL */}
      {showHoldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-center border border-[#EADFD5] animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8 text-amber-700" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#2E1A11]">
                Please Hold & Visit Branch
              </h2>
              <p className="text-xs text-[#6D4C41] leading-relaxed">
                For security reasons and anti-money laundering compliance, your account outgoing wire privileges are in security hold status.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#2E1A11]">
                <MapPin className="w-4 h-4 text-[#4E342E]" />
                <span>Required Documentation for Branch Clearance:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[#6D4C41]">
                <li>Valid Government-Issued Passport or State Driver's License</li>
                <li>Proof of physical residence (utility statement within 90 days)</li>
                <li>Account Number: <strong className="font-mono text-[#2E1A11]">19571987976</strong></li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard/tickets"
                className="flex-1 py-3 px-4 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white text-xs font-bold transition-all text-center"
              >
                Contact Concierge
              </Link>
              <button
                type="button"
                onClick={() => setShowHoldModal(false)}
                className="py-3 px-6 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition-all"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

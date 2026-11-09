"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { CheckCircle2, DollarSign } from "lucide-react";

export default function LoansPage() {
  const { loans, applyLoan } = useBank();
  const [loanType, setLoanType] = useState("Personal Expansion Credit (8.5%)");
  const [amount, setAmount] = useState<number | "">("");
  const [months, setMonths] = useState(12);
  const [submitted, setSubmitted] = useState(false);

  const loanOptions = [
    { name: "Personal Expansion Credit", rate: 8.5, max: 25000 },
    { name: "Small Business Capital", rate: 7.2, max: 100000 },
    { name: "Equipment & Auto Loan", rate: 6.8, max: 50000 },
    { name: "Emergency Bridge Facility", rate: 9.5, max: 10000 },
  ];

  const currentOption = loanOptions.find((l) => l.name === loanType) || loanOptions[0];
  const reqAmount = Number(amount) || 0;
  const estimatedMonthly = reqAmount > 0 ? Math.round((reqAmount * (1 + (currentOption.rate / 100) * (months / 12))) / months) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reqAmount <= 0) return;
    applyLoan(currentOption.name, reqAmount, months);
    setSubmitted(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
            Loan Facilities & Credit
          </h1>
          <p className="text-sm text-[#6D4C41] mt-1">
            Access immediate low-interest personal and commercial credit lines with automated disbursement.
          </p>
        </div>

        {submitted ? (
          <div className="p-10 rounded-3xl bg-white border border-[#EADFD5] text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#EFEBE9] text-[#4E342E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#2E1A11]">Loan Application Submitted!</h3>
            <p className="text-[#6D4C41] text-sm max-w-md mx-auto">
              Your application for <strong className="text-[#2E1A11]">${reqAmount.toLocaleString()} USD</strong> under {currentOption.name} has been routed to underwriter evaluation.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setAmount("");
              }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#4E342E] text-white text-xs font-bold hover:bg-[#3E2723] transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Application form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] space-y-5 shadow-xs">
              <h3 className="text-base font-bold text-[#2E1A11]">Apply for Credit Line</h3>

              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                  Select Loan Category
                </label>
                <div className="space-y-2">
                  {loanOptions.map((opt) => (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setLoanType(opt.name)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        loanType === opt.name
                          ? "bg-[#F5EFE6] border-[#4E342E] text-[#2E1A11]"
                          : "bg-[#FAF7F2] border-[#EADFD5] text-[#6D4C41] hover:bg-[#EFEBE9]"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#2E1A11]">{opt.name}</p>
                        <p className="text-[11px] text-[#8D6E63] mt-0.5">Up to ${opt.max.toLocaleString()} USD</p>
                      </div>
                      <span className="text-xs font-bold text-[#4E342E]">{opt.rate}% APY</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                  Requested Amount (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8D6E63]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    required
                    max={currentOption.max}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                    placeholder="5000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm font-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                  Repayment Tenure
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[6, 12, 24, 36].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMonths(m)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        months === m
                          ? "bg-[#4E342E] text-white border-[#4E342E] shadow-2xs"
                          : "bg-[#FAF7F2] text-[#6D4C41] border-[#EADFD5] hover:bg-[#EFEBE9]"
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#EADFD5] flex justify-between items-center text-xs">
                <span className="text-[#6D4C41] font-semibold">Estimated Monthly Installment:</span>
                <span className="text-lg font-black text-[#4E342E] font-mono">
                  ${estimatedMonthly.toLocaleString()} USD/mo
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-sm shadow-md shadow-[#4E342E]/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                Submit Loan Application
              </button>
            </form>

            {/* Existing applications */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-base font-bold text-[#2E1A11]">Your Loan Applications</h3>
              {loans.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white border border-[#EADFD5] text-center text-xs text-[#8D6E63]">
                  No active loan obligations or pending applications.
                </div>
              ) : (
                loans.map((l) => (
                  <div
                    key={l.id}
                    className="p-5 rounded-2xl bg-white border border-[#EADFD5] shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2E1A11]">{l.loanName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                        {l.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-[#6D4C41] pt-1">
                      <span>Total Principal:</span>
                      <span className="font-bold text-[#2E1A11]">${Number(l.amount ?? 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#6D4C41]">
                      <span>Monthly EMI:</span>
                      <span className="font-mono font-bold text-[#4E342E]">${l.installment} USD</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

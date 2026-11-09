"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { PiggyBank, CheckCircle2, AlertCircle } from "lucide-react";

export default function DpsPage() {
  const { balance, dpsSchemes, createDps } = useBank();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const availablePlans = [
    { name: "Starter Pension Plan", monthly: 50, months: 12, rate: 7.5, returnEstimate: 625 },
    { name: "Growth Pension Plan", monthly: 100, months: 24, rate: 9.0, returnEstimate: 2616 },
    { name: "Wealth Retirement Plan", monthly: 250, months: 36, rate: 11.5, returnEstimate: 10037 },
    { name: "Executive Heritage Plan", monthly: 500, months: 60, rate: 13.0, returnEstimate: 33900 },
  ];

  const handleEnroll = (plan: typeof availablePlans[0]) => {
    setError("");
    setSuccess(false);

    if (balance < plan.monthly) {
      setError(`Insufficient balance for the first installment of $${plan.monthly}.00. Your balance is $${balance.toFixed(2)}.`);
      return;
    }

    const ok = createDps(plan.name, plan.monthly, plan.months, plan.rate);
    if (ok) {
      setSuccess(true);
    } else {
      setError("Could not process enrollment. Please check your available balance.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
            Deposit Pension Scheme (DPS)
          </h1>
          <p className="text-sm text-[#6D4C41] mt-1">
            Build systematic monthly wealth with compounding returns and guaranteed maturity payouts.
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
            <span>Successfully enrolled in new DPS plan! The first monthly installment was debited.</span>
          </div>
        )}

        {/* Active DPS Schemes */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-5">
          <h3 className="text-base font-bold text-[#2E1A11]">Your Active DPS Schemes</h3>

          {dpsSchemes.length === 0 ? (
            <p className="text-xs text-[#8D6E63] py-4 text-center">Currently No Active DPS Enrolled.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dpsSchemes.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2E1A11]">{s.planName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      {s.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#8D6E63]">Monthly Deposit:</span>
                      <p className="font-bold text-[#2E1A11]">${s.installment} USD</p>
                    </div>
                    <div>
                      <span className="text-[#8D6E63]">Interest Rate:</span>
                      <p className="font-bold text-[#4E342E]">{s.interestRate}%</p>
                    </div>
                    <div>
                      <span className="text-[#8D6E63]">Installments Paid:</span>
                      <p className="font-bold text-[#2E1A11]">{s.givenInstallments} of {s.totalInstallments}</p>
                    </div>
                    <div>
                      <span className="text-[#8D6E63]">Mature Value:</span>
                      <p className="font-bold text-[#5D4037]">${s.matureAmount.toLocaleString()} USD</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Plans */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#2E1A11]">Enroll in a New DPS Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {availablePlans.map((plan, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-[#EADFD5] hover:border-[#8D6E63] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EFEBE9] text-[#4E342E] text-[10px] font-bold">
                    {plan.rate}% Annual Rate
                  </span>
                  <h4 className="text-base font-bold text-[#2E1A11] mt-3 mb-2">{plan.name}</h4>
                  <p className="text-2xl font-black text-[#2E1A11]">
                    ${plan.monthly}
                    <span className="text-xs font-normal text-[#8D6E63]">/month</span>
                  </p>

                  <div className="space-y-2 py-4 text-xs text-[#6D4C41] border-t border-[#EADFD5] mt-4">
                    <div className="flex justify-between">
                      <span className="text-[#8D6E63]">Duration:</span>
                      <span className="font-semibold text-[#2E1A11]">{plan.months} Months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8D6E63]">Total Investment:</span>
                      <span className="font-semibold text-[#2E1A11]">${plan.monthly * plan.months}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#4E342E]">
                      <span>Maturity Payout:</span>
                      <span>~${plan.returnEstimate.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleEnroll(plan)}
                  className="w-full py-2.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-xs shadow-md shadow-[#4E342E]/25 hover:scale-105 transition-all mt-4"
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

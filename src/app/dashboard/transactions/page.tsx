"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { Search, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function TransactionsPage() {
  const { transactions } = useBank();
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filtered = transactions.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.trx.toLowerCase().includes(query.toLowerCase()) ||
      t.method.toLowerCase().includes(query.toLowerCase());
    const matchesType = selectedType === "all" || t.type === selectedType;
    return matchesQuery && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
            Transactions Ledger
          </h1>
          <p className="text-sm text-[#6D4C41] mt-1">
            Complete audit trail of deposits, wire debits, pension schemes, and card settlements.
          </p>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, title, or method..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-xs shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["all", "deposit", "transfer", "withdraw", "dps", "fdr", "bonus"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  selectedType === type
                    ? "bg-[#4E342E] text-white shadow-2xs"
                    : "bg-white text-[#6D4C41] border border-[#EADFD5] hover:text-[#2E1A11] hover:bg-[#FAF7F2]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EADFD5] text-[#8D6E63]">
                  <th className="pb-3 font-bold">Description</th>
                  <th className="pb-3 font-bold">Transaction ID</th>
                  <th className="pb-3 font-bold">Type</th>
                  <th className="pb-3 font-bold">Method</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Fee</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFD5]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#8D6E63]">
                      No matching records located in ledger.
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-[#2E1A11]">{tx.title}</p>
                        {tx.details && (
                          <p className="text-[11px] text-[#8D6E63] mt-0.5">{tx.details}</p>
                        )}
                      </td>
                      <td className="py-4 pr-4 font-mono text-[#5D4037] font-bold">{tx.trx}</td>
                      <td className="py-4 pr-4 uppercase text-[#8D6E63] font-bold">{tx.type}</td>
                      <td className="py-4 pr-4 text-[#6D4C41] font-medium">{tx.method}</td>
                      <td className="py-4 pr-4 font-black text-[#2E1A11]">
                        {tx.type === "deposit" || tx.type === "bonus" ? "+" : "-"}
                        ${tx.amount.toFixed(2)} USD
                      </td>
                      <td className="py-4 pr-4 text-[#8D6E63]">
                        -${tx.charge.toFixed(2)} USD
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            tx.status === "success"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : tx.status === "pending"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {tx.status === "success" && <CheckCircle2 className="w-3 h-3" />}
                          {tx.status === "pending" && <Clock className="w-3 h-3" />}
                          {tx.status === "failed" && <XCircle className="w-3 h-3" />}
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 text-[#8D6E63] whitespace-nowrap">{tx.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

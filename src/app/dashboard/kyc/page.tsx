"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { ShieldCheck, Upload, CheckCircle2 } from "lucide-react";

export default function KycPage() {
  const { user, updateKycStatus } = useBank();
  const [docType, setDocType] = useState("National Identity Card");

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    updateKycStatus("approved");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
            KYC Identity Verification
          </h1>
          <p className="text-sm text-[#6D4C41] mt-1">
            Maintain regulatory compliance and unlock unlimited transaction volumes and virtual debit cards.
          </p>
        </div>

        {/* Current status pill */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              user.kycStatus === "approved"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#2E1A11]">Verification Status</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  user.kycStatus === "approved"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {user.kycStatus}
                </span>
              </div>
              <p className="text-xs text-[#8D6E63] mt-0.5">
                {user.kycStatus === "approved"
                  ? "Your account holds Tier-3 verified privileges with unrestricted wire limits."
                  : "Please upload documents below to verify your legal identity."}
              </p>
            </div>
          </div>
          {user.kycStatus === "approved" && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified On Record</span>
            </div>
          )}
        </div>

        {/* Upload Form */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] space-y-6 shadow-xs">
          <h3 className="text-base font-bold text-[#2E1A11]">Submit Verification Credentials</h3>

          <form onSubmit={handleSimulateUpload} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                Document Classification
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-sm font-semibold"
              >
                <option value="National Identity Card">National Identity Card</option>
                <option value="International Passport">International Passport</option>
                <option value="Driver's License">Driver&apos;s License</option>
              </select>
            </div>

            {/* Drag & Drop Simulation */}
            <div className="border-2 border-dashed border-[#D7CCC8] hover:border-[#4E342E] rounded-3xl p-8 sm:p-12 text-center space-y-3 cursor-pointer transition-colors bg-[#FAF7F2]">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#4E342E] flex items-center justify-center mx-auto shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#2E1A11]">
                  Drag and drop proof of identity file here, or browse
                </p>
                <p className="text-xs text-[#8D6E63] mt-1">
                  Supports PNG, JPG, or PDF up to 10MB
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-sm shadow-md shadow-[#4E342E]/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              Confirm Document Verification
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

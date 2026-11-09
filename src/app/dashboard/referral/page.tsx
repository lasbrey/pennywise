"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { Users, Copy, Check, Award, DollarSign, Gift } from "lucide-react";

export default function ReferralPage() {
  const { user } = useBank();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const refCode = user.referralCode || (user.accountNumber ? `PWT${user.accountNumber.slice(-6)}` : "PWT7821");
  const referralLink = `${origin || "https://pennywisetrust.com"}/register?ref=${refCode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
            Referral & Affiliate Rewards
          </h1>
          <p className="text-sm text-[#6D4C41] mt-1">
            Invite your colleagues and friends to PennyWiseTrust Bank and earn cash bounties on every active account.
          </p>
        </div>

        {/* Promo Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1A11] border border-[#5D4037] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-white/15 text-[#FAF7F2] text-xs font-bold uppercase tracking-wider">
              Earn $10 Instantly
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Get $10 for every invited user who creates an account
            </h2>
            <p className="text-xs text-[#D7CCC8] max-w-lg">
              Your invitee receives the $8 welcome credit, and you earn a $10 direct cash bonus credited to your wallet balance.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
            <p className="text-xs text-[#D7CCC8] uppercase font-bold">Your Referral Code</p>
            <p className="text-2xl font-mono font-black text-white mt-0.5 tracking-wider">{refCode}</p>
          </div>
        </div>

        {/* Copy Referral Link */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-3">
          <label className="block text-xs font-bold text-[#6D4C41]">
            Your Dedicated Referral Link
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] font-mono text-xs select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-6 py-3 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#4E342E]/25 hover:scale-105 shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied Link!" : "Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center mx-auto">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs text-[#8D6E63] font-semibold">Total Referrals</p>
            <p className="text-3xl font-black text-[#2E1A11]">{user.referralCount}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center mx-auto">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-xs text-[#8D6E63] font-semibold">Total Referral Earnings</p>
            <p className="text-3xl font-black text-[#4E342E]">${user.referralBonus}.00 USD</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-xs text-[#8D6E63] font-semibold">Affiliate Tier</p>
            <p className="text-3xl font-black text-[#5D4037]">Level 2</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { User, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { user, updateProfile } = useBank();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [twoFa, setTwoFa] = useState(user.twoFactorEnabled);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      address,
      twoFactorEnabled: twoFa,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
            Account & Security Settings
          </h1>
          <p className="text-sm text-[#6D4C41] mt-1">
            Update personal contact details, configure two-factor authentication, and manage credentials.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile and security preferences updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Profile Details */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#2E1A11]">Profile Information</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                    Username (System Locked)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.username}
                    className="w-full px-4 py-3 rounded-xl bg-[#F5EFE6] border border-[#EADFD5] text-[#8D6E63] text-sm cursor-not-allowed font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                    Email Address (Registered)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-4 py-3 rounded-xl bg-[#F5EFE6] border border-[#EADFD5] text-[#8D6E63] text-sm cursor-not-allowed font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-sm font-semibold"
                />
              </div>

              {/* 2FA Toggle */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#2E1A11]">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-[#8D6E63] mt-0.5">
                    Require OTP token approval for transfers above $1,000 USD.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFa(!twoFa)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    twoFa ? "bg-[#4E342E]" : "bg-[#D7CCC8]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFa ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-sm shadow-md shadow-[#4E342E]/25 transition-all hover:-translate-y-0.5"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

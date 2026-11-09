"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight, Gift, ShieldCheck, AlertCircle } from "lucide-react";
import { useBank } from "@/context/BankContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import Logo from "@/components/public/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const { updateProfile } = useBank();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    referralCode: "PWT7821",
  });
  const [loading, setLoading] = useState(false);
  const [regError, setRegError] = useState("");

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          router.replace("/dashboard");
        }
      });
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              username: formData.username,
              phone: formData.phone,
              referral_code: formData.referralCode,
            },
          },
        });

        if (error) {
          setRegError(error.message);
          setLoading(false);
          return;
        }

        if (data?.user) {
          updateProfile({
            id: data.user.id,
            name: formData.name || "Client",
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
          });

          // If session was immediately established, send to dashboard
          if (data.session) {
            router.push("/dashboard");
          } else {
            // If email verification is required by Supabase project settings
            router.push("/login?notice=verify");
          }
          return;
        }
      } catch (err: any) {
        setRegError(err.message || "Registration failed.");
        setLoading(false);
        return;
      }
    } else {
      setRegError("Database connection is not configured.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-[#2C1D16]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center animate-slide-up flex flex-col items-center">
        <div className="mb-6">
          <Logo href="/" size="lg" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#241611]">
          Open Your Digital Account
        </h2>
        <p className="mt-2 text-sm text-[#6D4C41]">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#4E342E] hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white border border-[#EADFD5] py-8 px-6 shadow-xl shadow-[#4E342E]/5 rounded-3xl sm:px-10">
          {/* Welcome Bonus Notice */}
          <div className="mb-6 p-4 rounded-2xl bg-[#F5EFE6] border border-[#D7CCC8] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white text-[#4E342E] flex items-center justify-center shrink-0 shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#4E342E] uppercase tracking-wide">
                Welcome Promotion Active
              </p>
              <p className="text-xs text-[#6D4C41]">
                You will receive an automatic <strong className="text-[#241611] font-bold">$8.00 USD cash bonus</strong> credited directly to your checking wallet upon registration!
              </p>
            </div>
          </div>

          {regError && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{regError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8D6E63]">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm"
                    placeholder="Alex Morgan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-1.5">
                  Desired Username
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="block w-full px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm"
                  placeholder="alexmorgan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6D4C41] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8D6E63]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8D6E63]">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm"
                    placeholder="+1 555 349-8812"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6D4C41] mb-1.5">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                  className="block w-full px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm uppercase font-mono"
                  placeholder="HITOH579"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6D4C41] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8D6E63]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm"
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-[#4E342E]/25 text-sm font-bold text-white bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1A11] hover:opacity-95 transition-all disabled:opacity-50 hover:-translate-y-0.5"
              >
                <span>{loading ? "Creating Account..." : "Create Account & Claim $8"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-5 text-center text-xs text-[#8D6E63] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#5D4037]" />
            <span>Protected by PennyWiseTrust KYC & Supabase Auth protocols</span>
          </div>
        </div>
      </div>
    </div>
  );
}

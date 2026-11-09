"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { useBank } from "@/context/BankContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import Logo from "@/components/public/Logo";

export default function LoginPage() {
  const router = useRouter();
  const { user, updateProfile } = useBank();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!identifier.trim() || !password) {
      setAuthError("Please enter your registered email and password.");
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier.trim(),
          password: password,
        });

        if (error) {
          setAuthError(error.message || "Invalid login credentials.");
          setLoading(false);
          return;
        }

        if (data?.user) {
          router.push("/dashboard");
          return;
        }
      } catch (err: any) {
        setAuthError(err.message || "Authentication error occurred.");
        setLoading(false);
        return;
      }
    } else {
      setAuthError("Supabase connection is not configured.");
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
          Sign In to Your Account
        </h2>
        <p className="mt-2 text-sm text-[#6D4C41]">
          Or{" "}
          <Link href="/register" className="font-bold text-[#4E342E] hover:underline">
            register today & get $8 welcome bonus
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-[#EADFD5] py-8 px-6 shadow-xl shadow-[#4E342E]/5 rounded-3xl sm:px-10">

          {authError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8D6E63]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#6D4C41]">
                  Password
                </label>
                <Link
                  href="/contact"
                  className="text-xs font-bold text-[#4E342E] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8D6E63]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-[#D7CCC8] text-[#4E342E] focus:ring-[#4E342E]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-[#6D4C41]">
                Remember this device for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-[#4E342E]/25 text-sm font-bold text-white bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1A11] hover:opacity-95 focus:outline-none transition-all disabled:opacity-50 hover:-translate-y-0.5"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#EADFD5] text-center flex items-center justify-center gap-2 text-xs text-[#8D6E63]">
            <ShieldCheck className="w-4 h-4 text-[#5D4037]" />
            <span>Secured with Supabase Auth & JWT encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

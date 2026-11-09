"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useBank } from "@/context/BankContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import Logo from "@/components/public/Logo";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useBank();
  const [loginMode, setLoginMode] = useState<"otp" | "password">("otp");
  const [otpStep, setOtpStep] = useState<"email" | "verify">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(0);

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

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError("");
    setSuccessMsg("");

    const emailTrimmed = identifier.trim();
    if (!emailTrimmed) {
      setAuthError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    if (!isSupabaseConfigured) {
      setAuthError("Supabase connection is not configured.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailTrimmed,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        if (
          error.message.toLowerCase().includes("user not found") ||
          error.message.toLowerCase().includes("signups not allowed")
        ) {
          setAuthError("No account found with this email. Please check the spelling or register first.");
        } else {
          setAuthError(error.message || "Failed to send verification code.");
        }
        setLoading(false);
        return;
      }

      setOtpStep("verify");
      setSuccessMsg(`We sent a 6-digit login code to ${emailTrimmed}. Please check your inbox and spam folder.`);
      setCountdown(60);
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const codeTrimmed = otpCode.trim();
    if (!codeTrimmed) {
      setAuthError("Please enter the 6-digit verification code.");
      return;
    }

    if (codeTrimmed.length < 6) {
      setAuthError("Verification code must be 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: identifier.trim(),
        token: codeTrimmed,
        type: "email",
      });

      if (error) {
        setAuthError(error.message || "Invalid or expired verification code. Please request a new one.");
        setLoading(false);
        return;
      }

      if (data?.session) {
        router.push("/dashboard");
        return;
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  // Fallback: Password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!identifier.trim() || !password) {
      setAuthError("Please enter your registered email and password.");
      return;
    }

    setLoading(true);

    if (!isSupabaseConfigured) {
      setAuthError("Supabase connection is not configured.");
      setLoading(false);
      return;
    }

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
    } finally {
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

          {/* Login Mode Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMode("otp");
                setAuthError("");
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                loginMode === "otp"
                  ? "bg-[#4E342E] text-white shadow-sm"
                  : "text-[#8D6E63] hover:text-[#2E1A11]"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Email Code</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode("password");
                setAuthError("");
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                loginMode === "password"
                  ? "bg-[#4E342E] text-white shadow-sm"
                  : "text-[#8D6E63] hover:text-[#2E1A11]"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {successMsg && otpStep === "verify" && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: EMAIL OTP */}
          {loginMode === "otp" && (
            <>
              {otpStep === "email" ? (
                <form className="space-y-5" onSubmit={handleSendOtp}>
                  <div>
                    <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                      Registered Email Address
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
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-[#8D6E63] mt-2">
                      We will email you a secure 6-digit one-time code to sign in instantly.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-[#4E342E]/25 text-sm font-bold text-white bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1A11] hover:opacity-95 focus:outline-none transition-all disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>{loading ? "Sending Code..." : "Send Verification Code"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form className="space-y-5" onSubmit={handleVerifyOtp}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-[#6D4C41]">
                        6-Digit Security Code
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep("email");
                          setOtpCode("");
                          setAuthError("");
                          setSuccessMsg("");
                        }}
                        className="text-xs font-bold text-[#4E342E] hover:underline inline-flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Change Email</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="block w-full py-3.5 px-4 rounded-xl bg-[#FAF7F2] border-2 border-[#4E342E]/30 focus:border-[#4E342E] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none text-center font-mono text-2xl font-black tracking-[0.4em]"
                      placeholder="••••••"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-[#4E342E]/25 text-sm font-bold text-white bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1A11] hover:opacity-95 focus:outline-none transition-all disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>{loading ? "Verifying..." : "Verify & Sign In"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      disabled={loading || countdown > 0}
                      onClick={() => handleSendOtp()}
                      className="text-xs font-bold text-[#4E342E] hover:underline disabled:opacity-40 disabled:no-underline inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                      <span>
                        {countdown > 0 ? `Resend code in ${countdown}s` : "Didn't get a code? Resend"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* MODE 2: PASSWORD */}
          {loginMode === "password" && (
            <form className="space-y-5" onSubmit={handlePasswordLogin}>
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
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-[#4E342E]/25 text-sm font-bold text-white bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1A11] hover:opacity-95 focus:outline-none transition-all disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{loading ? "Authenticating..." : "Sign In with Password"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#EADFD5] text-center flex items-center justify-center gap-2 text-xs text-[#8D6E63]">
            <ShieldCheck className="w-4 h-4 text-[#5D4037]" />
            <span>Secured with Supabase Auth OTP & 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

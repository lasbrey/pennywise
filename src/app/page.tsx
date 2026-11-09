"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Zap,
  Globe,
  PiggyBank,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Calculator,
  Lock,
} from "lucide-react";

export default function HomePage() {
  // FDR Calculator state
  const [fdrAmount, setFdrAmount] = useState(5000);
  const [fdrMonths, setFdrMonths] = useState(12);
  const fdrRate = fdrMonths >= 36 ? 12.5 : fdrMonths >= 12 ? 10.5 : 8.0;
  const fdrProfit = Math.round(fdrAmount * (fdrRate / 100) * (fdrMonths / 12));
  const fdrTotal = fdrAmount + fdrProfit;

  // Loan Calculator state
  const [loanAmount, setLoanAmount] = useState(15000);
  const [loanMonths, setLoanMonths] = useState(24);
  const loanRate = 8.5;
  const monthlyLoanPayment = Math.round(
    (loanAmount * (1 + (loanRate / 100) * (loanMonths / 12))) / loanMonths
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C1D16]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-white via-[#FAF6F0] to-[#FDFBF7]">
        {/* Warm Ambient Glows with subtle pulse */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[#E8DDD4]/50 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
        <div className="absolute top-1/3 left-1/6 w-[350px] h-[350px] bg-[#D7CCC8]/30 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFEBE9] border border-[#D7CCC8] text-[#5D4037] text-xs font-bold tracking-wide uppercase shadow-xs">
                <Zap className="w-3.5 h-3.5 text-[#8D6E63]" />
                <span>Premier Digital Banking Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#241611] leading-[1.12]">
                Fast, Secure & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E342E] via-[#795548] to-[#A1887F]">
                  Hassle-Free Banking
                </span>
              </h1>

              <p className="text-lg text-[#6D4C41] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Effortlessly manage your private wealth, issue high-limit virtual cards, unlock up to 12.5% return through FDR & DPS savings, and execute instant global payments with zero friction.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1A11] hover:opacity-95 shadow-lg shadow-[#4E342E]/25 hover:shadow-xl hover:shadow-[#4E342E]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all text-base group"
                >
                  <span>Open Account & Claim $8</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-[#3E2723] bg-white border border-[#D7CCC8] hover:bg-[#F5EFE6] shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-base"
                >
                  <span>Launch Banking Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#EADFD5] max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#2E1A11]">$450M+</p>
                  <p className="text-xs text-[#8D6E63] font-semibold mt-1">Transfers Processed</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#5D4037]">99.99%</p>
                  <p className="text-xs text-[#8D6E63] font-semibold mt-1">Network Uptime</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#795548]">180+</p>
                  <p className="text-xs text-[#8D6E63] font-semibold mt-1">Countries Supported</p>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Interactive Virtual Card preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DFD8] shadow-2xl shadow-[#4E342E]/10 animate-float">
                {/* 3D Luxury Espresso Brown Card */}
                <div className="relative w-full aspect-[1.6/1] rounded-2xl bg-gradient-to-tr from-[#241611] via-[#3E2723] to-[#5D4037] p-6 text-white shadow-2xl border border-[#795548]/40 flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A373]/20 blur-2xl rounded-full pointer-events-none" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#D7CCC8] font-bold">PennyWiseTrust Luxury</p>
                      <p className="text-base font-extrabold tracking-wider text-white">Platinum Debit</p>
                    </div>
                    <div className="px-3 py-1 rounded bg-white/10 border border-white/20 text-xs font-mono font-bold tracking-widest">
                      VISA
                    </div>
                  </div>

                  <div className="my-auto font-mono text-xl sm:text-2xl tracking-widest text-slate-100 drop-shadow">
                    4532 8920 1934 8841
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[#BCAAA4] text-[9px] uppercase font-semibold">Cardholder</p>
                      <p className="font-bold text-white uppercase">PENNYWISE CLIENT</p>
                    </div>
                    <div>
                      <p className="text-[#BCAAA4] text-[9px] uppercase font-semibold">Expires</p>
                      <p className="font-bold text-white">09/29</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVE
                    </div>
                  </div>
                </div>

                {/* Mini Stats Below Card */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#BCAAA4] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#EFEBE9] flex items-center justify-center text-[#4E342E]">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-[#8D6E63] font-medium">Total Yield Growth</p>
                        <p className="text-sm font-bold text-[#2E1A11]">+12.5% Annual FDR</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#4E342E] font-bold px-2 py-0.5 rounded bg-white border border-[#D7CCC8]">
                      Guaranteed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#BCAAA4] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#EFEBE9] flex items-center justify-center text-[#4E342E]">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-[#8D6E63] font-medium">Protection Layer</p>
                        <p className="text-sm font-bold text-[#2E1A11]">Tier-4 Encrypted Vault</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#5D4037] font-bold px-2 py-0.5 rounded bg-white border border-[#D7CCC8]">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Feature Highlights */}
      <section className="py-24 bg-white border-y border-[#EADFD5] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[#795548] text-xs font-bold uppercase tracking-widest bg-[#F5EFE6] px-3 py-1 rounded-full border border-[#D7CCC8]">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2E1A11]">
              Engineered for Total Financial Freedom
            </h2>
            <p className="text-[#6D4C41] text-base">
              Explore professional financial tools engineered to simplify wealth building, money transfers, and capital expansion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Deposits */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#8D6E63] hover:shadow-xl hover:shadow-[#4E342E]/8 hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#4E342E] shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#4E342E] group-hover:text-white transition-all duration-300">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#2E1A11] mb-2">Secure Deposits</h3>
              <p className="text-[#6D4C41] text-sm leading-relaxed mb-6">
                Deposit funds through multiple channels including wire transfers, cash counter deposits, and cryptocurrency gateways with instant ledger crediting.
              </p>
              <Link
                href="/dashboard/deposit"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E342E] group-hover:text-[#2E1A11] transition-colors"
              >
                Deposit Funds <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 2: DPS */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#8D6E63] hover:shadow-xl hover:shadow-[#4E342E]/8 hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#4E342E] shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#4E342E] group-hover:text-white transition-all duration-300">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#2E1A11] mb-2">Deposit Pension Scheme (DPS)</h3>
              <p className="text-[#6D4C41] text-sm leading-relaxed mb-6">
                Build compounding wealth with competitive monthly installments. Save systematically and unlock guaranteed maturity returns for your retirement.
              </p>
              <Link
                href="/dashboard/dps"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E342E] group-hover:text-[#2E1A11] transition-colors"
              >
                Explore DPS Plans <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 3: FDR */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#8D6E63] hover:shadow-xl hover:shadow-[#4E342E]/8 hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#4E342E] shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#4E342E] group-hover:text-white transition-all duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#2E1A11] mb-2">Fixed Deposit Receipts (FDR)</h3>
              <p className="text-[#6D4C41] text-sm leading-relaxed mb-6">
                Maximize capital with fixed term deposits offering premium yields up to 12.5% for terms from 3 months to 5 years with principal guarantee.
              </p>
              <Link
                href="/dashboard/fdr"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E342E] group-hover:text-[#2E1A11] transition-colors"
              >
                Calculate FDR Returns <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 4: Fund Transfers */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#8D6E63] hover:shadow-xl hover:shadow-[#4E342E]/8 hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#4E342E] shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#4E342E] group-hover:text-white transition-all duration-300">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#2E1A11] mb-2">Fast Wire Transfers</h3>
              <p className="text-[#6D4C41] text-sm leading-relaxed mb-6">
                Send and receive money seamlessly across accounts, external bank accounts, and international jurisdictions with minimal flat processing fees.
              </p>
              <Link
                href="/dashboard/transfer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E342E] group-hover:text-[#2E1A11] transition-colors"
              >
                Send Wire Transfer <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 5: Virtual Cards */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#8D6E63] hover:shadow-xl hover:shadow-[#4E342E]/8 hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#4E342E] shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#4E342E] group-hover:text-white transition-all duration-300">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#2E1A11] mb-2">Virtual Visa & Mastercard</h3>
              <p className="text-[#6D4C41] text-sm leading-relaxed mb-6">
                Generate instant digital debit cards for secure online shopping, subscription billing, and expense separation with 1-click freezing.
              </p>
              <Link
                href="/dashboard/cards"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E342E] group-hover:text-[#2E1A11] transition-colors"
              >
                Issue Virtual Card <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 6: Flexible Loans */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#8D6E63] hover:shadow-xl hover:shadow-[#4E342E]/8 hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#4E342E] shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#4E342E] group-hover:text-white transition-all duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#2E1A11] mb-2">Flexible Capital Loans</h3>
              <p className="text-[#6D4C41] text-sm leading-relaxed mb-6">
                Access low-interest personal and commercial loans with clear repayment terms, fast approvals, and direct deposit into your checking balance.
              </p>
              <Link
                href="/dashboard/loans"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E342E] group-hover:text-[#2E1A11] transition-colors"
              >
                Apply for Loan <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Financial Calculator */}
      <section className="py-24 bg-[#FAF7F2] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[#795548] text-xs font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#D7CCC8]">
              Live Planning Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2E1A11]">
              Calculate Your Future Returns
            </h2>
            <p className="text-[#6D4C41] text-sm sm:text-base">
              Use our interactive calculators to project your fixed deposit earnings or plan your low-rate installment loan repayments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FDR Return Calculator */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] shadow-lg shadow-[#4E342E]/5 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EFEBE9] text-[#4E342E] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2E1A11]">Fixed Deposit (FDR) Calculator</h3>
                    <p className="text-xs text-[#8D6E63]">Guaranteed term returns</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#EFEBE9] border border-[#D7CCC8] text-[#4E342E] text-xs font-bold">
                  {fdrRate}% APY
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-[#6D4C41]">Deposit Amount</span>
                    <span className="font-bold text-[#2E1A11]">${fdrAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={fdrAmount}
                    onChange={(e) => setFdrAmount(Number(e.target.value))}
                    className="w-full accent-[#4E342E] cursor-pointer h-2 bg-[#EADFD5] rounded-lg"
                  />
                  <div className="flex justify-between text-xs text-[#A1887F] mt-1">
                    <span>$500</span>
                    <span>$50,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-[#6D4C41]">Term Duration</span>
                    <span className="font-bold text-[#2E1A11]">{fdrMonths} Months</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 6, 12, 36].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFdrMonths(m)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          fdrMonths === m
                            ? "bg-[#4E342E] text-white border-[#4E342E] shadow-sm"
                            : "bg-[#FAF7F2] text-[#6D4C41] border-[#EADFD5] hover:bg-[#EFEBE9]"
                        }`}
                      >
                        {m} Mos
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#EADFD5] grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#795548] font-semibold">Total Profit Return</p>
                    <p className="text-2xl font-black text-[#2E1A11] mt-0.5">
                      +${fdrProfit.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#795548] font-semibold">Final Maturity Payout</p>
                    <p className="text-2xl font-black text-[#4E342E] mt-0.5">
                      ${fdrTotal.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard/fdr"
                  className="block text-center w-full py-3.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-sm transition-all shadow-md shadow-[#4E342E]/25 hover:-translate-y-0.5"
                >
                  Lock in this FDR Return
                </Link>
              </div>
            </div>

            {/* Loan EMI Calculator */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] shadow-lg shadow-[#4E342E]/5 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EFEBE9] text-[#4E342E] flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2E1A11]">Loan Repayment Calculator</h3>
                    <p className="text-xs text-[#8D6E63]">Competitive {loanRate}% base rate</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#EFEBE9] border border-[#D7CCC8] text-[#4E342E] text-xs font-bold">
                  Instant Quote
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-[#6D4C41]">Loan Principal</span>
                    <span className="font-bold text-[#2E1A11]">${loanAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#4E342E] cursor-pointer h-2 bg-[#EADFD5] rounded-lg"
                  />
                  <div className="flex justify-between text-xs text-[#A1887F] mt-1">
                    <span>$1,000</span>
                    <span>$100,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-[#6D4C41]">Repayment Period</span>
                    <span className="font-bold text-[#2E1A11]">{loanMonths} Months</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 12, 24, 48].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setLoanMonths(m)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          loanMonths === m
                            ? "bg-[#4E342E] text-white border-[#4E342E] shadow-sm"
                            : "bg-[#FAF7F2] text-[#6D4C41] border-[#EADFD5] hover:bg-[#EFEBE9]"
                        }`}
                      >
                        {m} Mos
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#EADFD5] grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#795548] font-semibold">Estimated Monthly EMI</p>
                    <p className="text-2xl font-black text-[#2E1A11] mt-0.5">
                      ${monthlyLoanPayment.toLocaleString()}/mo
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#795548] font-semibold">Estimated Total Cost</p>
                    <p className="text-2xl font-black text-[#4E342E] mt-0.5">
                      ${(monthlyLoanPayment * loanMonths).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard/loans"
                  className="block text-center w-full py-3.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-sm transition-all shadow-md shadow-[#4E342E]/25 hover:-translate-y-0.5"
                >
                  Apply For This Loan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gateway Partners Ticker */}
      <section className="py-16 bg-white border-t border-[#EADFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-widest text-[#8D6E63] font-bold mb-8">
            Integrated With Leading Global Payment Networks & Rails
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {["Binance", "Stripe", "PayPal", "CoinPayments", "Coinbase", "Razorpay", "Mollie", "Paystack"].map(
              (name) => (
                <div
                  key={name}
                  className="px-5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#8D6E63] font-bold text-[#4E342E] text-sm tracking-wide shadow-xs hover:scale-105 transition-all duration-200 cursor-default"
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-[#FAF7F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-r from-[#3E2723] via-[#4E342E] to-[#2E1A11] border border-[#5D4037] shadow-2xl text-white">
            <span className="text-xs font-bold text-[#D7CCC8] uppercase tracking-widest mb-3 inline-block">
              Get Started in Under 3 Minutes
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
              Ready to Upgrade Your Banking Experience?
            </h2>
            <p className="text-[#D7CCC8] text-base max-w-xl mx-auto mb-8">
              Open your digital account today and receive an immediate $8 welcome bonus deposited directly into your balance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-[#3E2723] bg-white hover:bg-[#F5EFE6] shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Account Now
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all duration-200"
              >
                View Live Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

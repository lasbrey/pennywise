import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { UserPlus, ShieldCheck, Wallet, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Create Your Account",
      desc: "Sign up in under 60 seconds with your email and basic details. Instant $8 welcome bonus is credited to your wallet balance immediately upon activation.",
      icon: UserPlus,
    },
    {
      num: "02",
      title: "Complete KYC Verification",
      desc: "Upload a government ID or passport to unlock maximum transaction limits, international wire access, and unlimited virtual card issuance.",
      icon: ShieldCheck,
    },
    {
      num: "03",
      title: "Deposit Liquidity",
      desc: "Fund your account via bank wire, credit card, cash counter deposits, or instant cryptocurrency gateways with 0% deposit charges.",
      icon: Wallet,
    },
    {
      num: "04",
      title: "Transact, Save & Grow",
      desc: "Lock funds into high-yield FDR term deposits, enroll into automated DPS retirement plans, issue virtual Visa cards, or wire money worldwide.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C1D16]">
      <Navbar />

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 animate-slide-up">
            <span className="text-[#795548] text-xs font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#D7CCC8]">
              Simple 4-Step Process
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#241611]">
              How PennyWiseTrust Bank Operates
            </h1>
            <p className="text-[#6D4C41] text-base">
              Start your next-generation digital banking journey effortlessly in just a few streamlined steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:border-[#8D6E63] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  <span className="text-4xl font-black text-[#EFEBE9] group-hover:text-[#D7CCC8] transition-colors">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center my-6 group-hover:bg-[#4E342E] group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#241611] mb-2">{step.title}</h3>
                  <p className="text-[#6D4C41] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-20 p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1A11] border border-[#5D4037] text-white text-center max-w-3xl mx-auto space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Experience Next-Gen Banking?
            </h2>
            <p className="text-[#D7CCC8] text-sm">
              Open your digital account today and get full access to your personalized dashboard instantly.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[#3E2723] bg-white hover:bg-[#F5EFE6] transition-all duration-200 shadow-lg hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

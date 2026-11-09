import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { CreditCard, PiggyBank, TrendingUp, Send, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function SolutionsPage() {
  const solutions = [
    {
      title: "Global Wire & Peer Transfers",
      desc: "Send money instantly between PennyWiseTrust accounts or execute cross-border wire transfers with complete fee transparency and optimal foreign exchange conversion rates.",
      icon: Send,
      link: "/dashboard/transfer",
    },
    {
      title: "Deposit Pension Scheme (DPS)",
      desc: "Systematic monthly savings plans with guaranteed maturity payouts. Select from flexible 12, 24, 36, or 60-month plans to secure long-term retirement capital.",
      icon: PiggyBank,
      link: "/dashboard/dps",
    },
    {
      title: "Fixed Deposit Receipts (FDR)",
      desc: "Lock in surplus liquidity at fixed high rates ranging from 8% up to 12.5% APY. Terms start at 3 months with automatic profit crediting directly to your account.",
      icon: TrendingUp,
      link: "/dashboard/fdr",
    },
    {
      title: "Instant Virtual Cards",
      desc: "Create and customize virtual Visa and Mastercard debit cards on demand. Set spend caps, freeze/unfreeze with one tap, and shop globally with complete privacy.",
      icon: CreditCard,
      link: "/dashboard/cards",
    },
    {
      title: "Personal & Commercial Credit",
      desc: "Streamlined financing with clear repayment amortization schedules. No hidden appraisal penalties and fast approvals for qualified accounts.",
      icon: Zap,
      link: "/dashboard/loans",
    },
    {
      title: "Utility & Bill Pay Services",
      desc: "Consolidate your bills into a single dashboard. Pay electricity, water, internet, and subscription invoices directly from your wallet balance with one click.",
      icon: ShieldCheck,
      link: "/dashboard/bills",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C1D16]">
      <Navbar />

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-slide-up">
            <span className="text-[#795548] text-xs font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#D7CCC8]">
              Financial Products
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#241611]">
              End-to-End Banking Solutions
            </h1>
            <p className="text-[#6D4C41] text-base">
              Explore our full suite of personal and business banking products engineered to grow your capital and simplify transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:border-[#8D6E63] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#4E342E] shadow-2xs flex items-center justify-center mb-6 group-hover:bg-[#4E342E] group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#241611] mb-3">{item.title}</h3>
                    <p className="text-[#6D4C41] text-sm leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#4E342E] group-hover:text-[#2E1A11] transition-colors"
                  >
                    <span>Launch Service</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

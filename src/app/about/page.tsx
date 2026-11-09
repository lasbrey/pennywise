import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Shield, Target, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C1D16]">
      <Navbar />

      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 animate-slide-up">
            <span className="text-[#795548] text-xs font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#D7CCC8]">
              About PennyWiseTrust Bank
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#241611]">
              Pioneering the Future of Digital Finance
            </h1>
            <p className="text-[#6D4C41] text-base leading-relaxed">
              We empower individuals, families, and high-growth enterprises worldwide with borderless, secure, and technologically advanced banking services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:shadow-xl hover:border-[#8D6E63] hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#241611]">Our Mission</h3>
              <p className="text-[#6D4C41] text-sm leading-relaxed">
                To eliminate traditional banking friction, excessive hidden charges, and geographic barriers by delivering frictionless financial infrastructure to everyone.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:shadow-xl hover:border-[#8D6E63] hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#241611]">Ironclad Security</h3>
              <p className="text-[#6D4C41] text-sm leading-relaxed">
                Operating with multi-layer cryptographic safeguards, cold storage custody, and automated AML fraud monitors to guarantee asset protection 24/7.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs hover:shadow-xl hover:border-[#8D6E63] hover:-translate-y-1 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#241611]">High Guaranteed Yields</h3>
              <p className="text-[#6D4C41] text-sm leading-relaxed">
                Unlike legacy banks that offer near-zero interest, our Deposit Pension Scheme and Fixed Deposit Receipts pass premium treasury yields directly back to you.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="p-10 rounded-3xl bg-gradient-to-r from-[#4E342E] via-[#3E2723] to-[#2E1A11] border border-[#5D4037] text-white shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-black text-white">125K+</p>
              <p className="text-xs text-[#D7CCC8] uppercase tracking-wider mt-1 font-semibold">Verified Clients</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#D4A373]">$650M+</p>
              <p className="text-xs text-[#D7CCC8] uppercase tracking-wider mt-1 font-semibold">Assets Protected</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#FAF7F2]">180+</p>
              <p className="text-xs text-[#D7CCC8] uppercase tracking-wider mt-1 font-semibold">Countries Supported</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#D7CCC8]">99.99%</p>
              <p className="text-xs text-[#D7CCC8] uppercase tracking-wider mt-1 font-semibold">System Reliability</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

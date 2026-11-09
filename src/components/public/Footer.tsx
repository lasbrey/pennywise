"use client";

import Link from "next/link";
import Logo from "@/components/public/Logo";
import { Mail, Phone, MapPin, ShieldCheck, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#241712] border-t border-[#3E2723] text-[#D7CCC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo href="/" variant="light" size="lg" />
            <p className="text-sm leading-relaxed text-[#BCAAA4] max-w-sm">
              Your trusted partner in modern digital banking. Secure, fast, and engineered to empower personal financial growth and seamless business transactions.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3E2723] border border-[#5D4037] text-[#D7CCC8] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
                <span>256-bit Bank Grade Security</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3E2723] border border-[#5D4037] text-[#D7CCC8] text-xs font-semibold">
                <Lock className="w-4 h-4 text-[#D4A373]" />
                <span>FDIC Insured Protection</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-white transition-colors duration-200">
                  Banking Solutions
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Banking Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard/transfer" className="hover:text-white transition-colors duration-200">
                  Fast Wire Transfers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/dps" className="hover:text-white transition-colors duration-200">
                  Deposit Pension Scheme (DPS)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/fdr" className="hover:text-white transition-colors duration-200">
                  Fixed Deposit Receipts (FDR)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/cards" className="hover:text-white transition-colors duration-200">
                  Virtual Visa & Mastercard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/loans" className="hover:text-white transition-colors duration-200">
                  Commercial & Personal Loans
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Reach Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-[#D7CCC8]">
                <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
                <a href="mailto:info@pennytrust.com" className="hover:text-white transition-colors">
                  info@pennytrust.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[#D7CCC8]">
                <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>+1 (800) 555-PENNY</span>
              </li>
              <li className="flex items-start gap-2.5 text-[#D7CCC8]">
                <MapPin className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                <span>Financial District, Suite 400, New York, NY</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#3E2723] flex flex-col md:flex-row items-center justify-between text-xs text-[#A1887F] gap-4">
          <p>© 2026 PennyWiseTrust Bank. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-[#D7CCC8] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-[#D7CCC8] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/contact" className="hover:text-[#D7CCC8] transition-colors">
              Security Notice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

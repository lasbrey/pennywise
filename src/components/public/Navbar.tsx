"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "@/components/public/Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-[#EADFD5] shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo href="/" size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <Link
              href="/"
              className="text-[#3E2723] hover:text-[#8D6E63] transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-[#6D4C41] hover:text-[#2E1A11] transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              href="/solutions"
              className="text-[#6D4C41] hover:text-[#2E1A11] transition-colors duration-200"
            >
              Solutions
            </Link>
            <Link
              href="/how-it-works"
              className="text-[#6D4C41] hover:text-[#2E1A11] transition-colors duration-200"
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="text-[#6D4C41] hover:text-[#2E1A11] transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-[#4E342E] hover:text-[#2E1A11] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#5D4037] via-[#4E342E] to-[#3E2723] rounded-full shadow-md shadow-[#4E342E]/25 hover:shadow-xl hover:shadow-[#4E342E]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Open Account</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#4E342E] hover:text-[#2E1A11]"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-b border-[#EADFD5] bg-[#FDFBF7] px-4 pt-3 pb-6 space-y-3 animate-slide-up">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#3E2723] hover:bg-[#F2ECE4]"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#5D4037] hover:bg-[#F2ECE4]"
          >
            About Us
          </Link>
          <Link
            href="/solutions"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#5D4037] hover:bg-[#F2ECE4]"
          >
            Solutions
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#5D4037] hover:bg-[#F2ECE4]"
          >
            How It Works
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-[#5D4037] hover:bg-[#F2ECE4]"
          >
            Contact
          </Link>
          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 text-sm font-bold text-[#4E342E] border border-[#D7CCC8] rounded-xl hover:bg-white"
            >
              Log In
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 text-sm font-bold text-white bg-[#4E342E] rounded-xl shadow-md shadow-[#4E342E]/30"
            >
              Open Account ($8 Bonus)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

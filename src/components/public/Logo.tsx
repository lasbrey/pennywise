"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function Logo({
  className = "",
  variant = "dark",
  size = "md",
  href = "/",
}: LogoProps) {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: "h-7 text-base gap-2",
    md: "h-9 text-xl gap-2.5",
    lg: "h-11 text-2xl gap-3",
  }[size];

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  }[size];

  const content = (
    <div className={`inline-flex items-center ${sizeClasses} font-black tracking-tight select-none ${className}`}>
      {/* Luxury Bank Crest Icon */}
      <div
        className={`${iconSizes} rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105 ${
          isLight
            ? "bg-white/10 text-white border border-white/20"
            : "bg-[#4E342E] text-[#FDFBF7] shadow-[#4E342E]/20"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-[#D4A373]"
        >
          {/* Bank Columns & Roof */}
          <path d="M3 21h18" />
          <path d="M3 10h18" />
          <path d="M12 2L3 7h18l-9-5z" />
          <path d="M6 10v7" />
          <path d="M10 10v7" />
          <path d="M14 10v7" />
          <path d="M18 10v7" />
        </svg>
      </div>

      {/* Typography: PennyWiseTrust */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center">
          <span className={isLight ? "text-white" : "text-[#2E1A11]"}>PennyWise</span>
          <span className="text-[#A16207] dark:text-[#D4A373] ml-0.5 font-black">Trust</span>
        </div>
        <span
          className={`text-[8px] sm:text-[9px] uppercase tracking-widest font-extrabold mt-0.5 ${
            isLight ? "text-white/60" : "text-[#8D6E63]"
          }`}
        >
          Private Banking
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex group">
        {content}
      </Link>
    );
  }

  return content;
}


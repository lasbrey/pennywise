import type { Metadata } from "next";
import "./globals.css";
import { BankProvider } from "@/context/BankContext";
import TawkTo from "@/components/TawkTo";

export const metadata: Metadata = {
  title: "PennyWiseTrust Bank - Premier Digital Banking",
  description:
    "Fast, secure, and hassle-free banking. Effortlessly manage your finances, savings, investments, virtual cards, and loans with PennyWiseTrust Bank.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#2C1D16] font-sans selection:bg-[#8D6E63]/20 selection:text-[#3E2723]">
        <BankProvider>
          {children}
          <TawkTo />
        </BankProvider>
      </body>
    </html>
  );
}

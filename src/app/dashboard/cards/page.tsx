"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import {
  CreditCard,
  Lock,
  Unlock,
  Plus,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

export default function CardsPage() {
  const { cards, balance, toggleFreezeCard, createVirtualCard, payCardFee } = useBank();
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || "");
  const [showModal, setShowModal] = useState(false);
  const [newTier, setNewTier] = useState<"Standard" | "Platinum" | "Black">("Platinum");
  const [newType, setNewType] = useState<"Visa" | "Mastercard">("Visa");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const currentCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleCopy = (num: string) => {
    if (!currentCard?.isPaid) return;
    navigator.clipboard?.writeText(num.replace(/\s+/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayFee = () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!currentCard) return;

    const res = payCardFee(currentCard.id);
    if (!res.success) {
      setErrorMsg(res.error || "Could not process card fee payment.");
    } else {
      setSuccessMsg("Card issuance fee paid successfully! Your virtual card is now active.");
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const res = createVirtualCard(newTier, newType);
    if (!res.success) {
      setErrorMsg(res.error || "Could not generate card.");
    } else {
      setSuccessMsg(`Successfully issued new ${newTier} ${newType} card!`);
      setShowModal(false);
    }
  };

  const getTierFee = (tier: "Standard" | "Platinum" | "Black") => {
    return tier === "Black" ? 100 : tier === "Platinum" ? 50 : 25;
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
              Virtual Cards
            </h1>
            <p className="text-sm text-[#6D4C41] mt-1">
              Issue and configure instant digital debit cards with dynamic CVV and custom spend limits.
            </p>
          </div>
          <button
            onClick={() => {
              setErrorMsg("");
              setSuccessMsg("");
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white text-xs font-bold shadow-md shadow-[#4E342E]/25 hover:scale-105 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Order Virtual Card</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between gap-3">
            <span>{errorMsg}</span>
            <Link
              href="/dashboard/deposit"
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shrink-0 hover:bg-red-700"
            >
              Deposit Funds →
            </Link>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            {successMsg}
          </div>
        )}

        {currentCard ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Card display */}
            <div className="lg:col-span-7 space-y-4">
              <div
                onClick={() => {
                  if (currentCard.isPaid) {
                    setFlipped(!flipped);
                  }
                }}
                className={`group perspective-[1000px] ${currentCard.isPaid ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <div
                  className={`relative w-full aspect-[1.58/1] rounded-3xl p-6 sm:p-8 text-white shadow-2xl transition-all duration-500 [transform-style:preserve-3d] ${
                    flipped ? "[transform:rotateY(180deg)]" : ""
                  } ${
                    currentCard.tier === "Black"
                      ? "bg-gradient-to-tr from-[#140D0A] via-[#241611] to-[#3E2723] border border-[#5D4037]"
                      : currentCard.tier === "Platinum"
                      ? "bg-gradient-to-tr from-[#241611] via-[#3E2723] to-[#5D4037] border border-[#795548]"
                      : "bg-gradient-to-tr from-[#3E2723] via-[#4E342E] to-[#6D4C41] border border-[#8D6E63]"
                  }`}
                >
                  {/* Front Side */}
                  <div className={`absolute inset-0 p-6 sm:p-8 flex flex-col justify-between [backface-visibility:hidden] ${flipped ? "hidden" : "flex"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold tracking-widest text-[#D7CCC8] uppercase">
                          PennyWiseTrust Bank
                        </p>
                        <p className="text-base font-black text-white">{currentCard.tier} Virtual</p>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold tracking-widest">
                        {currentCard.cardType}
                      </div>
                    </div>

                    <div className="my-auto">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xl sm:text-2xl tracking-widest text-white drop-shadow">
                          {currentCard.isPaid
                            ? currentCard.cardNumber
                            : "•••• •••• •••• ••••"}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#D7CCC8] mt-1 block">
                        {currentCard.isPaid
                          ? "Tap anywhere on card to reveal CVV security code"
                          : "⚠️ Card details starred until creation fee is paid"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[9px] uppercase text-[#D7CCC8] font-medium">Cardholder</p>
                        <p className="font-bold text-white">{currentCard.cardHolder}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase text-[#D7CCC8] font-medium">Expires</p>
                        <p className="font-bold text-white">{currentCard.isPaid ? currentCard.expiry : "••/••"}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold">
                        <span className={`w-2 h-2 rounded-full ${!currentCard.isPaid ? "bg-amber-400" : currentCard.isFrozen ? "bg-red-400" : "bg-emerald-400"}`} />
                        <span>
                          {!currentCard.isPaid
                            ? "UNACTIVATED"
                            : currentCard.isFrozen
                            ? "FROZEN"
                            : "ACTIVE"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className={`absolute inset-0 p-6 sm:p-8 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] ${flipped ? "flex" : "hidden"}`}>
                    <div className="w-full h-10 bg-black/60 -mx-6 sm:-mx-8 mt-2" />
                    <div className="space-y-1">
                      <div className="flex items-center justify-end gap-3 p-3 bg-white/10 rounded-xl">
                        <span className="text-[10px] uppercase text-[#D7CCC8]">CVV / CVC:</span>
                        <span className="font-mono text-base font-extrabold text-white tracking-widest">
                          {currentCard.isPaid ? currentCard.cvv : "•••"}
                        </span>
                      </div>
                      <p className="text-[9px] text-[#D7CCC8] text-center pt-2">
                        Authorized virtual card issued by PennyWiseTrust Financial Corp.
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#D7CCC8]">
                      <span>Click to flip back</span>
                      <span className="font-mono">{currentCard.cardType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activation / Payment prompt if unpaid */}
              {!currentCard.isPaid ? (
                <div className="p-6 rounded-3xl bg-[#FFF8E7] border border-[#FFE082] space-y-4 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2E1A11]">
                        Activate Your Virtual Card (${currentCard.creationFee || 50}.00 USD Fee)
                      </h4>
                      <p className="text-xs text-[#6D4C41] mt-0.5 leading-relaxed">
                        To unlock and unmask this card for online shopping, subscriptions, and international payments, a one-time issuance fee of{" "}
                        <strong>${currentCard.creationFee || 50}.00 USD</strong> is required.
                      </p>
                      <p className="text-xs text-[#8D6E63] font-bold mt-1">
                        Current Available Balance: ${balance.toFixed(2)} USD
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      onClick={handlePayFee}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white text-xs font-bold shadow-md shadow-[#4E342E]/25 hover:scale-102 transition-all flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Pay ${currentCard.creationFee || 50}.00 & Reveal Card</span>
                    </button>

                    <Link
                      href="/dashboard/deposit"
                      className="py-3 px-4 rounded-xl bg-white border border-[#FFE082] hover:bg-[#FAF7F2] text-xs font-bold text-[#4E342E] text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Add Funds (Bitcoin / Cash)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Action Buttons for Paid Card */
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopy(currentCard.cardNumber)}
                    className="flex-1 py-3 px-4 rounded-xl bg-white border border-[#EADFD5] hover:bg-[#FAF7F2] text-xs font-bold text-[#4E342E] flex items-center justify-center gap-2 transition-all shadow-xs hover:-translate-y-0.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Card Number Copied!" : "Copy Card Number"}</span>
                  </button>

                  <button
                    onClick={() => toggleFreezeCard(currentCard.id)}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs hover:-translate-y-0.5 ${
                      currentCard.isFrozen
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                        : "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {currentCard.isFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>{currentCard.isFrozen ? "Unfreeze Card" : "Freeze Card"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Card Parameters & Selector */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#2E1A11]">Your Virtual Cards</h3>
                <div className="space-y-2">
                  {cards.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCardId(c.id);
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedCardId === c.id
                          ? "bg-[#F5EFE6] border-[#4E342E]"
                          : "bg-[#FAF7F2] border-[#EADFD5] hover:bg-[#EFEBE9]"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#2E1A11]">{c.tier} {c.cardType}</p>
                        <p className="text-[11px] text-[#8D6E63] font-mono mt-0.5">
                          {c.isPaid ? `•••• ${c.cardNumber.slice(-4)}` : "•••• •••• (Unpaid)"}
                        </p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        !c.isPaid
                          ? "bg-amber-100 text-amber-800"
                          : c.isFrozen
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {!c.isPaid ? "$50 Fee Due" : c.isFrozen ? "Frozen" : "Active"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#2E1A11]">Card Limits & Spending</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-[#6D4C41]">Monthly Spend Limit</span>
                      <span className="font-bold text-[#2E1A11]">${currentCard.limit.toLocaleString()} USD</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#EADFD5] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#4E342E] to-[#8D6E63]"
                        style={{ width: `${Math.min(100, (currentCard.spent / currentCard.limit) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-[#6D4C41] pt-1">
                    <span>Spent this period:</span>
                    <span className="font-mono font-bold text-[#2E1A11]">${currentCard.spent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#6D4C41]">
                    <span>Remaining capacity:</span>
                    <span className="font-mono font-bold text-[#4E342E]">
                      ${(currentCard.limit - currentCard.spent).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modal: Order New Card */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-slide-up">
            <div className="bg-white border border-[#EADFD5] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
              <div>
                <h3 className="text-xl font-bold text-[#2E1A11]">Order New Virtual Card</h3>
                <p className="text-xs text-[#6D4C41] mt-1">
                  Card issuance requires an upfront creation fee deducted from your balance.
                </p>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                    Card Tier & Pricing
                  </label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-sm font-bold"
                  >
                    <option value="Standard">Standard ($2,500 Limit) — $25.00 USD Fee</option>
                    <option value="Platinum">Platinum ($10,000 Limit) — $50.00 USD Fee</option>
                    <option value="Black">Black Metal VIP ($25,000 Limit) — $100.00 USD Fee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                    Payment Rail
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-sm font-semibold"
                  >
                    <option value="Visa">Visa Debit</option>
                    <option value="Mastercard">Mastercard</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#EADFD5] text-xs space-y-1">
                  <div className="flex justify-between text-[#6D4C41]">
                    <span>Card Issuance Fee:</span>
                    <span className="font-bold text-[#2E1A11]">${getTierFee(newTier)}.00 USD</span>
                  </div>
                  <div className="flex justify-between text-[#6D4C41]">
                    <span>Your Current Balance:</span>
                    <span className="font-mono font-bold text-[#4E342E]">${balance.toFixed(2)} USD</span>
                  </div>
                  {balance < getTierFee(newTier) && (
                    <p className="text-[11px] text-red-600 font-semibold pt-1">
                      ⚠️ Insufficient balance. Please deposit funds first.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl bg-[#FAF7F2] text-[#6D4C41] text-xs font-bold hover:bg-[#EFEBE9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white text-xs font-bold shadow-md shadow-[#4E342E]/25"
                  >
                    Pay & Issue Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

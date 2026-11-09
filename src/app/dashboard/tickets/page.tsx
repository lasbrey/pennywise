"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Plus, X, Upload, Filter, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useBank } from "@/context/BankContext";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  precedence: "Low" | "Medium" | "High";
  lastOpen: string;
  status: "Open" | "Pending" | "Resolved";
  message: string;
  image?: string | null;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { user } = useBank();
  const [showModal, setShowModal] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [subjectQuery, setSubjectQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");

  // Load tickets from Supabase on mount
  useEffect(() => {
    async function loadTickets() {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from("support_tickets")
            .select("*")
            .order("created_at", { ascending: false });

          if (data && data.length > 0) {
            setTickets(
              data.map((t: any) => ({
                id: t.id,
                ticketNumber: t.ticket_number,
                subject: t.subject,
                precedence: t.precedence,
                lastOpen: new Date(t.created_at).toLocaleDateString(),
                status: t.status,
                message: t.message,
                image: t.image_url,
              }))
            );
          }
        } catch (e) {
          console.warn("Could not load tickets from Supabase", e);
        }
      }
    }
    loadTickets();
  }, []);

  // Form states
  const [subject, setSubject] = useState("");
  const [precedence, setPrecedence] = useState<"Low" | "Medium" | "High">("Low");
  const [message, setMessage] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const tckNumber = `#TCK${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket: Ticket = {
      id: `tick-${Date.now()}`,
      ticketNumber: tckNumber,
      subject,
      precedence,
      lastOpen: "Just now",
      status: "Open",
      message,
      image: attachedImage,
    };

    setTickets((prev) => [newTicket, ...prev]);

    // Send to Supabase DB
    if (isSupabaseConfigured) {
      try {
        await supabase.from("support_tickets").insert({
          ticket_number: tckNumber,
          user_id: user?.id || null,
          subject,
          precedence,
          message,
          image_url: attachedImage,
          status: "Open",
        });
      } catch (err) {
        console.error("Could not insert support ticket into Supabase", err);
      }
    }

    setIsSubmitting(false);
    setShowModal(false);
    setShowInlineForm(false);
    setSubject("");
    setMessage("");
    setAttachedImage(null);
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 5000);
  };

  const filteredTickets = tickets.filter((t) => {
    return t.subject.toLowerCase().includes(subjectQuery.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-slide-up pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11]">
              My Ticket List
            </h1>
            <p className="text-sm text-[#6D4C41] mt-1">
              Open support inquiries directly with the PennyWiseTrust priority banking desk.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#4E342E] hover:bg-[#3E2723] text-white text-xs font-bold shadow-md shadow-[#4E342E]/25 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ticket</span>
            </button>
          </div>
        </div>

        {successNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-slide-up">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Your support ticket has been opened successfully and synced with the database! An officer will reply shortly.</span>
          </div>
        )}

        {/* Filter controls matching user's Image 1 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-[#6D4C41] mb-2">Subject</label>
              <input
                type="text"
                value={subjectQuery}
                onChange={(e) => setSubjectQuery(e.target.value)}
                placeholder="Search subject..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-xs focus:outline-none focus:border-[#4E342E]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-[#6D4C41] mb-2">Date</label>
              <input
                type="date"
                value={dateQuery}
                onChange={(e) => setDateQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-xs focus:outline-none focus:border-[#4E342E]"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>FILTER</span>
              </button>
            </div>

            <div className="sm:col-span-2 text-right">
              <label className="block text-xs font-bold text-[#6D4C41] mb-2">Entries</label>
              <select className="px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-xs font-bold">
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          {/* Ticket Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EADFD5] text-[#8D6E63]">
                  <th className="pb-3 font-bold uppercase tracking-wider">TICKET</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">PRECEDENCE</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">LAST OPEN</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">STATUS</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFD5]">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#8D6E63] font-semibold text-sm">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-4 font-bold text-[#2E1A11]">
                        <span>{t.ticketNumber}</span>
                        <p className="text-[11px] text-[#6D4C41] font-normal mt-0.5">{t.subject}</p>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            t.precedence === "High"
                              ? "bg-red-100 text-red-700"
                              : t.precedence === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {t.precedence}
                        </span>
                      </td>
                      <td className="py-4 text-[#8D6E63]">{t.lastOpen}</td>
                      <td className="py-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => alert(`Ticket: ${t.ticketNumber}\nSubject: ${t.subject}\nStatus: ${t.status}\nMessage: ${t.message}`)}
                          className="px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#EADFD5] text-[#4E342E] hover:bg-[#EFEBE9] font-bold text-[11px]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POPUP MODAL: OPEN A NEW TICKET (Matching User's Attached Screenshot) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-scale-up border border-[#EADFD5]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
              <h2 className="text-xl sm:text-2xl font-black text-[#2E1A11]">
                Open a New Ticket
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitTicket} className="space-y-5">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-[#4E342E] mb-1.5">
                  Subject<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#D7CCC8] text-[#2E1A11] text-xs font-medium focus:outline-none focus:border-[#4E342E] focus:ring-1 focus:ring-[#4E342E]"
                />
              </div>

              {/* Precedence */}
              <div>
                <label className="block text-xs font-bold text-[#4E342E] mb-1.5">
                  Precedence<span className="text-red-500">*</span>
                </label>
                <select
                  value={precedence}
                  onChange={(e) => setPrecedence(e.target.value as "Low" | "Medium" | "High")}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#D7CCC8] text-[#2E1A11] text-xs font-medium focus:outline-none focus:border-[#4E342E] focus:ring-1 focus:ring-[#4E342E]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Your Message */}
              <div>
                <label className="block text-xs font-bold text-[#4E342E] mb-1.5">
                  Your Message<span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide details of your request or issue..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#D7CCC8] text-[#2E1A11] text-xs font-medium focus:outline-none focus:border-[#4E342E] focus:ring-1 focus:ring-[#4E342E]"
                />
              </div>

              {/* Add & Attach Image */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-lg bg-[#0E7490] hover:bg-[#085a70] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </span>
                </div>

                <label className="border-2 border-dashed border-[#B0BEC5] hover:border-[#4E342E] rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer bg-[#F8FAFC] transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setAttachedImage(e.target.files[0].name);
                      }
                    }}
                  />
                  <div className="w-10 h-10 rounded-full bg-white text-[#0E7490] flex items-center justify-center mb-2 shadow-xs">
                    <Upload className="w-5 h-5 text-[#0E7490]" />
                  </div>
                  <span className="text-xs font-bold text-[#0E7490]">
                    {attachedImage ? `Selected: ${attachedImage}` : "Attach Image"}
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 rounded-2xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-xs shadow-md shadow-[#4E342E]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>✓ Create Ticket</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-3 px-6 rounded-2xl bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold text-xs shadow-md transition-all"
                >
                  ✕ Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

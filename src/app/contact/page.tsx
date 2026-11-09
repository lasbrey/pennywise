"use client";

import { useState } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C1D16]">
      <Navbar />

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-slide-up">
            <span className="text-[#795548] text-xs font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#D7CCC8]">
              24/7 Dedicated Support
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#241611]">
              We&apos;re Here to Help
            </h1>
            <p className="text-[#6D4C41] text-base">
              Have questions regarding wire transfers, loan applications, or high-yield savings? Our customer support desk is available around the clock.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs space-y-6">
                <h3 className="text-xl font-bold text-[#241611]">Direct Channels</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#241611]">Email Inquiries</h4>
                      <p className="text-xs text-[#8D6E63] mb-1">Our team typically responds in under 15 minutes.</p>
                      <a href="mailto:info@pennytrust.com" className="text-sm font-bold text-[#4E342E] hover:underline">
                        info@pennytrust.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#241611]">Telephone Support</h4>
                      <p className="text-xs text-[#8D6E63] mb-1">Toll-free international concierge service.</p>
                      <p className="text-sm font-bold text-[#4E342E]">+1 (800) 555-PENNY</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#4E342E] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#241611]">Headquarters</h4>
                      <p className="text-xs text-[#8D6E63]">
                        Financial District Plaza, Tower 4, Suite 800, New York, NY 10005, United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ box */}
              <div className="p-6 rounded-2xl bg-[#F5EFE6] border border-[#EADFD5] space-y-2">
                <h4 className="text-sm font-bold text-[#3E2723]">Need immediate help?</h4>
                <p className="text-xs text-[#6D4C41]">
                  Registered account holders can open priority tickets directly inside the authenticated banking portal for expedited resolution.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EADFD5] shadow-lg shadow-[#4E342E]/5">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#EFEBE9] text-[#4E342E] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#241611]">Message Dispatched!</h3>
                    <p className="text-[#6D4C41] text-sm max-w-md mx-auto">
                      Thank you for contacting PennyWiseTrust Bank. A senior customer support officer has received your message and will reply to <span className="text-[#241611] font-bold">{formData.email}</span> shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-[#4E342E] text-white text-xs font-bold hover:bg-[#3E2723] transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold text-[#241611]">Send Us a Direct Message</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                          Your Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Wire transfer inquiry"
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6D4C41] mb-2">
                        Message Content
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Provide details about your question or request..."
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] placeholder-[#A1887F] focus:outline-none focus:border-[#4E342E] text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white font-bold text-sm shadow-md shadow-[#4E342E]/25 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span>Submit Inquiry</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

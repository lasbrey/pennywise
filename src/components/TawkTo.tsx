"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, X, Send, Bot, ShieldCheck } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useBank } from "@/context/BankContext";

interface ChatMessage {
  id: string | number;
  session_id: string;
  sender_name: string;
  sender_role: "user" | "support" | "system";
  message: string;
  created_at: string;
}

export default function LiveChat() {
  const { user } = useBank();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize unique session ID
  useEffect(() => {
    let sid = localStorage.getItem("pennywise_chat_session");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("pennywise_chat_session", sid);
    }
    setSessionId(sid);
  }, []);

  // Fetch initial chat history from Supabase
  useEffect(() => {
    if (!sessionId) return;

    async function fetchMessages() {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("session_id", sessionId)
            .order("created_at", { ascending: true });

          if (data && data.length > 0) {
            setMessages(data);
            return;
          }
        } catch (e) {
          console.warn("Could not fetch messages from Supabase", e);
        }
      }

      // Default initial welcome message if no history
      setMessages([
        {
          id: 1,
          session_id: sessionId,
          sender_name: "PennyWiseTrust Concierge",
          sender_role: "support",
          message:
            "Hello! Welcome to PennyWiseTrust Live Support. How may we assist you with your account, Bitcoin deposit, or wire transfers today?",
          created_at: new Date().toISOString(),
        },
      ]);
    }

    fetchMessages();

    // Realtime subscription if Supabase configured
    if (isSupabaseConfigured) {
      const channel = supabase
        .channel(`chat_${sessionId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `session_id=eq.${sessionId}`,
          },
          (payload) => {
            const newMsg = payload.new as ChatMessage;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userText = input.trim();
    setInput("");

    const userMsg: ChatMessage = {
      id: "tmp_" + Date.now(),
      session_id: sessionId,
      sender_name: user?.name || "Client",
      sender_role: "user",
      message: userText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Send to Supabase DB
    if (isSupabaseConfigured) {
      try {
        await supabase.from("chat_messages").insert({
          session_id: sessionId,
          user_id: user?.id || null,
          sender_name: user?.name || "Client",
          sender_role: "user",
          message: userText,
        });
      } catch (err) {
        console.error("Failed to insert into Supabase chat_messages:", err);
      }
    }

    // Automated support reply (persisted to Supabase too)
    setTimeout(async () => {
      const replyText =
        "Thank you for contacting PennyWiseTrust. An agent is reviewing your message. For Bitcoin and Cash deposits, ledger approvals are credited once network confirmations settle.";

      const supportMsg: ChatMessage = {
        id: "tmp_sup_" + Date.now(),
        session_id: sessionId,
        sender_name: "PennyWiseTrust Officer",
        sender_role: "support",
        message: replyText,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, supportMsg]);

      if (isSupabaseConfigured) {
        try {
          await supabase.from("chat_messages").insert({
            session_id: sessionId,
            sender_name: "PennyWiseTrust Officer",
            sender_role: "support",
            message: replyText,
          });
        } catch (e) {
          console.warn("Could not insert support reply to Supabase", e);
        }
      }
    }, 1200);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Widget Trigger */}
      {!isOpen && (
        <div className="relative group flex items-center">
          {/* Animated "We Are Here!" Badge */}
          <div className="absolute right-16 -top-3 hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white text-[#2E1A11] text-xs font-bold rounded-full shadow-lg border border-[#EADFD5] animate-bounce whitespace-nowrap">
            <span>👋</span>
            <span>We Are Here!</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#3E2723] via-[#4E342E] to-[#6D4C41] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white relative"
            title="Chat with Customer Support"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
              1
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Window (Supabase Connected) */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-3xl bg-white border border-[#EADFD5] shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#3E2723] via-[#4E342E] to-[#2E1A11] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-[#D4A373]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white">PennyWiseTrust Support</h4>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                    DB Sync
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#D7CCC8]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>24/7 Concierge Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF7F2] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender_role === "user" ? "items-end" : "items-start"}`}
              >
                <span className="text-[10px] text-[#8D6E63] font-semibold mb-1 px-1">
                  {m.sender_name}
                </span>
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl ${
                    m.sender_role === "user"
                      ? "bg-[#4E342E] text-white shadow-xs"
                      : "bg-white text-[#2E1A11] border border-[#EADFD5] shadow-xs"
                  }`}
                >
                  <p className="leading-relaxed">{m.message}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#EADFD5] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about deposits, cards, or transfers..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[#2E1A11] text-xs focus:outline-none focus:border-[#4E342E]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] text-white transition-colors shadow-2xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

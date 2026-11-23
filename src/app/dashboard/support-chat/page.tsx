"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useBank } from "@/context/BankContext";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { isSupportAdmin } from "@/lib/supportAdmin";
import {
  MessageSquare,
  Send,
  Search,
  ShieldAlert,
  UserCheck,
  User,
  Clock,
  CheckCheck,
} from "lucide-react";

interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string | null;
  sender_name: string;
  sender_role: "user" | "support" | "system";
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  key: string;
  userId: string | null;
  latestSessionId: string;
  displayName: string;
  isRegistered: boolean;
  messages: ChatMessage[];
  lastMessage: ChatMessage;
  unreadCount: number;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function SupportChatInboxPage() {
  const { user } = useBank();
  const authorized = isSupportAdmin(user);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authorized || !isSupabaseConfigured) {
      return;
    }

    let active = true;

    async function loadAllMessages() {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (!active) return;
      if (error) {
        console.error("Failed to fetch support chat messages:", error);
      } else if (data) {
        setMessages(data as ChatMessage[]);
      }
      setLoading(false);
    }

    loadAllMessages();

    const channel = supabase
      .channel("support_admin_inbox")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const updated = payload.new as ChatMessage;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          );
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [authorized]);

  // Group all messages into individual user/guest conversations
  const conversations: Conversation[] = useMemo(() => {
    const map = new Map<string, ChatMessage[]>();

    for (const msg of messages) {
      const key = msg.user_id ? `user:${msg.user_id}` : `sess:${msg.session_id}`;
      const list = map.get(key) || [];
      list.push(msg);
      map.set(key, list);
    }

    const result: Conversation[] = [];
    for (const [key, list] of map.entries()) {
      const sorted = [...list].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const userMsgs = sorted.filter((m) => m.sender_role === "user");
      const latestUserMsg = userMsgs[userMsgs.length - 1];
      const latestMsg = sorted[sorted.length - 1];
      const userId = sorted.find((m) => m.user_id)?.user_id || null;

      const displayName =
        latestUserMsg?.sender_name ||
        (userId ? "Registered Client" : `Guest (${latestMsg.session_id})`);

      const unreadCount = sorted.filter(
        (m) => m.sender_role === "user" && !m.is_read
      ).length;

      result.push({
        key,
        userId,
        latestSessionId: latestUserMsg?.session_id || latestMsg.session_id,
        displayName,
        isRegistered: Boolean(userId),
        messages: sorted,
        lastMessage: latestMsg,
        unreadCount,
      });
    }

    // Sort newest activity first
    result.sort(
      (a, b) =>
        new Date(b.lastMessage.created_at).getTime() -
        new Date(a.lastMessage.created_at).getTime()
    );

    return result;
  }, [messages]);

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.displayName.toLowerCase().includes(q) ||
        c.latestSessionId.toLowerCase().includes(q) ||
        c.lastMessage.message.toLowerCase().includes(q)
    );
  }, [conversations, search]);

  const activeKey = selectedKey ?? conversations[0]?.key ?? null;

  const selectedConv = useMemo(
    () => conversations.find((c) => c.key === activeKey) || null,
    [conversations, activeKey]
  );

  // Mark unread user messages as read when conversation is open
  useEffect(() => {
    if (!selectedConv || !authorized || !isSupabaseConfigured) return;
    const unreadIds = selectedConv.messages
      .filter((m) => m.sender_role === "user" && !m.is_read)
      .map((m) => m.id);

    if (unreadIds.length === 0) return;

    supabase
      .from("chat_messages")
      .update({ is_read: true })
      .in("id", unreadIds)
      .then(({ error }) => {
        if (error) {
          console.warn("Could not mark messages as read:", error);
          return;
        }
        setMessages((prev) =>
          prev.map((m) =>
            unreadIds.includes(m.id) ? { ...m, is_read: true } : m
          )
        );
      });
  }, [selectedConv, authorized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages.length, activeKey]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !replyText.trim() || sending || !isSupabaseConfigured) {
      return;
    }

    const text = replyText.trim();
    setReplyText("");
    setSending(true);

    const tempId = "tmp_" + Date.now();
    const optimistic: ChatMessage = {
      id: tempId,
      session_id: selectedConv.latestSessionId,
      user_id: selectedConv.userId,
      sender_name: "PennyWiseTrust Concierge",
      sender_role: "support",
      message: text,
      is_read: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          session_id: selectedConv.latestSessionId,
          user_id: selectedConv.userId,
          sender_name: "PennyWiseTrust Concierge",
          sender_role: "support",
          message: text,
          is_read: true,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const saved = data as ChatMessage;
        setMessages((prev) => {
          const withoutDup = prev.filter((m) => m.id !== tempId && m.id !== saved.id);
          return [...withoutDup, saved];
        });
      }
    } catch (err) {
      console.error("Failed to send support reply:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setReplyText(text);
    } finally {
      setSending(false);
    }
  };

  if (!authorized) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto mt-12 p-8 rounded-3xl bg-white border border-[#EADFD5] shadow-xs text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-[#2E1A11]">
            Support Concierge Access Only
          </h1>
          <p className="text-sm text-[#6D4C41]">
            This live chat inbox is restricted to authorized PennyWiseTrust
            support administrators.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#2E1A11] tracking-tight">
                Live Support Inbox
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Real-Time Sync
              </span>
            </div>
            <p className="text-sm text-[#6D4C41] mt-1">
              View every client&apos;s support conversation and reply in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-[#EADFD5] shadow-2xs text-xs">
            <MessageSquare className="w-4 h-4 text-[#8D6E63]" />
            <span className="font-bold text-[#2E1A11]">
              {conversations.length}
            </span>
            <span className="text-[#6D4C41]">
              {conversations.length === 1 ? "Conversation" : "Conversations"}
            </span>
          </div>
        </div>

        {/* Split Inbox Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-[#EADFD5] shadow-xs overflow-hidden min-h-[600px] h-[calc(100vh-230px)]">
          {/* Left Column: Individual Users / Conversations */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#EADFD5] flex flex-col bg-[#FDFBF7] overflow-hidden">
            <div className="p-4 border-b border-[#EADFD5] bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user or session..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-xs text-[#2E1A11] focus:outline-none focus:border-[#4E342E]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#EADFD5]">
              {loading ? (
                <div className="p-8 text-center text-xs text-[#8D6E63]">
                  Loading conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8D6E63]">
                  No support messages yet.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.key === activeKey;
                  return (
                    <button
                      key={conv.key}
                      onClick={() => setSelectedKey(conv.key)}
                      className={`w-full text-left p-4 transition-colors flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-[#F5EFE6] border-l-4 border-l-[#4E342E]"
                          : "hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm ${
                          conv.isRegistered
                            ? "bg-[#4E342E] text-white"
                            : "bg-[#EADFD5] text-[#5D4037]"
                        }`}
                      >
                        {conv.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-[#2E1A11] truncate">
                            {conv.displayName}
                          </span>
                          {conv.unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                              conv.isRegistered
                                ? "text-emerald-700"
                                : "text-[#8D6E63]"
                            }`}
                          >
                            {conv.isRegistered ? (
                              <>
                                <UserCheck className="w-3 h-3" /> Registered
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3" /> Guest
                              </>
                            )}
                          </span>
                          <span className="text-[10px] text-[#8D6E63] font-mono truncate">
                            · {conv.latestSessionId}
                          </span>
                        </div>
                        <p className="text-xs text-[#6D4C41] truncate mt-1.5">
                          {conv.lastMessage.sender_role === "support"
                            ? `You: ${conv.lastMessage.message}`
                            : conv.lastMessage.message}
                        </p>
                        <p className="text-[10px] text-[#8D6E63] mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(conv.lastMessage.created_at)}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Conversation & Reply Box */}
          <div className="lg:col-span-8 flex flex-col bg-[#FAF7F2] overflow-hidden">
            {!selectedConv ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8D6E63]">
                <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-bold text-[#2E1A11]">
                  Select a user conversation
                </p>
                <p className="text-xs mt-1">
                  Choose a client from the left to view their messages and reply
                  in real time.
                </p>
              </div>
            ) : (
              <>
                {/* Conversation Header */}
                <div className="p-4 bg-white border-b border-[#EADFD5] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#4E342E] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {selectedConv.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-black text-[#2E1A11] truncate">
                        {selectedConv.displayName}
                      </h2>
                      <p className="text-[11px] text-[#8D6E63] font-mono truncate">
                        Session: {selectedConv.latestSessionId}
                        {selectedConv.userId
                          ? ` · User ID: ${selectedConv.userId.slice(0, 8)}...`
                          : " · Unauthenticated Visitor"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {selectedConv.messages.map((m) => {
                    const isSupport = m.sender_role === "support";
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${
                          isSupport ? "items-end" : "items-start"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-[10px] font-bold text-[#8D6E63]">
                            {isSupport ? "You (Support)" : m.sender_name}
                          </span>
                          <span className="text-[10px] text-[#8D6E63]/80">
                            {formatTime(m.created_at)}
                          </span>
                        </div>
                        <div
                          className={`max-w-[78%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isSupport
                              ? "bg-[#4E342E] text-white"
                              : "bg-white text-[#2E1A11] border border-[#EADFD5]"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.message}</p>
                        </div>
                        {isSupport && (
                          <span className="text-[10px] text-[#8D6E63] mt-1 px-1 inline-flex items-center gap-1">
                            <CheckCheck className="w-3 h-3 text-emerald-600" />
                            Sent
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={handleSendReply}
                  className="p-4 bg-white border-t border-[#EADFD5] flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedConv.displayName}...`}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-sm text-[#2E1A11] focus:outline-none focus:border-[#4E342E]"
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="px-5 py-3 rounded-xl bg-[#4E342E] hover:bg-[#3E2723] disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

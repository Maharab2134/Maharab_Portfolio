import React from "react";
import {
  FaSyncAlt,
  FaTrash,
  FaReply,
  FaWhatsapp,
  FaBriefcase,
  FaEnvelope,
} from "react-icons/fa";
import { renderIcon } from "../types";

interface MessagesTabProps {
  messagesList: any[];
  unreadMessagesCount: number;
  selectedMessage: any | null;
  handleSelectMessage: (msg: any) => void;
  handleMarkAllRead: () => void;
  fetchMessages: () => void;
  handleDeleteMessage: (id: string, msg: any) => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  messagesList,
  unreadMessagesCount,
  selectedMessage,
  handleSelectMessage,
  handleMarkAllRead,
  fetchMessages,
  handleDeleteMessage,
}) => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Contact Inquiries</h2>
            {unreadMessagesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                {unreadMessagesCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Messages submitted directly via WhatsApp, Direct Mail, Contact & Hire ("Let's Collaborate")
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadMessagesCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-all cursor-pointer"
            >
              Mark All as Read
            </button>
          )}
          <button
            type="button"
            onClick={fetchMessages}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            {renderIcon(FaSyncAlt, { size: 10 })}
            <span>Refresh Inbox</span>
          </button>
        </div>
      </div>

      {messagesList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-[#111726]/50 text-slate-400 text-xs">
          No incoming messages found. Form submissions and button inquiries from visitors will automatically appear here.
        </div>
      ) : (
        /* Split Inbox Layout: Messages List on Left, Selected Message Reader on Right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Messages List (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {messagesList.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const isWhatsApp =
                (msg.subject && msg.subject.toLowerCase().includes("whatsapp")) ||
                (msg.message && msg.message.toLowerCase().includes("whatsapp")) ||
                (msg.email && msg.email.includes("whatsapp"));
              const isHire =
                (msg.subject && msg.subject.toLowerCase().includes("collaborat")) ||
                (msg.message && msg.message.toLowerCase().includes("collaborat")) ||
                (msg.email && msg.email.includes("hire"));

              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-indigo-500/60 bg-indigo-500/10 text-white shadow-md ring-1 ring-indigo-500/30"
                      : !msg.read
                      ? "border-indigo-500/30 bg-[#111726]/90 hover:bg-[#111726] text-white shadow-sm"
                      : "border-white/[0.06] bg-[#111726]/75 hover:bg-[#111726] text-slate-300 hover:border-white/[0.12]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold gap-2">
                    <div className="flex items-center gap-2 truncate">
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
                      )}
                      <span className="truncate text-white">{msg.name || "Anonymous Lead"}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(msg.id, msg);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete this message"
                      >
                        {renderIcon(FaTrash, { size: 10 })}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-[11px] text-cyan-300 truncate font-medium">{msg.email}</p>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 flex-shrink-0 ${
                        isWhatsApp
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : isHire
                          ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                          : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {renderIcon(
                        isWhatsApp
                          ? FaWhatsapp
                          : isHire
                          ? FaBriefcase
                          : FaEnvelope,
                        { size: 9 }
                      )}
                      <span>{isWhatsApp ? "WhatsApp" : isHire ? "Hire" : "Email"}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 truncate mt-1.5 font-medium">
                    {msg.subject || "(No Subject)"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected Message Viewer (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/85 backdrop-blur-sm space-y-5 shadow-xl">
            {selectedMessage ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedMessage.name}</h3>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-cyan-400 hover:text-cyan-300 hover:underline text-xs font-medium"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Your Portfolio Inquiry")}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold transition-colors cursor-pointer"
                    >
                      {renderIcon(FaReply, { size: 10 })}
                      <span>Reply Email</span>
                    </a>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id, selectedMessage)}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Message"
                    >
                      {renderIcon(FaTrash, { size: 12 })}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">Subject</span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {selectedMessage.subject || "General Inquiry"}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider">Message Content</span>
                  <div className="mt-1.5 p-4 rounded-xl bg-[#0c101d] border border-white/[0.08] text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedMessage.message}
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 font-mono pt-2">
                  Received: {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Select a message from the list to view full transmission details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

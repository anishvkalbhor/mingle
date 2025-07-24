import React from "react";

export default function ChatBotIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AI Assistant"
      className="fixed bottom-8 right-8 z-[1000] px-7 py-3 rounded-full bg-gradient-to-br from-[#23272f]/80 to-[#181b20]/80 border border-white/10 shadow-xl backdrop-blur-md flex items-center justify-center text-lg font-semibold text-slate-100 hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
      style={{
        fontFamily: "inherit",
        letterSpacing: "0.01em",
      }}
    >
      <span className="drop-shadow-sm">AI Assistant</span>
      <span className="ml-2 text-xl" role="img" aria-label="sparkles">
        ✨
      </span>
    </button>
  );
}

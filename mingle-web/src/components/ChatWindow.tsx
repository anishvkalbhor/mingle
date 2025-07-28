"use client";

import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { from: "them", text: "Hey! Glad we matched 😊" },
  ]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(4 * 24 * 60 * 60); // 4 days in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDisabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "you", text: input }]);
    setInput("");
  };

  const formatTime = (sec: number) => {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-4 w-full max-w-md sm:max-w-lg shadow-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-700">Chat</h2>
        <p className="text-sm text-pink-500 font-medium">
          ⏳ {formatTime(timeLeft)} left
        </p>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto border border-pink-100 p-3 rounded-md bg-pink-50 mb-4 text-sm sm:text-base">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.from === "you"
                ? "text-right text-blue-600"
                : "text-left text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input area */}
      {disabled ? (
        <div className="text-center text-sm text-gray-500">
          Chat expired 🕒 —{" "}
          <span className="text-pink-600 font-medium">
            Upgrade to continue 💎
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-xl px-2"
              title="Emoji Picker"
            >
              😊
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border px-3 py-2 rounded-md bg-white text-gray-900 placeholder:text-gray-400 text-base font-medium focus:outline-none focus:ring-2 focus:ring-pink-400 w-full sm:w-auto"
            />

            <button
              onClick={handleSend}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition-all"
            >
              Send
            </button>
          </div>

          {showEmoji && (
            <div className="mt-2">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setInput((prev) => prev + emojiData.emoji);
                  setShowEmoji(false);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

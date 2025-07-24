import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, User, Sparkles } from "lucide-react";

// --- Helper Components ---

const SimpleMarkdown = ({ text }: { text: string }) => {
  const formatText = (txt: string) => {
    let formattedText = txt.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-chat-ai-foreground">$1</strong>'
    );
    const listItems = formattedText
      .split("\n")
      .filter((line: string) => line.trim().startsWith("- "));
    if (listItems.length > 0) {
      const listHtml =
        '<ul class="space-y-1.5 mt-3">' +
        listItems
          .map(
            (item: string) =>
              `<li class="flex items-start text-sm"><span class="w-1.5 h-1.5 rounded-full bg-romance-primary mt-2 mr-3 flex-shrink-0"></span><span class="leading-relaxed">${item
                .trim()
                .substring(2)}</span></li>`
          )
          .join("") +
        "</ul>";
      formattedText = formattedText.replace(/(\n?- .*)+/g, listHtml);
    }
    return formattedText.replace(/\n/g, "<br />");
  };
  return (
    <div
      className="text-sm leading-relaxed text-chat-ai-foreground"
      dangerouslySetInnerHTML={{ __html: formatText(text) }}
    />
  );
};

const ChatMessage = ({
  message,
  isUser,
}: {
  message: string;
  isUser: boolean;
}) => {
  const messageContent = isUser ? (
    <p className="text-sm leading-relaxed text-chat-user-foreground">
      {message}
    </p>
  ) : (
    <SimpleMarkdown text={message} />
  );

  return (
    <div
      className={`flex items-start gap-3 mb-6 ${
        isUser ? "flex-row-reverse" : "flex-row"
      } ${isUser ? "animate-fade-in-right" : "animate-fade-in-left"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-romance-primary to-romance-secondary"
            : "bg-gradient-to-br from-slate-300 to-slate-400 border border-slate-200"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-black" />
        ) : (
          <Bot className="w-4 h-4 text-black" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[75%] md:max-w-sm px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
          isUser
            ? "bg-gradient-romance text-black rounded-tr-md"
            : "bg-white border border-slate-100 text-black rounded-tl-md"
        }`}
        style={{ wordBreak: "break-word" }}
      >
        {messageContent}
      </div>
    </div>
  );
};

const LoadingBubble = () => (
  <div className="flex items-start gap-3 mb-6 animate-fade-in-left">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center shadow-sm">
      <Bot className="w-4 h-4 text-slate-600" />
    </div>
    <div className="max-w-[75%] md:max-w-sm px-4 py-3 rounded-2xl rounded-tl-md shadow-sm bg-white border border-slate-100">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse-dot"></div>
        <div
          className="w-2 h-2 rounded-full bg-slate-400 animate-pulse-dot"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-slate-400 animate-pulse-dot"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  </div>
);

export default function ChatBotWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm your AI Dating Advisor. I'm here to help you navigate the world of love and relationships. What would you like to talk about? 💕",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    // Focus input when modal opens
    inputRef.current?.focus();
    // Trap focus inside modal
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [onClose]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;
    const newUserMessage = { text: input, isUser: true };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    try {
      const aiResponse = await getAIAssistantResponse(input, newMessages);
      setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having a little trouble thinking right now. Please try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAIAssistantResponse = async (
    userInput: string,
    chatHistory: { text: string; isUser: boolean }[]
  ) => {
    const lastUserMessage =
      chatHistory.filter((m) => m.isUser).slice(-2)[0]?.text || "";
    const keywordsForDetail = [
      "more",
      "detail",
      "elaborate",
      "explain",
      "yes",
      "yup",
      "sure",
    ];
    const isRequestingDetail = keywordsForDetail.some((keyword) =>
      userInput.toLowerCase().includes(keyword)
    );
    let prompt;
    if (isRequestingDetail) {
      prompt = `
        You are a friendly, wise, and empathetic dating and relationship advisor.
        The user wants a more detailed explanation about their previous question: "${lastUserMessage}".
        Please provide a comprehensive, thoughtful, and encouraging response.
        Format your answer for readability using Markdown:
        - Use **bold text** to highlight key ideas or terms.
        - Use unordered lists (starting with a hyphen, like '- ') for advice, steps, or key points.
      `;
    } else {
      prompt = `
        You are a friendly, wise, and empathetic dating and relationship advisor.
        A user is asking for help. Here is their question: "${userInput}".
        Your task is to provide a concise, easy-to-understand initial answer (2-3 sentences maximum).
        After your short answer, you MUST ask if they would like a more detailed explanation. For example: "Would you like a more detailed explanation?" or "Let me know if you'd like me to elaborate on that."
        Do not use any special formatting for this initial short response.
      `;
    }
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      const result = await response.json();
      if (result.reply) {
        return result.reply;
      } else {
        return "I'm not sure how to respond to that. Could you try rephrasing?";
      }
    } catch (error) {
      console.error("Error in getAIAssistantResponse:", error);
      return "I'm having trouble connecting to my wisdom. Please check your connection and try again.";
    }
  };

  // --- Render ---
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-md h-[90vh] md:h-[600px] md:max-h-[80vh] bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-3xl shadow-2xl border border-pink-200 overflow-hidden flex flex-col animate-fade-in-up relative">
        {/* Header */}
        <header className="bg-gradient-to-r from-pink-50 to-white border-b border-pink-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-romance flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-slate-800 text-lg">
                Mingle AI Assistant
              </h1>
              <p className="text-xs text-slate-500">
                AI-powered dating and relationship guidance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-300 hover:bg-slate-400 text-slate-600 hover:text-slate-600 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-romance-primary/20"
            aria-label="Close chatbot"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Chat Area */}
        <main className="flex-1 min-h-0 overflow-y-auto px-6 py-4 bg-gradient-to-b from-white/60 to-pink-50/60 custom-scrollbar">
          <div className="flex flex-col justify-end min-h-full">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.text}
                  isUser={msg.isUser}
                />
              ))}
              {isLoading && <LoadingBubble />}
              <div ref={chatEndRef} />
            </div>
          </div>
        </main>

        {/* Input Form */}
        <footer className="bg-white/80 border-t border-pink-100 p-4">
          <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-3 border border-slate-200">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about dating..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-500 text-sm outline-none font-sans"
              disabled={isLoading}
              aria-label="Type your message"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || input.trim() === ""}
              className="bg-gradient-romance hover:shadow-romance disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-romance-primary/30 flex items-center justify-center min-w-[36px] transform hover:scale-105 active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

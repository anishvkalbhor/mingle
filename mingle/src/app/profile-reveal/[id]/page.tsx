"use client";
import { useEffect, useState, useRef, JSX } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import io from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Send,
  Smile,
} from "lucide-react";
import {
  FaLinkedinIn,
  FaSpotify,
  FaInstagram,
} from "react-icons/fa6";
import { MdPhotoCamera } from "react-icons/md";
import { FaVideo } from "react-icons/fa";

const SimpleEmojiPicker = ({
  onEmojiSelect,
}: {
  onEmojiSelect: (emoji: string) => void;
}) => {
  const commonEmojis = [
    "😊",
    "❤️",
    "👍",
    "😄",
    "🎉",
    "🔥",
    "💯",
    "😍",
    "🤗",
    "👋",
    "💪",
    "✨",
    "🌟",
    "💖",
    "😎",
    "🤩",
  ];

  return (
    <div className="bg-white border rounded-lg p-2 shadow-lg absolute bottom-12 left-0 z-50">
      <div className="grid grid-cols-8 gap-1">
        {commonEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onEmojiSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

function ChatRoom({
  roomId,
  userId,
  otherUser,
  expiresAt,
}: {
  roomId: string;
  userId: string;
  otherUser: any;
  expiresAt: string;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [locked, setLocked] = useState(false);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { getToken } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const exp = new Date(expiresAt);
      const diff = exp.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Locked");
        setLocked(true);
        setShowUpgradeModal(true);
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${days}d ${hours}h ${mins}m left`);
      }
    }, 1000 * 30);
    return () => clearInterval(interval);
  }, [expiresAt]);

  useEffect(() => {
    async function fetchMessages() {
      const token = await getToken();
      const res = await fetch(
        `http://localhost:5000/api/chat/messages/${roomId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMessages(data.messages || []);
    }
    fetchMessages();
  }, [roomId, getToken]);

  useEffect(() => {
    let socket: any;
    async function connectSocket() {
      const token = await getToken();
      socket = io("http://localhost:5000", {
        auth: { token },
        transports: ["websocket", "polling"],
      });
      socketRef.current = socket;
      socket.emit("joinRoom", { roomId, userId });
      socket.on("joinedRoom", () => {});
      const handleNewMessage = (msg: any) => {
        setMessages((prev) => [...prev, msg]);
      };
      socket.on("newMessage", handleNewMessage);
      socket.on("roomLocked", () => {
        setLocked(true);
        setShowUpgradeModal(true);
      });
      socket.on("error", (msg: any) => alert(msg));
      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.disconnect();
      };
    }
    let cleanup: (() => void) | undefined;
    connectSocket().then((fn) => {
      cleanup = fn;
    });
    return () => {
      if (cleanup) cleanup();
    };
  }, [roomId, userId, getToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || locked) return;
    socketRef.current.emit("sendMessage", { roomId, userId, content: input });
    setInput("");
  };

  const addEmoji = (emoji: string) => {
    setInput(input + emoji);
    setShowEmoji(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogTitle>Chat Session Expired</DialogTitle>
          <DialogDescription>
            <div className="py-2">
              <p className="mb-2">Your 4-day chat session has expired.</p>
              <p className="mb-4">
                Upgrade to{" "}
                <span className="font-semibold text-pink-500">Premium</span> to
                continue chatting and unlock more features!
              </p>
              <button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                onClick={() => router.push("/comperision")}
              >
                Subscribe Now
              </button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={
                otherUser.profilePhotos && otherUser.profilePhotos.length > 0
                  ? otherUser.profilePhotos[0]
                  : otherUser.profilePhoto || "/default-avatar.png"
              }
              alt={otherUser.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {otherUser.username}
              {otherUser.age ? `, ${otherUser.age}` : ""}
            </div>
            <div className="text-sm text-gray-500">
              {locked ? "Chat Locked" : timeLeft}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {locked && (
        <div className="w-full text-center text-red-500 font-semibold py-3 bg-red-50 border-b border-red-200 flex flex-col items-center gap-2">
          <span>Your chat session has expired.</span>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            onClick={() => router.push("/comperision")}
          >
            Subscribe Now
          </button>
        </div>
      )}

      <div
        className="flex-1 px-6 py-4 overflow-y-auto bg-gray-50"
        style={{ minHeight: 300 }}
      >
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-8">
            No messages yet. Start the conversation!
          </div>
        )}
        {(() => {
          let lastDate: string | null = null;
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);
          function formatDateSeparator(dateStr: string) {
            const date = new Date(dateStr);
            if (
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            )
              return "Today";
            if (
              date.getDate() === yesterday.getDate() &&
              date.getMonth() === yesterday.getMonth() &&
              date.getFullYear() === yesterday.getFullYear()
            )
              return "Yesterday";
            return date.toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          }
          return messages.map((msg, idx) => {
            const msgDate = msg.timestamp ? new Date(msg.timestamp) : null;
            const dateStr = msgDate ? msgDate.toDateString() : null;
            let showDate = false;
            if (dateStr !== lastDate) {
              showDate = true;
              lastDate = dateStr;
            }
            const time = msg.timestamp
              ? new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";
            return (
              <div key={idx}>
                {showDate && dateStr && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white text-gray-600 text-xs px-4 py-1 rounded-full shadow-sm border">
                      {formatDateSeparator(msg.timestamp)}
                    </span>
                  </div>
                )}
                <div
                  className={`mb-3 flex ${
                    msg.senderId === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="relative max-w-xs lg:max-w-md">
                    <div
                      className={`px-4 py-3 rounded-2xl break-words flex flex-col shadow-sm ${
                        msg.senderId === userId
                          ? "bg-pink-100 text-gray-800 rounded-br-md border border-pink-200"
                          : "bg-white text-gray-800 rounded-bl-md border"
                      }`}
                      style={{ minWidth: 60 }}
                    >
                      <span className="text-sm">{msg.content}</span>
                      <span
                        className={`text-[10px] self-end mt-1 ${
                          msg.senderId === userId
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        {time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          });
        })()}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowEmoji((v) => !v)}
              type="button"
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
            {showEmoji && <SimpleEmojiPicker onEmojiSelect={addEmoji} />}
          </div>
          <input
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            disabled={locked}
            placeholder={locked ? "Chat locked" : "Type a message..."}
            maxLength={500}
          />
          <button
            className={`p-3 rounded-full transition-colors ${
              locked || !input.trim()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
            onClick={sendMessage}
            disabled={locked || !input.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileRevealPage() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewRecorded, setViewRecorded] = useState(false);
  const [chatState, setChatState] = useState<
    "none" | "pending" | "accepted" | "chat"
  >("none");
  const [chatRoom, setChatRoom] = useState<any>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestInfo, setRequestInfo] = useState<{
    status: string;
    senderId?: string;
    receiverId?: string;
  } | null>(null);
  const [blockLoading, setBlockLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (profile && user?.id) {
      setBlocked(profile.blockedUsers?.includes(user.id));
    }
  }, [profile, user]);

  const handleBlock = async () => {
    setBlockLoading(true);
    const token = await getToken();
    await fetch("http://localhost:5000/api/users/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId: id }),
    });
    setBlockLoading(false);
    setBlocked(true);
  };
  const handleUnblock = async () => {
    setBlockLoading(true);
    const token = await getToken();
    await fetch("http://localhost:5000/api/users/unblock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId: id }),
    });
    setBlockLoading(false);
    setBlocked(false);
  };
  const handleReport = async () => {
    setReportLoading(true);
    const token = await getToken();
    await fetch("http://localhost:5000/api/users/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId: id }),
    });
    setReportLoading(false);
    setShowReportDialog(false);
    alert("User reported.");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/users/${id}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
      setLoading(false);
    };
    if (id) fetchProfile();
  }, [id, getToken]);

  useEffect(() => {
    const recordView = async () => {
      try {
        if (!id || !user?.id || user.id === id || viewRecorded) return;
        const key = `viewed:${id}:${new Date().toISOString().slice(0, 10)}`;
        if (sessionStorage.getItem(key)) {
          setViewRecorded(true);
          return;
        }
        const token = await getToken();
        await fetch(`http://localhost:5000/api/users/${id}/view`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        setViewRecorded(true);
        sessionStorage.setItem(key, "1");
      } catch (e) {}
    };
    recordView();
  }, [id, user, getToken, viewRecorded]);

  useEffect(() => {
    const checkChat = async () => {
      if (!user?.id || !id || user.id === id) return;
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/chat/room/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChatRoom(data.chatRoom);
        setChatState(data.expired ? "accepted" : "chat");
        setRequestInfo(null);
        return;
      }
      const reqRes = await fetch(
        `http://localhost:5000/api/chat/request-status/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequestInfo(reqData);
        if (reqData.status === "none") setChatState("none");
        else if (reqData.status === "pending") setChatState("pending");
        else if (reqData.status === "accepted") setChatState("chat");
      }
    };
    if (user?.id && id) checkChat();
  }, [user, id, getToken]);

  const handleSendRequest = async () => {
    setRequestLoading(true);
    const token = await getToken();
    const res = await fetch(`http://localhost:5000/api/chat/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId: id }),
    });
    setRequestLoading(false);
    if (res.ok) {
      setChatState("pending");
    } else {
      alert("Failed to send chat request");
    }
  };

  const handleAcceptRequest = async () => {
    setRequestLoading(true);
    const token = await getToken();
    const res = await fetch(`http://localhost:5000/api/chat/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ senderId: id }),
    });
    setRequestLoading(false);
    if (res.ok) {
      const data = await res.json();
      setChatRoom(data.chatRoom);
      setChatState("chat");
    } else {
      alert("Failed to accept chat request");
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const socialIcons: Record<string, JSX.Element> = {
    linkedin: <FaLinkedinIn className="w-5 h-5 text-blue-700" />,
    instagram: <FaInstagram className="w-5 h-5 text-pink-500" />,
    spotify: <FaSpotify className="w-5 h-5 text-green-500" />,
    photo: <MdPhotoCamera className="w-5 h-5 text-purple-600" />,
    video: <FaVideo className="w-5 h-5 text-red-600" />,
  };

  if (chatRoom && user?.id && !blocked) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Chat with {profile.username}
            </h1>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6">
              <div className="w-full h-64 rounded-2xl overflow-hidden mb-6">
                <img
                  src={
                    profile.profilePhotos && profile.profilePhotos.length > 0
                      ? profile.profilePhotos[0]
                      : profile.profilePhoto || "/default-avatar.png"
                  }
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center mb-6">
                <div className="font-bold text-2xl text-gray-900 mb-1">
                  {profile.username}
                  {profile.age ? `, ${profile.age}` : ""}
                </div>
                <div className="text-pink-500 font-semibold text-lg mb-2">
                  {profile.compatibilityScore}% Match
                </div>
                <div className="text-gray-700 text-base mb-4">
                  {profile.bio || "No bio yet."}
                </div>
              </div>

              {profile.interests && profile.interests.length > 0 && (
                <div className="mb-6">
                  <div className="font-semibold text-gray-800 mb-3">
                    Interests
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.mutual &&
                profile.socialLinks &&
                Object.keys(profile.socialLinks).length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold text-gray-800 mb-3">
                      Social Links
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(profile.socialLinks).map(
                        ([platform, url]) => {
                          if (!url || url === "") return null;
                          const icon = socialIcons[platform.toLowerCase()];

                          return (
                            <a
                              key={platform}
                              href={
                                String(url).startsWith("http")
                                  ? String(url)
                                  : `https://${url}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105"
                              title={`${
                                platform.charAt(0).toUpperCase() +
                                platform.slice(1)
                              }`}
                            >
                              {icon || (
                                <span className="text-xs text-gray-600 font-medium">
                                  {platform.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </a>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              {profile.mutual && !blocked && (
                <div className="flex flex-col gap-3 mb-6">
                  <button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                    onClick={() =>
                      router.push(
                        `/generate-date?partner=${profile.username}&partnerId=${id}`
                      )
                    }
                  >
                    🎯 Generate AI Date
                  </button>
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                    onClick={() =>
                      router.push(
                        `/schedule-date?partner=${profile.username}&partnerId=${id}`
                      )
                    }
                  >
                    📅 Schedule Date
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {!blocked ? (
                  <>
                    <button
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition-colors"
                      onClick={handleBlock}
                      disabled={blockLoading}
                    >
                      {blockLoading ? "Blocking..." : "Block"}
                    </button>
                    <button
                      className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-lg font-semibold transition-colors"
                      onClick={() => setShowReportDialog(true)}
                      disabled={reportLoading}
                    >
                      Report
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-lg font-semibold transition-colors"
                    onClick={handleUnblock}
                    disabled={blockLoading}
                  >
                    {blockLoading ? "Unblocking..." : "Unblock"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <ChatRoom
            roomId={chatRoom.roomId}
            userId={user.id}
            otherUser={profile}
            expiresAt={chatRoom.expiresAt}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <Card className="max-w-md w-full mx-auto rounded-3xl shadow-2xl border-0 p-0">
        <CardContent className="p-0 flex flex-col items-center">
          <div className="w-full h-64 rounded-t-3xl overflow-hidden flex items-center justify-center">
            <img
              src={
                profile.profilePhotos && profile.profilePhotos.length > 0
                  ? profile.profilePhotos[0]
                  : profile.profilePhoto || "/default-avatar.png"
              }
              alt={profile.username}
              className={`w-full h-full object-cover ${
                profile.mutual ? "" : "blur-md grayscale"
              }`}
            />
          </div>
          <div className="w-full text-center py-6">
            <div className="font-bold text-2xl text-gray-900 mb-1">
              {profile.username}
              {profile.age ? `, ${profile.age}` : ""}
            </div>
            <div className="text-pink-500 font-semibold text-base mb-2">
              {profile.compatibilityScore}% Match
            </div>
            <div className="text-gray-700 text-base mb-2">
              {profile.bio || "No bio yet."}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {profile.interests &&
                profile.interests.length > 0 &&
                profile.interests.map((interest: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
            </div>
            {profile.mutual &&
              profile.socialLinks &&
              Object.keys(profile.socialLinks).length > 0 && (
                <div className="mb-4">
                  <div className="font-semibold text-gray-800 mb-3 text-center">
                    Connect on Social
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {Object.entries(profile.socialLinks).map(
                      ([platform, url]) => {
                        if (!url || url === "") return null;
                        const icon = socialIcons[platform.toLowerCase()];

                        return (
                          <a
                            key={platform}
                            href={
                              String(url).startsWith("http")
                                ? String(url)
                                : `https://${url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105"
                            title={`${
                              platform.charAt(0).toUpperCase() +
                              platform.slice(1)
                            }`}
                          >
                            {icon || (
                              <span className="text-sm text-gray-600 font-medium">
                                {platform.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </a>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            {profile.mutual && !blocked && (
              <div className="flex flex-col gap-3 mb-6 px-6">
                <button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                  onClick={() =>
                    router.push(
                      `/generate-date?partner=${profile.username}&partnerId=${id}`
                    )
                  }
                >
                  🎯 Generate AI Date
                </button>
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                  onClick={() =>
                    router.push(
                      `/schedule-date?partner=${profile.username}&partnerId=${id}`
                    )
                  }
                >
                  📅 Schedule Date
                </button>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {!blocked ? (
                <>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold"
                    onClick={handleBlock}
                    disabled={blockLoading}
                  >
                    {blockLoading ? "Blocking..." : "Block"}
                  </button>
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-semibold"
                    onClick={() => setShowReportDialog(true)}
                    disabled={reportLoading}
                  >
                    Report
                  </button>
                </>
              ) : (
                <button
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-semibold"
                  onClick={handleUnblock}
                  disabled={blockLoading}
                >
                  {blockLoading ? "Unblocking..." : "Unblock"}
                </button>
              )}
            </div>
            {showReportDialog && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                  <div className="font-bold text-lg mb-2">Report User</div>
                  <div className="mb-4">
                    Are you sure you want to report this user?
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                      onClick={() => setShowReportDialog(false)}
                      disabled={reportLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
                      onClick={handleReport}
                      disabled={reportLoading}
                    >
                      {reportLoading ? "Reporting..." : "Report"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!blocked && (
              <>
                {chatState === "none" && profile.mutual && (
                  <button
                    className="w-full py-3 rounded-lg font-semibold text-white text-lg transition-colors bg-pink-500 hover:bg-pink-600"
                    onClick={handleSendRequest}
                    disabled={requestLoading}
                  >
                    {requestLoading ? "Sending..." : "Send Chat Request"}
                  </button>
                )}
                {chatState === "pending" &&
                  requestInfo &&
                  requestInfo.status === "pending" &&
                  requestInfo.senderId === user?.id && (
                    <div className="w-full py-3 rounded-lg font-semibold text-pink-500 text-lg bg-pink-100">
                      Chat Request Pending
                    </div>
                  )}
                {chatState === "pending" &&
                  requestInfo &&
                  requestInfo.status === "pending" &&
                  requestInfo.receiverId === user?.id && (
                    <button
                      className="w-full py-3 rounded-lg font-semibold text-white text-lg transition-colors bg-pink-500 hover:bg-pink-600"
                      onClick={handleAcceptRequest}
                      disabled={requestLoading}
                    >
                      {requestLoading ? "Accepting..." : "Accept Chat Request"}
                    </button>
                  )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

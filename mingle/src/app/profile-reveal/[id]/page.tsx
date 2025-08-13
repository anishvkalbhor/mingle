"use client"
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import io from "socket.io-client";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function ChatRoom({ roomId, userId, otherUser, expiresAt }: { roomId: string, userId: string, otherUser: any, expiresAt: string }) {
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

  // Calculate time left
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

  // Fetch messages
  useEffect(() => {
    async function fetchMessages() {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/chat/messages/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data.messages || []);
    }
    fetchMessages();
  }, [roomId, getToken]);

  // Socket.io setup
  useEffect(() => {
    let socket: any;
    async function connectSocket() {
      const token = await getToken();
      socket = io("http://localhost:5000", {
        auth: { token },
        transports: ["websocket", "polling"]
      });
      socketRef.current = socket;
      socket.emit("joinRoom", { roomId, userId });
      socket.on("joinedRoom", () => {});
      // Use a named handler so we can remove it
      const handleNewMessage = (msg: any) => {
        setMessages((prev) => [...prev, msg]);
      };
      socket.on("newMessage", handleNewMessage);
      socket.on("roomLocked", () => {
        setLocked(true);
        setShowUpgradeModal(true);
      });
      socket.on("error", (msg: any) => alert(msg));
      // Cleanup: remove only this handler
      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.disconnect();
      };
    }
    let cleanup: (() => void) | undefined;
    connectSocket().then(fn => { cleanup = fn; });
    return () => { if (cleanup) cleanup(); };
  }, [roomId, userId, getToken]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || locked) return;
    socketRef.current.emit("sendMessage", { roomId, userId, content: input });
    setInput("");
  };

  const addEmoji = (emoji: any) => {
    setInput(input + (emoji.native || emoji.shortcodes || ''));
    setShowEmoji(false);
  };

  return (
    <div className="w-full flex flex-col items-center mt-6">
      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogTitle>Chat Session Expired</DialogTitle>
          <DialogDescription>
            <div className="py-2">
              <p className="mb-2">Your 4-day chat session has expired.</p>
              <p className="mb-4">Upgrade to <span className="font-semibold text-pink-500">Premium</span> to continue chatting and unlock more features!</p>
              <button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                onClick={() => router.push('/comperision')}
              >
                Subscribe Now
              </button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      {/* Chat UI */}
      <div className="w-full max-w-lg mx-auto rounded-2xl shadow-lg bg-white">
        {/* Chat Header */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 rounded-t-2xl bg-white">
          <div className="font-bold text-lg text-gray-800">Chat</div>
          <div className="text-pink-500 text-xs font-semibold">{locked ? "Locked" : `Time left: ${timeLeft}`}</div>
        </div>
        {/* Show session expired message if locked */}
        {locked && (
          <div className="w-full text-center text-red-500 font-semibold py-2 bg-red-50 border-b border-red-200 flex flex-col items-center gap-2">
            <span>Your chat session has expired.</span>
            <button
              className="mt-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              onClick={() => router.push('/comperision')}
            >
              Subscribe Now
            </button>
          </div>
        )}
        {/* Chat Messages */}
        <div className="px-6 py-4 h-64 overflow-y-auto bg-pink-50" style={{ minHeight: 180, maxHeight: 260 }}>
          {messages.length === 0 && (
            <div className="text-gray-400 text-center mt-8">No messages yet.</div>
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
              ) return "Today";
              if (
                date.getDate() === yesterday.getDate() &&
                date.getMonth() === yesterday.getMonth() &&
                date.getFullYear() === yesterday.getFullYear()
              ) return "Yesterday";
              return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
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
                ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';
              return (
                <div key={idx}>
                  {showDate && dateStr && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-200 text-gray-600 text-xs px-4 py-1 rounded-full shadow-sm">
                        {formatDateSeparator(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <div className={`mb-2 flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                    <div className="relative max-w-xs">
                      <div className={`px-4 py-2 rounded-2xl break-words flex flex-col ${msg.senderId === userId ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-800'}`}
                           style={{ minWidth: 60 }}>
                        <span>{msg.content}</span>
                        <span
                          className="text-[11px] self-end"
                          style={{ color: '#888', lineHeight: 1, marginLeft: 6 }}
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
        {/* Chat Input */}
        <div className="px-6 py-3 border-t border-gray-200 bg-white rounded-b-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              className="text-2xl focus:outline-none"
              onClick={() => setShowEmoji((v) => !v)}
              tabIndex={-1}
              type="button"
            >
              😊
            </button>
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-base focus:outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
              disabled={locked}
              placeholder={locked ? "Chat locked" : "Type a message..."}
              maxLength={500}
            />
            <button
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold"
              onClick={sendMessage}
              disabled={locked || !input.trim()}
            >Send</button>
          </div>
          {showEmoji && (
            <div className="absolute z-50 mt-2">
              <Picker data={data} onEmojiSelect={addEmoji} theme="light" previewPosition="none" />
            </div>
          )}
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
  const [chatState, setChatState] = useState<'none' | 'pending' | 'accepted' | 'chat'>("none");
  const [chatRoom, setChatRoom] = useState<any>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestInfo, setRequestInfo] = useState<{status: string, senderId?: string, receiverId?: string} | null>(null);
  const [blockLoading, setBlockLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [blocked, setBlocked] = useState(false);

  // Check if blocked (after profile is loaded)
  useEffect(() => {
    if (profile && user?.id) {
      setBlocked(profile.blockedUsers?.includes(user.id));
    }
  }, [profile, user]);

  // Block user
  const handleBlock = async () => {
    setBlockLoading(true);
    const token = await getToken();
    await fetch("http://localhost:5000/api/users/block", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ targetUserId: id }),
    });
    setBlockLoading(false);
    setBlocked(true);
  };
  // Unblock user
  const handleUnblock = async () => {
    setBlockLoading(true);
    const token = await getToken();
    await fetch("http://localhost:5000/api/users/unblock", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ targetUserId: id }),
    });
    setBlockLoading(false);
    setBlocked(false);
  };
  // Report user
  const handleReport = async () => {
    setReportLoading(true);
    const token = await getToken();
    await fetch("http://localhost:5000/api/users/report", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ targetUserId: id }),
    });
    setReportLoading(false);
    setShowReportDialog(false);
    alert("User reported.");
  };

  // Fetch profile and chat state
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

  // Check chat state using new endpoint
  useEffect(() => {
    const checkChat = async () => {
      if (!user?.id || !id || user.id === id) return;
      const token = await getToken();
      // Check for accepted chat room
      const res = await fetch(`http://localhost:5000/api/chat/room/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChatRoom(data.chatRoom);
        setChatState(data.expired ? 'accepted' : 'chat');
        setRequestInfo(null);
        return;
      }
      // Check for chat request status
      const reqRes = await fetch(`http://localhost:5000/api/chat/request-status/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequestInfo(reqData);
        if (reqData.status === 'none') setChatState('none');
        else if (reqData.status === 'pending') setChatState('pending');
        else if (reqData.status === 'accepted') setChatState('chat');
      }
    };
    if (user?.id && id) checkChat();
  }, [user, id, getToken]);

  // Send chat request
  const handleSendRequest = async () => {
    setRequestLoading(true);
    const token = await getToken();
    const res = await fetch(`http://localhost:5000/api/chat/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ receiverId: id }),
    });
    setRequestLoading(false);
    if (res.ok) {
      setChatState('pending');
    } else {
      alert('Failed to send chat request');
    }
  };

  // Accept chat request (if you are the receiver)
  const handleAcceptRequest = async () => {
    setRequestLoading(true);
    const token = await getToken();
    const res = await fetch(`http://localhost:5000/api/chat/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ senderId: id }),
    });
    setRequestLoading(false);
    if (res.ok) {
      const data = await res.json();
      setChatRoom(data.chatRoom);
      setChatState('chat');
    } else {
      alert('Failed to accept chat request');
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <Card className="max-w-md w-full mx-auto rounded-3xl shadow-2xl border-0 p-0">
        <CardContent className="p-0 flex flex-col items-center">
          <div className="w-full h-64 rounded-t-3xl overflow-hidden flex items-center justify-center">
            <img
              src={(profile.profilePhotos && profile.profilePhotos.length > 0) ? profile.profilePhotos[0] : (profile.profilePhoto || "/default-avatar.png")}
              alt={profile.username}
              className={`w-full h-full object-cover ${profile.mutual ? "" : "blur-md grayscale"}`}
            />
          </div>
          <div className="w-full text-center py-6">
            <div className="font-bold text-2xl text-gray-900 mb-1">{profile.username}{profile.age ? `, ${profile.age}` : ""}</div>
            <div className="text-pink-500 font-semibold text-base mb-2">{profile.compatibilityScore}% Match</div>
            <div className="text-gray-700 text-base mb-2">{profile.bio || "No bio yet."}</div>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {profile.interests && profile.interests.length > 0 && profile.interests.map((interest: string, idx: number) => (
                <span key={idx} className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">{interest}</span>
              ))}
            </div>
            {profile.mutual && profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
              <div className="mb-4">
                <div className="font-semibold text-gray-800 mb-1">Social Links:</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {Object.entries(profile.socialLinks).map(([key, value], idx) => (
                    value ? <a key={key} href={String(value)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">{key}</a> : null
                  ))}
                </div>
              </div>
            )}
            {/* Block/Unblock/Report buttons */}
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
            {/* Report confirmation dialog */}
            {showReportDialog && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                  <div className="font-bold text-lg mb-2">Report User</div>
                  <div className="mb-4">Are you sure you want to report this user?</div>
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
            {/* Chat logic (hide if blocked) */}
            {!blocked && (
              <>
                {chatState === 'none' && profile.mutual && (
                  <button
                    className="w-full py-3 rounded-lg font-semibold text-white text-lg transition-colors bg-pink-500 hover:bg-pink-600"
                    onClick={handleSendRequest}
                    disabled={requestLoading}
                  >
                    {requestLoading ? 'Sending...' : 'Send Chat Request'}
                  </button>
                )}
                {chatState === 'pending' && requestInfo && requestInfo.status === 'pending' && requestInfo.senderId === user?.id && (
                  <div className="w-full py-3 rounded-lg font-semibold text-pink-500 text-lg bg-pink-100">Chat Request Pending</div>
                )}
                {chatState === 'pending' && requestInfo && requestInfo.status === 'pending' && requestInfo.receiverId === user?.id && (
                  <button
                    className="w-full py-3 rounded-lg font-semibold text-white text-lg transition-colors bg-pink-500 hover:bg-pink-600"
                    onClick={handleAcceptRequest}
                    disabled={requestLoading}
                  >
                    {requestLoading ? 'Accepting...' : 'Accept Chat Request'}
                  </button>
                )}
                {chatRoom && user?.id && (
                  <ChatRoom roomId={chatRoom.roomId} userId={user.id} otherUser={profile} expiresAt={chatRoom.expiresAt} />
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
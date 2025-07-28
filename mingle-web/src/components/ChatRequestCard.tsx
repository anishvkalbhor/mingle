"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";     

export default function ChatRequestCard() {
  const [requestSent, setRequestSent] = useState(false);
  const [requestAccepted, setRequestAccepted] = useState(false);

  const sendRequest = () => {
    setRequestSent(true);
    setTimeout(() => setRequestAccepted(true), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 min-h-[60vh]">
      {!requestSent ? (
        <button
          onClick={sendRequest}
          className="bg-pink-500 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-pink-600 transition-all"
        >
          Send Chat Request
        </button>
      ) : !requestAccepted ? (
        <p className="text-gray-500 text-center text-lg animate-pulse">
          Waiting for acceptance...
        </p>
      ) : (
        <ChatWindow />
      )}
    </div>
  );
}

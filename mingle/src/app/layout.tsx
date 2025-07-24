"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Pacifico } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import ChatBotIcon from "@/components/ChatBotIcon";
import ChatBotWindow from "@/components/ChatBotWindow";
import { useState } from "react";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
})


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [chatsOpen, setChatsOpen] = useState(false);
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
        >
          {children}
          {/* Chatbot Icon */}
          {!chatsOpen && (
            <ChatBotIcon onClick={() => setChatsOpen(true)} />
          )}
          {/* Chatbot Window */}
          {chatsOpen && (
            <ChatBotWindow onClose={() => setChatsOpen(false)} />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}

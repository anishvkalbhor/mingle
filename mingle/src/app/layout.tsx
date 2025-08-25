"use client";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Pacifico } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ChatBotIcon from "@/components/ChatBotIcon";
import ChatBotWindow from "@/components/ChatBotWindow";
import { useState } from "react";
import Head from "next/head";
import { Outfit } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Urbanist } from 'next/font/google'

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-urbanist',
})

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});


const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

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
        <Head>
          <link
            href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} ${outfit.variable} ${jakarta.variable} ${urbanist.variable} antialiased`}
        >
          {children}
          {!chatsOpen && <ChatBotIcon onClick={() => setChatsOpen(true)} />}
          {chatsOpen && <ChatBotWindow onClose={() => setChatsOpen(false)} />}
        </body>
      </html>
    </ClerkProvider>
  );
}

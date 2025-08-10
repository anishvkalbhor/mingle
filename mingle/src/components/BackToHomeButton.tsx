"use client";

import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackToHomeButtonProps {
  className?: string;
}

export const BackToHomeButton = ({ className = "" }: BackToHomeButtonProps) => {
  const router = useRouter();

  return (
    <Link
      href="/"
      className={`fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-purple-600 shadow-lg transition-all duration-200 rounded-lg p-2 sm:px-3 sm:py-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Back Home</span>
    </Link>
  );
};

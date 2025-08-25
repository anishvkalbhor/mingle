"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Heart,
  Users,
  MessageCircle,
  BarChart2,
  Bell,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";

export const SIDEBAR_WIDTH = 256; // w-64
export const SIDEBAR_COLLAPSED_WIDTH = 80; // w-20

const sidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: Heart },
  { id: "matches", label: "Matches", icon: Users },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "insights", label: "Insights", icon: BarChart2 },
  { id: "notifications", label: "Notifications", icon: Bell },
];

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  unreadCount?: number;
  isMobile?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function DashboardSidebar({
  activeTab,
  onTabChange = () => {},
  unreadCount = 0,
  isMobile = false,
  isOpen = false,
  onOpenChange = () => {},
  onCollapseChange,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isMobile && onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, isMobile, onCollapseChange]);

  // ------------------ MOBILE SIDEBAR ------------------ //
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => onOpenChange(false)}
          />
        )}

        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 bg-white/20 backdrop-blur-md rounded-2xl border border-gray-300 flex flex-col transition-transform duration-300 md:hidden shadow-2xl",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-primary/10 font-sans">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-purple-500 fill-current" />
              <span className="text-2xl font-black font-['Arial',_Helvetica,_sans-serif] bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Mingle
              </span>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-2 font-sans">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-primary/10 hover:text-purple-600"
                  )}
                  onClick={() => {
                    onTabChange(link.id);
                    onOpenChange(false); // Close mobile sidebar after selection
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{link.label}</span>
                  {link.id === "notifications" && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Footer */}
          <div className="p-4 font-sans">
            <div className="bg-gradient-to-r from-primary/10 to-pink-100 rounded-lg border border-primary/20 p-3">
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                💡 Pro Tip
              </h3>
              <p className="text-xs text-gray-600">
                Complete your profile to get 3x more matches!
              </p>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // ------------------ DESKTOP SIDEBAR ------------------ //
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-30 h-full bg-white/20 backdrop-blur-md rounded-2xl border border-gray-300 flex flex-col transition-all duration-300 shadow-xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Desktop Header with Collapse Button */}
      <div className="flex items-center gap-2 p-4 border-b border-primary/10 font-sans">
        <Heart className="w-7 h-7 text-purple-500 fill-current flex-shrink-0" />
        {!collapsed && (
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Mingle
          </span>
        )}
        {/* Collapse Button - Only visible on desktop */}
        <button
          className="ml-auto p-1 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 text-gray-600 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-primary/10 hover:text-purple-600"
              )}
              onClick={() => onTabChange(link.id)}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
              {link.id === "notifications" && unreadCount > 0 && (
                <span
                  className={cn(
                    "bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center",
                    collapsed ? "absolute -top-1 -right-1" : "ml-auto"
                  )}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Desktop Footer - Pro Tip (hidden when collapsed) */}
      {!collapsed && (
        <div className="p-4">
          <Link href="/pricing" className="block">
            <div className="bg-gradient-to-r from-primary/10 to-pink-100 rounded-lg border border-primary/20 p-3 cursor-pointer hover:shadow-md transition">
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                💡 Pro Tip
              </h3>
              <p className="text-xs text-gray-600">
                Complete your profile to get 3x more matches!
              </p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}

// ------------------ MOBILE TRIGGER BUTTON ------------------ //
export function MobileSidebarTrigger({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "fixed top-2 left-4 z-50 p-3 rounded-xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 sm:hidden cursor-pointer",
        "flex items-center justify-center",
        "hover:scale-105 active:scale-95",
        className
      )}
      onClick={onClick}
      aria-label="Open sidebar menu"
    >
      <MdKeyboardArrowRight size={24} className="text-gray-800" />
    </button>
  );
}

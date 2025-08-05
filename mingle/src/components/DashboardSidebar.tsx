import { useState, useEffect } from "react";
import { Heart, Users, MessageCircle, BarChart2, Bell, ChevronLeft, X, Menu } from "lucide-react";
import { SparklesText } from "@/components/ui/sparkles-text";
import { cn } from "@/lib/utils";

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
  onTabChange: (tab: string) => void;
  unreadCount?: number;
  isMobile?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  unreadCount = 0,
  isMobile = false,
  isOpen = false,
  onOpenChange,
  onCollapseChange,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isMobile && onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, isMobile, onCollapseChange]);

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => onOpenChange?.(false)}
          />
        )}
        
        {/* Mobile sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 bg-white/95 backdrop-blur-md border-r border-primary/10 flex flex-col transition-transform duration-300 md:hidden shadow-2xl",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Heart className="w-8 h-8 text-purple-500 fill-current" />
              </div>
              <div className="relative">
                <SparklesText className="text-2xl font-extrabold font-urbanist tracking-tight text-purple-600" colors={{ first: "#9333EA", second: "#EC4899" }}>
                  Mingle
                </SparklesText>
              </div>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => onOpenChange?.(false)}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                      : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                  )}
                  onClick={() => {
                    onTabChange(link.id);
                    onOpenChange?.(false);
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                  {link.id === "notifications" && unreadCount > 0 && (
                    <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-1 font-bold min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom tip */}
          <div className="p-4">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 p-3">
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">💡 Pro Tip</h3>
              <p className="text-xs text-gray-600">Complete your profile to get 3x more matches!</p>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-30 h-full bg-white/80 backdrop-blur-md border-r border-primary/10 flex flex-col transition-all duration-300 shadow-xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-primary/10">
        <div className="relative">
          <Heart className="w-8 h-8 text-purple-500 fill-current flex-shrink-0" />
        </div>
        {!collapsed && (
          <div className="relative">
            <SparklesText className="text-2xl font-extrabold font-urbanist tracking-tight text-purple-600" colors={{ first: "#9333EA", second: "#EC4899" }}>
              Mingle
            </SparklesText>
          </div>
        )}
        <button
          className="ml-auto p-1 rounded-lg hover:bg-primary/10 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn("w-5 h-5 text-gray-600 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                  : "text-gray-700 hover:bg-primary/10 hover:text-primary",
                collapsed && "justify-center px-2"
              )}
              onClick={() => onTabChange(link.id)}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{link.label}</span>}
              {link.id === "notifications" && unreadCount > 0 && !collapsed && (
                <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-1 font-bold min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
              {collapsed && unreadCount > 0 && link.id === "notifications" && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom tip - only show when not collapsed */}
      {!collapsed && (
        <div className="p-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 p-3">
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">💡 Pro Tip</h3>
            <p className="text-xs text-gray-600">Complete your profile to get 3x more matches!</p>
          </div>
        </div>
      )}
    </aside>
  );
}

// Mobile trigger button component
export function MobileSidebarTrigger({ 
  onClick, 
  className 
}: { 
  onClick: () => void; 
  className?: string; 
}) {
  return (
    <button
      className={cn(
        "fixed top-4 left-4 z-40 p-3 rounded-lg bg-white/90 backdrop-blur-md border border-primary/20 shadow-lg md:hidden hover:bg-white transition-colors",
        className
      )}
      onClick={onClick}
    >
      <Menu className="w-5 h-5 text-gray-700" />
    </button>
  );
}
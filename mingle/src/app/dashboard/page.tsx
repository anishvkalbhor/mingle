"use client";

import {
  Heart,
  Users,
  MessageCircle,
  Edit,
  Sparkles,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useUser, UserButton, useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import AdminUsers from "../admin/users";
import FlaggedUsers from "../admin/flagged-users";

import { Match } from "@/types";
import { ProfileData } from "@/types";
import { Notification } from "@/types";

import { ProfileViewsChart } from "@/components/ProfileViewsChart";
import { LikesComparisonChart } from "@/components/dashboard/LikesComparisonChart";
import { InsightsSection } from "@/components/dashboard/InsightsSection";
import { MatchEventsList } from "@/components/MatchEventsList";
import MatchesGrid from "@/components/dashboard/MatchesGrid";
import MessageUserList from "@/components/dashboard/MessageUserList";
import {
  DashboardSidebar,
  MobileSidebarTrigger,
  SIDEBAR_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
} from "@/components/dashboard/DashboardSidebar";

const BASE_TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "matches", label: "Matches" },
  { id: "messages", label: "Messages" },
  { id: "insights", label: "Insights" },
];

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [mutualMatches, setMutualMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Match[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [likedSuggestions, setLikedSuggestions] = useState<{
    [clerkId: string]: boolean;
  }>({});

  const supportDropdownRef = useRef<HTMLDivElement>(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [likeLoading, setLikeLoading] = useState<{
    [clerkId: string]: boolean;
  }>({});
  const [passLoading, setPassLoading] = useState<{
    [clerkId: string]: boolean;
  }>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  // Check if mobile based on window size
  const [isMobile, setIsMobile] = useState(false);

  // Smooth scroll function for navbar links
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const navbarHeight = 120; // Adjust based on your navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsNavMenuOpen(false); // Close mobile menu after click
  };

  // Handle navigation clicks
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    // Check if we're on the homepage
    if (window.location.pathname === "/") {
      smoothScrollTo(sectionId);
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleResize = () => {
      checkMobile();
      if (window.innerWidth >= 768) setIsNavMenuOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        supportDropdownRef.current &&
        event.target instanceof Node &&
        !supportDropdownRef.current.contains(event.target)
      ) {
        setShowSettingsDropdown(false);
      }
    }
    if (showSettingsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettingsDropdown]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const fetchUserData = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const result = await res.json();
        if (result.status === "success" && result.data) {
          setUserData(result.data);
          setIsProfileComplete(result.data.profileComplete);
          if (result.data.isBanned) {
            router.push("/banned");
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [isLoaded, isSignedIn, user, getToken, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const fetchMutualMatches = async () => {
      setMatchesLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/matches/mutual`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.mutualMatches) setMutualMatches(data.mutualMatches);
      } catch {
        setMutualMatches([]);
      } finally {
        setMatchesLoading(false);
      }
    };
    fetchMutualMatches();
  }, [isLoaded, isSignedIn, user, getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(
          `http://localhost:5000/api/matches/suggestions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.suggestions) setSuggestions(data.suggestions);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    fetchSuggestions();
  }, [isLoaded, isSignedIn, user, getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const fetchDashboardStats = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `http://localhost:5000/api/users/${user.id}/dashboard-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await res.json();
        setDashboardStats(data);
      } catch {
        setDashboardStats(null);
      }
    };
    fetchDashboardStats();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const fetchNotifications = async () => {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/users/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(
        (data.notifications || []).filter((n: any) => !n.read).length
      );
    };
    fetchNotifications();
  }, [isLoaded, isSignedIn, user, getToken, showNotifications]);

  useEffect(() => {
    if (showNotifications && unreadCount > 0) {
      const markRead = async () => {
        const token = await getToken();
        await fetch("http://localhost:5000/api/users/notifications/read", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(0);
      };
      markRead();
    }
  }, [showNotifications, unreadCount, getToken]);

  useEffect(() => {
    setIsAdmin(!!userData?.isAdmin);
  }, [userData]);

  const handleBrowseClick = () => {
    setShowSuggestionsModal(true);
  };

  const handleTabChange = (tab: string) => {
    if (tab === "notifications") {
      setShowNotificationSidebar(true);
      setActiveTab("dashboard"); // Keep dashboard as active tab
    } else {
      setActiveTab(tab);
      setShowNotificationSidebar(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  const sidebarTabs = isAdmin
    ? [
        ...BASE_TABS,
        { id: "users", label: "All Users" },
        { id: "flagged-users", label: "Flagged Users" },
      ]
    : BASE_TABS;

  const getMainContentStyle = () => {
    if (isMobile) {
      return { marginLeft: 0 };
    }
    return {
      marginLeft: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
    };
  };

  // Calculate header positioning
  const getHeaderStyle = () => {
    if (isMobile) {
      return {
        left: 0,
        width: "100%",
      };
    }
    return {
      left: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
      width: `calc(100% - ${
        sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH
      }px)`,
    };
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_-10%_-20%,rgba(236,72,153,0.15),transparent_60%),radial-gradient(900px_500px_at_110%_10%,rgba(147,51,234,0.12),transparent_60%)]" />

      {/* Mobile Sidebar Trigger */}
      {isMobile && (
        <MobileSidebarTrigger onClick={() => setSidebarOpen(true)} />
      )}

      {/* Sidebar */}
      <DashboardSidebar
        activeTab={showNotificationSidebar ? "notifications" : activeTab}
        onTabChange={handleTabChange}
        unreadCount={unreadCount}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Enhanced Header with Integrated Navbar */}
      <header
        className="fixed top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm transition-all duration-300"
        style={getHeaderStyle()}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Left Side - Brand and Navigation */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 ml-8">
              <a
                href="/#about"
                onClick={(e) => handleNavClick(e, "about")}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-pink-50 transition-colors cursor-pointer"
              >
                About us
              </a>
              <a
                href="/#our-process"
                onClick={(e) => handleNavClick(e, "our-process")}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-pink-50 transition-colors cursor-pointer"
              >
                Process
              </a>
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-pink-50 transition-colors cursor-pointer"
              >
                Contact
              </a>
              <Link
                href="/pricing"
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-pink-50 transition-colors"
              >
                Pricing
              </Link>
            </nav>

            {/* Dashboard Navigation - Medium screens */}
            <nav className="hidden md:flex lg:hidden items-center space-x-1 ml-4">
              <button
                onClick={() => handleTabChange("matches")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "matches"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                <Users className="w-4 h-4 inline mr-1.5" />
                Matches
              </button>
              <button
                onClick={() => handleTabChange("messages")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "messages"
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-1.5" />
                Messages
              </button>
            </nav>
          </div>

          {/* Right Side - Actions and User */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notifications Button - Hidden on mobile */}
            <button
              onClick={() => handleTabChange("notifications")}
              className="hidden sm:flex relative p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <Link href="/profile">
              <Button
                variant="outline"
                size="sm"
                className="border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent"
              >
                <Edit className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            </Link>

            {/* User Button */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 sm:w-10 sm:h-10",
                },
              }}
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
              className="md:hidden text-gray-600 hover:text-purple-600 transition-colors p-2"
            >
              {isNavMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isNavMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200">
            <div className="px-6 py-6">
              <div className="space-y-4 mb-6">
                <a
                  href="/#about"
                  onClick={(e) => handleNavClick(e, "about")}
                  className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center cursor-pointer"
                >
                  About us
                </a>
                <a
                  href="/#our-process"
                  onClick={(e) => handleNavClick(e, "our-process")}
                  className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center cursor-pointer"
                >
                  Process
                </a>
                <a
                  href="/#contact"
                  onClick={(e) => handleNavClick(e, "contact")}
                  className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center cursor-pointer"
                >
                  Contact
                </a>
                <Link
                  href="/pricing"
                  className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center"
                  onClick={() => setIsNavMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="border-t border-gray-300 pt-4">
                  <button
                    onClick={() => {
                      handleTabChange("matches");
                      setIsNavMenuOpen(false);
                    }}
                    className="block w-full text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center"
                  >
                    <Users className="w-5 h-5 inline mr-2" />
                    Matches
                  </button>
                  <button
                    onClick={() => {
                      handleTabChange("messages");
                      setIsNavMenuOpen(false);
                    }}
                    className="block w-full text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center"
                  >
                    <MessageCircle className="w-5 h-5 inline mr-2" />
                    Messages
                  </button>
                  <button
                    onClick={() => {
                      handleTabChange("notifications");
                      setIsNavMenuOpen(false);
                    }}
                    className="block w-full text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center relative"
                  >
                    <Bell className="w-5 h-5 inline mr-2" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1/3 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main
        className="pt-20 px-4 sm:px-8 transition-all duration-300"
        style={getMainContentStyle()}
      >
        <div className="max-w-7xl mx-auto">
          {/* Notifications Sidebar */}
          {showNotificationSidebar && (
            <div className="fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] bg-white shadow-2xl z-50 border-l border-pink-100 flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
                <span className="font-bold text-lg text-gray-800">
                  Notifications
                </span>
                <button
                  onClick={() => setShowNotificationSidebar(false)}
                  className="text-gray-400 hover:text-pink-500 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {notifications.length === 0 && (
                  <div className="text-gray-400 text-center mt-8">
                    No notifications yet.
                  </div>
                )}
                {notifications.map((notif, idx) => (
                  <div
                    key={idx}
                    className={`mb-4 p-3 rounded-lg shadow-sm ${
                      notif.read
                        ? "bg-gray-50"
                        : "bg-pink-50 border-l-4 border-pink-400"
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">
                      {notif.type === "match" && "🎉 New Match!"}
                      {notif.type === "like" && "❤️ New Like"}
                      {notif.type === "chat_request" && "💬 Chat Request"}
                      {notif.type === "chat_accept" && "✅ Chat Accepted"}
                      {notif.type === "chat_expiry" && "⏰ Chat Expired"}
                    </div>
                    <div className="text-gray-700 text-sm mb-1">
                      {notif.message}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Welcome Section - Only show on dashboard tab */}
          {activeTab === "dashboard" && (
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 text-center bg-white/70 backdrop-blur-xl ring-1 ring-pink-100 shadow-sm">
                <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-200/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-200/30 blur-3xl" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                  Welcome to Mingle,{" "}
                  {userData?.firstName || user?.firstName || "there"}! 🎉
                </h1>
                {isProfileComplete ? (
                  <div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                      Your profile is complete! Start discovering amazing
                      matches and connecting with people.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      <Button
                        className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md hover:shadow-lg text-sm sm:text-base"
                        onClick={handleBrowseClick}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Discover Matches
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent text-sm sm:text-base hover:shadow"
                        onClick={() => handleTabChange("messages")}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        View Messages
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                      You&apos;re now part of the Mingle community! Complete
                      your profile to start finding amazing matches.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      <Link href="/profile/setup">
                        <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md hover:shadow-lg text-sm sm:text-base">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Complete Profile Setup
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent text-sm sm:text-base hover:shadow"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Browse Profiles
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "dashboard" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Profile Views */}
                <Card className="group relative overflow-hidden border-none rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 bg-gradient-to-br from-violet-100 via-fuchsia-100 to-pink-100 text-gray-900 ring-1 ring-pink-100">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-blue-500" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          Profile Views
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {dashboardStats &&
                          Array.isArray(
                            (dashboardStats as any).profileViewsPerDay
                          )
                            ? (
                                dashboardStats as {
                                  profileViewsPerDay: { count: number }[];
                                }
                              ).profileViewsPerDay.reduce(
                                (a, b) => a + b.count,
                                0
                              )
                            : "--"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Likes Received */}
                <Card className="group relative overflow-hidden border-none rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 bg-gradient-to-br from-rose-100 via-pink-100 to-fuchsia-100 text-gray-900 ring-1 ring-pink-100">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-rose-500" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          Likes Received
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {dashboardStats &&
                          Array.isArray(
                            (dashboardStats as any).likesReceivedPerMonth
                          )
                            ? (
                                dashboardStats as {
                                  likesReceivedPerMonth: { count: number }[];
                                }
                              ).likesReceivedPerMonth.reduce(
                                (a, b) => a + b.count,
                                0
                              )
                            : "--"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Messages */}
                <Card className="group relative overflow-hidden border-none rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 text-gray-900 ring-1 ring-blue-100">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          Messages
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {dashboardStats &&
                          Array.isArray(
                            (dashboardStats as any).messagesPerMonth
                          )
                            ? (
                                dashboardStats as {
                                  messagesPerMonth: { count: number }[];
                                }
                              ).messagesPerMonth.reduce(
                                (a, b) => a + b.count,
                                0
                              )
                            : "--"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Matches Made */}
                <Card className="group relative overflow-hidden border-none rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 bg-gradient-to-br from-fuchsia-100 via-pink-100 to-rose-100 text-gray-900 ring-1 ring-pink-100">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/40 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-purple-500" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          Matches Made
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {dashboardStats &&
                          Array.isArray((dashboardStats as any).matchesPerMonth)
                            ? (
                                dashboardStats as {
                                  matchesPerMonth: { count: number }[];
                                }
                              ).matchesPerMonth.reduce((a, b) => a + b.count, 0)
                            : "--"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Card className="group relative overflow-hidden border-none rounded-3xl shadow-md hover:shadow-xl transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-violet-50" />
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-500/80" />
                  <div className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-pink-200/40 blur-3xl motion-safe:animate-pulse" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="w-5 h-5 text-blue-600" /> Profile Views
                      Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileViewsChart
                      data={
                        dashboardStats &&
                        Array.isArray(
                          (dashboardStats as any).profileViewsPerDay
                        )
                          ? (
                              dashboardStats as {
                                profileViewsPerDay: {
                                  date: string;
                                  count: number;
                                }[];
                              }
                            ).profileViewsPerDay
                          : []
                      }
                    />
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden border-none rounded-3xl shadow-md hover:shadow-xl transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50" />
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-500/80" />
                  <div className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl motion-safe:animate-pulse" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="w-5 h-5 text-rose-600" /> Likes Given vs
                      Received
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LikesComparisonChart
                      data={
                        dashboardStats &&
                        Array.isArray(
                          (dashboardStats as any).likesGivenPerMonth
                        ) &&
                        Array.isArray(
                          (dashboardStats as any).likesReceivedPerMonth
                        )
                          ? (
                              dashboardStats as {
                                likesGivenPerMonth: {
                                  month: string;
                                  count: number;
                                }[];
                                likesReceivedPerMonth: { count: number }[];
                              }
                            ).likesGivenPerMonth.map((d, i) => ({
                              month: d.month,
                              given: d.count,
                              received:
                                (
                                  dashboardStats as {
                                    likesReceivedPerMonth: { count: number }[];
                                  }
                                ).likesReceivedPerMonth[i]?.count || 0,
                            }))
                          : []
                      }
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Insights and Match Events */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <InsightsSection />
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-green-700">
                        <span>📅</span> Recent Match Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MatchEventsList />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {activeTab === "matches" && (
            <MatchesGrid matches={mutualMatches} loading={matchesLoading} />
          )}

          {activeTab === "messages" && (
            <MessageUserList matches={mutualMatches} loading={matchesLoading} />
          )}

          {activeTab === "insights" && <InsightsSection />}

          {isAdmin && activeTab === "users" && <AdminUsers />}

          {isAdmin && activeTab === "flagged-users" && <FlaggedUsers />}
        </div>
      </main>

      {/* Suggestions Modal */}
      {showSuggestionsModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-pink-50 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto mt-10 mb-10">
            <div className="flex justify-between items-center mb-8">
              <h2
                className="text-4xl font-bold text-center w-full text-pink-600"
                style={{ letterSpacing: "-1px" }}
              >
                Match Suggestions
              </h2>
              <button
                className="absolute top-8 right-8 text-gray-400 hover:text-pink-500 text-3xl"
                onClick={() => setShowSuggestionsModal(false)}
              >
                &times;
              </button>
            </div>
            {suggestionsLoading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : suggestions.length === 0 ? (
              <div className="text-center text-gray-400">
                No suggestions found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {suggestions.map((suggestion: any) => {
                  const liked = likedSuggestions[suggestion.clerkId];
                  const passed = likedSuggestions["pass-" + suggestion.clerkId];
                  return (
                    <div
                      key={suggestion.clerkId}
                      className="bg-white rounded-3xl shadow-xl flex flex-col items-center border border-pink-100 relative"
                      style={{
                        minHeight: 440,
                        maxWidth: 370,
                        margin: "0 auto",
                      }}
                    >
                      <div className="relative w-full h-56 rounded-t-3xl overflow-hidden flex items-center justify-center">
                        <img
                          src={
                            suggestion.profilePhotos &&
                            suggestion.profilePhotos.length > 0
                              ? suggestion.profilePhotos[0]
                              : suggestion.profilePhoto || "/default-avatar.png"
                          }
                          alt={suggestion.username}
                          className="w-full h-full object-cover filter blur-md rounded-t-3xl"
                        />
                      </div>
                      <div className="flex-1 w-full flex flex-col items-center justify-between p-7 pb-4">
                        <div className="w-full text-center">
                          <div
                            className="text-xl font-bold text-gray-900 mb-1"
                            style={{ fontSize: "1.3rem" }}
                          >
                            {suggestion.username}
                            {suggestion.age ? `, ${suggestion.age}` : ""}
                          </div>
                          <div
                            className="text-pink-500 font-semibold text-base mb-1"
                            style={{ fontSize: "1.1rem" }}
                          >
                            {suggestion.compatibilityScore}% Match
                          </div>
                          {suggestion.bio && (
                            <div className="text-gray-700 text-base mb-2">
                              {suggestion.bio}
                            </div>
                          )}
                          {suggestion.interests &&
                            suggestion.interests.length > 0 && (
                              <div className="flex flex-wrap gap-2 justify-center mt-2 mb-2">
                                {suggestion.interests
                                  .slice(0, 5)
                                  .map((interest: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-semibold"
                                    >
                                      {interest}
                                    </span>
                                  ))}
                              </div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-4 w-full justify-center">
                          {liked ? (
                            <button
                              className="flex-1 bg-pink-500 text-white font-semibold py-2 rounded-full shadow transition text-base cursor-default"
                              style={{ fontWeight: 600, fontSize: "1rem" }}
                              disabled
                            >
                              ❤ Liked
                            </button>
                          ) : (
                            <button
                              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-full shadow transition text-base"
                              style={{ fontWeight: 600, fontSize: "1rem" }}
                              disabled={
                                passed || likeLoading[suggestion.clerkId]
                              }
                              onClick={async () => {
                                setLikeLoading((prev) => ({
                                  ...prev,
                                  [suggestion.clerkId]: true,
                                }));
                                try {
                                  const token = await getToken();
                                  const res = await fetch(
                                    "http://localhost:5000/api/matches/interact",
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                      },
                                      body: JSON.stringify({
                                        toUserId: suggestion.clerkId,
                                        action: "like",
                                      }),
                                    }
                                  );
                                  if (res.ok) {
                                    setLikedSuggestions((prev) => ({
                                      ...prev,
                                      [suggestion.clerkId]: true,
                                    }));
                                  }
                                } finally {
                                  setLikeLoading((prev) => ({
                                    ...prev,
                                    [suggestion.clerkId]: false,
                                  }));
                                }
                              }}
                            >
                              {likeLoading[suggestion.clerkId] ? (
                                <span className="animate-spin mr-2">⏳</span>
                              ) : (
                                "❤"
                              )}{" "}
                              Like
                            </button>
                          )}
                          <button
                            className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-full shadow transition text-base"
                            style={{ fontWeight: 600, fontSize: "1rem" }}
                            disabled={
                              liked || passed || passLoading[suggestion.clerkId]
                            }
                            onClick={async () => {
                              setPassLoading((prev) => ({
                                ...prev,
                                [suggestion.clerkId]: true,
                              }));
                              try {
                                const token = await getToken();
                                await fetch(
                                  "http://localhost:5000/api/matches/interact",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({
                                      toUserId: suggestion.clerkId,
                                      action: "pass",
                                    }),
                                  }
                                );
                                setLikedSuggestions((prev) => ({
                                  ...prev,
                                  ["pass-" + suggestion.clerkId]: true,
                                }));
                              } finally {
                                setPassLoading((prev) => ({
                                  ...prev,
                                  [suggestion.clerkId]: false,
                                }));
                              }
                            }}
                          >
                            {passLoading[suggestion.clerkId] ? (
                              <span className="animate-spin mr-2">⏳</span>
                            ) : (
                              ""
                            )}
                            Pass
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

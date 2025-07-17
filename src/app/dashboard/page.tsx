"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Heart,
  MessageCircle,
  Users,
  TrendingUp,
  Calendar,
  Settings,
  BarChart3,
  Menu,
  X,
  PawPrint,
  Moon,
  Smile,
} from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProfileViewsChart } from "@/components/dashboard/ProfileViewsChart";
import { LikesComparisonChart } from "@/components/dashboard/LikesComparisonChart";
import { ProfileCompletionChart } from "@/components/dashboard/ProfileCompletionChart";
import { MatchEventsList } from "@/components/dashboard/MatchEventsList";
import { UserProfileButton } from "@/components/dashboard/UserProfileButton";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { InsightCard } from "@/components/dashboard/InsightCard";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    profileCompletion: 0,
    profilePhoto: "",
  });

  const { isLoaded, isSignedIn, user } = useUser();

  const stats = [
    {
      title: "Profile Views",
      value: "1,234",
      trend: "+15%",
      icon: <Eye className="w-5 h-5" />,
      color: "blue" as const,
    },
    {
      title: "Likes Received",
      value: "89",
      trend: "+8%",
      icon: <Heart className="w-5 h-5" />,
      color: "rose" as const,
    },
    {
      title: "Messages",
      value: "45",
      trend: "+12%",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "green" as const,
    },
    {
      title: "Matches Made",
      value: "23",
      trend: "+5%",
      icon: <Users className="w-5 h-5" />,
      color: "purple" as const,
    },
  ];

  const calculateCompletion = (data: any): number => {
    let completed = 0;
    const total = 7;

    if (data.fullName && data.dateOfBirth && data.gender) completed++;
    if (data.showMe && data.lookingFor) completed++;
    if (data.jobTitle || data.education) completed++;
    if (data.interests?.length > 0) completed++;
    if (data.personalityPrompts?.length > 0) completed++;
    if (
      data.partnerPreferences &&
      Object.keys(data.partnerPreferences).length >= 17
    )
      completed++;
    if (data.socialLinks?.instagram || data.socialLinks?.spotify) completed++;

    return Math.round((completed / total) * 100);
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const userId = user.id;
    const completeData = localStorage.getItem(
      `user_${userId}_completeProfileData`
    );
    const setupData = localStorage.getItem(`user_${userId}_profileSetupData`);
    const basicData = localStorage.getItem(`user_${userId}_basicSignupData`);

    let parsed: any = {};
    try {
      const raw = completeData || setupData || basicData;
      if (raw) {
        parsed = JSON.parse(raw);
      }
    } catch (err) {
      console.error("Failed to parse profile data from localStorage:", err);
    }

    const fullName =
      parsed.fullName ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const profilePhoto = parsed.profilePhotos?.[0] || user.imageUrl || "";
    const completion = calculateCompletion(parsed);

    setUserData({
      firstName: parsed.firstName || user.firstName || "",
      lastName: parsed.lastName || user.lastName || "",
      fullName,
      profilePhoto,
      profileCompletion: completion,
    });
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onCloseMobile={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main content wrapper that adjusts based on sidebar size */}
      <div
        className={cn(
          "transition-all duration-300 flex-1",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            <UserProfileButton userData={userData} />
          </div>
        </header>

        {/* Main dashboard content */}
        <main className="p-4 space-y-6">
          {/* Welcome card with glassmorphism */}
          <Card className="border-0 bg-white/60 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-500/10" />
            <CardContent className="relative p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                    Welcome back, {userData.fullName}! 👋
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Your journey to find meaningful connections continues here.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Profile Completion
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-pink-100 text-pink-700"
                    >
                      {userData.profileCompletion}%
                    </Badge>
                  </div>
                  <Progress
                    value={userData.profileCompletion}
                    className="w-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Views Chart */}
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Profile Views Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileViewsChart />
              </CardContent>
            </Card>

            {/* Likes Comparison Chart */}
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-rose-600" />
                  Likes Given vs Received
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LikesComparisonChart />
              </CardContent>
            </Card>

            {/* Insights Section */}
<Card className="border-0 bg-white/80 backdrop-blur-md shadow-lg">
  <CardHeader className="pb-3">
    <CardTitle className="flex items-center gap-2 text-lg">
      <Settings className="w-5 h-5 text-purple-600" />
      AI-Powered Insights ✨
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2">
      {[
        {
          message: "You engage more with humorous profiles.",
          icon: <Smile className="w-6 h-6" />,
        },
        {
          message: "You are most compatible with introverts.",
          icon: <Users className="w-6 h-6" />,
        },
        {
          message: "Your most active time is in the evenings.",
          icon: <Moon className="w-6 h-6" />,
        },
        {
          message: "Profiles with pets catch your eye more often.",
          icon: <PawPrint className="w-6 h-6" />,
        },
      ].map((insight, index) => (
        <InsightCard
          key={index}
          message={insight.message}
          icon={insight.icon}
        />
      ))}
    </div>
  </CardContent>
</Card>


            {/* Match Events Timeline */}
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Recent Match Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MatchEventsList />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

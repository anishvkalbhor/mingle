"use client"

import { useEffect, useState } from "react"
import { useUser, UserButton, useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, MessageCircle, Settings, Edit, Sparkles, ArrowRight, CheckCircle, User, Bell } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef } from "react";
import { calculateProfileCompletion } from "@/lib/utils"
import { ProfileViewsChart } from '@/components/ProfileViewsChart';
import { LikesComparisonChart } from '@/components/LikesComparisonChart';
import { InsightsSection } from '@/components/InsightsSection';
import { MatchEventsList } from '@/components/MatchEventsList';
import AdminUsers from '../admin/users';
import FlaggedUsers from '../admin/flagged-users';

interface ProfileData {
  firstName?: string
  lastName?: string
  email?: string
  profilePhotos?: string[]
  partnerPreferences?: any
  basicInfo?: any
  lifestyle?: any
  interests?: any
  personality?: any
  questionnaire?: any
  bio?: string
  socialLinks?: any
  occupation?: string
  occupationDetails?: any
  phoneNumber?: string
  dateOfBirth?: string
  profilePhoto?: string
  state?: string
  profileComplete?: boolean
  isAdmin?: boolean;
}

function MatchesGrid({ matches, loading }: { matches: any[]; loading: boolean }) {
  if (loading) return <div className="text-center text-gray-500 py-6">Loading matches...</div>;
  if (!matches.length) return <div className="text-center text-gray-500 py-6">No matches yet.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {matches.map((match: any) => (
        <Link key={match.clerkId} href={`/profile-reveal/${match.clerkId}`} className="hover:shadow-xl transition-shadow">
          <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-105 cursor-pointer border border-pink-100" style={{ minHeight: 320 }}>
            <div className="relative mb-3 w-full h-48 rounded-t-2xl overflow-hidden flex items-center justify-center">
              <img
                src={(match.profilePhotos && match.profilePhotos.length > 0) ? match.profilePhotos[0] : (match.profilePhoto || '/default-avatar.png')}
                alt={match.fullName || match.username}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-4 bg-pink-500 text-white text-xs px-3 py-1 rounded-full shadow">
                {match.compatibilityScore}% Match
              </span>
            </div>
            <div className="text-xl font-bold text-gray-800 mb-1 text-center">{match.fullName || match.username}</div>
            {match.age && <div className="text-gray-500 text-sm mb-4">{match.age} years old</div>}
            <button className="mt-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow transition">
              View Profile
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}

function MessageUserList({ matches, loading }: { matches: any[]; loading: boolean }) {
  if (loading) return <div className="text-center text-gray-500 py-6">Loading users...</div>;
  if (!matches.length) return <div className="text-center text-gray-500 py-6">No users available for messaging.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {matches.map((match: any) => (
        <Link key={match.clerkId} href={`/profile-reveal/${match.clerkId}`} className="hover:shadow-xl transition-shadow">
          <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-105 cursor-pointer border border-blue-100" style={{ minHeight: 180 }}>
            <div className="relative mb-3 w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={(match.profilePhotos && match.profilePhotos.length > 0) ? match.profilePhotos[0] : (match.profilePhoto || '/default-avatar.png')}
                alt={match.fullName || match.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-lg font-bold text-gray-800 mb-1 text-center">{match.fullName || match.username}</div>
            {match.age && <div className="text-gray-500 text-sm mb-2">{match.age} years old</div>}
            <button className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow transition">
              Message
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}

const BASE_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'matches', label: 'Matches' },
  { id: 'messages', label: 'Messages' },
  { id: 'insights', label: 'Insights' },
];

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { getToken } = useAuth();
  const router = useRouter()
  const [showSetupPopup, setShowSetupPopup] = useState(false)
  const [userData, setUserData] = useState<ProfileData | null>(null)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [mutualMatches, setMutualMatches] = useState<any[]>([])
  const [matchesLoading, setMatchesLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [likedSuggestions, setLikedSuggestions] = useState<{ [clerkId: string]: boolean }>({});
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportIssueType, setSupportIssueType] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportFeedback, setSupportFeedback] = useState<string|null>(null);
  const supportTypes = [
    { value: "Bug", label: "🐞 Bug" },
    { value: "Feedback", label: "💬 Feedback" },
    { value: "Account", label: "🔒 Account" },
  ];
  const supportDropdownRef = useRef<HTMLDivElement>(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [likeLoading, setLikeLoading] = useState<{ [clerkId: string]: boolean }>({});
  const [passLoading, setPassLoading] = useState<{ [clerkId: string]: boolean }>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return

    const fetchUserData = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch user data')
        const result = await res.json()
        if (result.status === 'success' && result.data) {
          setUserData(result.data)
          setIsProfileComplete(result.data.profileComplete)
          if (result.data.isBanned) {
            router.push('/banned');
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [isLoaded, isSignedIn, user, getToken, router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const fetchMutualMatches = async () => {
      setMatchesLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/matches/mutual`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.mutualMatches) setMutualMatches(data.mutualMatches);
      } catch (err) {
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
        const res = await fetch(`http://localhost:5000/api/matches/suggestions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.suggestions) setSuggestions(data.suggestions);
      } catch (err) {
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
        const res = await fetch(`http://localhost:5000/api/users/${user.id}/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await res.json();
        setDashboardStats(data);
      } catch (error) {
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
      setUnreadCount((data.notifications || []).filter((n: any) => !n.read).length);
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

  const checkProfileCompletion = (data: ProfileData): boolean => {
    const completion = calculateProfileCompletion(data)
    return completion.isProfileComplete
  }

  const getProfileCompletionPercentage = (): number => {
    if (!userData) return 0
    const completion = calculateProfileCompletion(userData)
    return completion.overallPercentage
  }

  const handleCompleteSetup = () => {
    setShowSetupPopup(false)
    window.location.href = "/profile/setup"
  }

  const handleSkipForNow = () => {
    setShowSetupPopup(false)
  }

  const completionPercentage = getProfileCompletionPercentage()

  const handleBrowseClick = () => {
    setShowSuggestionsModal(true);
  };
  const handleCloseSuggestions = () => setShowSuggestionsModal(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  const sidebarTabs = isAdmin
    ? [
        ...BASE_TABS,
        { id: 'users', label: 'All Users' },
        { id: 'flagged-users', label: 'Flagged Users' },
      ]
    : BASE_TABS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 flex items-center justify-between px-4 sm:px-8 h-16">
        <div className="flex items-center gap-2">
          <button className="sm:hidden mr-2" onClick={() => setSidebarOpen(true)}>
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Heart className="w-8 h-8 text-pink-500 fill-current" />
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            <Link href="/">Mingle</Link>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button
              variant="outline"
              className="border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent text-sm sm:text-base"
            >
              <Edit className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </Link>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 sm:w-10 sm:h-10"
              }
            }}
          />
        </div>
      </header>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-white/80 backdrop-blur-md border-r border-pink-100 flex flex-col p-6 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:top-0 sm:h-full sm:z-30`}
        style={{ minHeight: '0' }}
      >
        <div className="flex items-center gap-2 mb-8">
          <Heart className="w-8 h-8 text-pink-500 fill-current" />
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Mingle</span>
        </div>
        <nav className="flex flex-col gap-2 mb-8 mt-2">
          {sidebarTabs.map(tab => (
            <button
              key={tab.id}
              className={`text-left px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${showNotificationSidebar ? '' : (activeTab === tab.id ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700')}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (showNotificationSidebar) setShowNotificationSidebar(false);
                setSidebarOpen(false);
              }}
            >
              {tab.label}
            </button>
          ))}
          <button
            className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${showNotificationSidebar ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700'}`}
            onClick={() => {
              setShowNotificationSidebar(true);
              setSidebarOpen(false);
            }}
          >
            Notifications {unreadCount > 0 && <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">{unreadCount}</span>}
          </button>
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent text-sm mb-2"
            onClick={() => setShowSettingsDropdown((v) => !v)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent text-sm mb-2"
            onClick={() => setShowSupportModal(true)}
          >
            🛠️ Support Ticket
          </Button>
        </div>
        {showSettingsDropdown && (
          <div
            ref={supportDropdownRef}
            className="absolute left-6 bottom-32 w-48 bg-white border rounded shadow z-50"
          >
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={() => setShowSettingsDropdown(false)}
            >
              Account Settings
            </button>
          </div>
        )}
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-pink-500 text-2xl"
                onClick={() => setShowSupportModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Support Ticket</h2>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  setSupportLoading(true);
                  setSupportFeedback(null);
                  try {
                    const token = await getToken();
                    const res = await fetch("http://localhost:5000/api/support-ticket", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        issueType: supportIssueType,
                        description: supportMessage,
                      }),
                    });
                    if (res.ok) {
                      setSupportFeedback("Support ticket submitted successfully!");
                      setSupportIssueType("");
                      setSupportMessage("");
                      setTimeout(() => {
                        setShowSupportModal(false);
                        setSupportFeedback(null);
                      }, 1500);
                    } else {
                      const data = await res.json();
                      setSupportFeedback(data.message || "Failed to submit ticket.");
                    }
                  } catch (err) {
                    setSupportFeedback("Failed to submit ticket. Please try again.");
                  } finally {
                    setSupportLoading(false);
                  }
                }}
              >
                <label className="block mb-2 font-medium">Issue Type</label>
                <select
                  className="w-full border rounded px-3 py-2 mb-4"
                  required
                  value={supportIssueType}
                  onChange={e => setSupportIssueType(e.target.value)}
                >
                  <option value="">Select an issue</option>
                  <option value="Bug">Bug</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Account">Account</option>
                </select>
                <label className="block mb-2 font-medium">Message</label>
                <textarea
                  className="w-full border rounded px-3 py-2 mb-4"
                  rows={4}
                  required
                  placeholder="Describe your issue..."
                  value={supportMessage}
                  onChange={e => setSupportMessage(e.target.value)}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white" disabled={supportLoading}>
                  {supportLoading ? "Submitting..." : "Submit Ticket"}
                </Button>
                {supportFeedback && (
                  <div className="mt-3 text-center text-sm font-medium text-pink-600">{supportFeedback}</div>
                )}
              </form>
            </div>
          </div>
        )}
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-4 border border-pink-100 mt-4 cursor-pointer hover:shadow-lg transition" onClick={() => router.push('/pricing')}>
          <h3 className="font-semibold text-gray-800 mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-gray-600">Complete your profile to get 3x more matches!</p>
        </div>
      </aside>

      <main className="pt-20 sm:pl-64 px-2 sm:px-8 transition-all">
        <div className="max-w-7xl mx-auto">
          {showNotificationSidebar && (
            <div className="fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] bg-white shadow-2xl z-50 border-l border-pink-100 flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
                <span className="font-bold text-lg text-gray-800">Notifications</span>
                <button onClick={() => setShowNotificationSidebar(false)} className="text-gray-400 hover:text-pink-500 text-2xl">&times;</button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {notifications.length === 0 && <div className="text-gray-400 text-center mt-8">No notifications yet.</div>}
                {notifications.map((notif, idx) => (
                  <div key={idx} className={`mb-4 p-3 rounded-lg shadow-sm ${notif.read ? 'bg-gray-50' : 'bg-pink-50 border-l-4 border-pink-400'}`}>
                    <div className="font-semibold text-gray-800 mb-1">
                      {notif.type === 'match' && '🎉 New Match!'}
                      {notif.type === 'like' && '❤️ New Like'}
                      {notif.type === 'chat_request' && '💬 Chat Request'}
                      {notif.type === 'chat_accept' && '✅ Chat Accepted'}
                      {notif.type === 'chat_expiry' && '⏰ Chat Expired'}
                    </div>
                    <div className="text-gray-700 text-sm mb-1">{notif.message}</div>
                    <div className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'dashboard' && (
            <>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 fill-current" />
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Mingle
                  </span>
                </div>
              </div>
              <div className="mb-8">
                <CardContent className="p-6 sm:p-8 text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                    Welcome to Mingle, {userData?.firstName || user?.firstName || "there"}! 🎉
                  </h1>
                  {isProfileComplete ? (
                    <div>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                        Your profile is complete! Start discovering amazing matches and connecting with people.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm sm:text-base" onClick={handleBrowseClick}>
                          <Users className="w-4 h-4 mr-2" />
                          Discover Matches
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent text-sm sm:text-base"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          View Messages
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                        You're now part of the Mingle community! Complete your profile to start finding amazing matches.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <Link href="/profile/setup">
                          <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm sm:text-base">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Complete Profile Setup
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent text-sm sm:text-base"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Browse Profiles
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            </>
          )}
          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{dashboardStats ? dashboardStats.profileViewsPerDay.reduce((a: number, b: { count: number }) => a + b.count, 0) : '--'}</div>
                        <div className="text-sm text-gray-600">Profile Views</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-rose-500" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{dashboardStats ? dashboardStats.likesReceivedPerMonth.reduce((a: number, b: { count: number }) => a + b.count, 0) : '--'}</div>
                        <div className="text-sm text-gray-600">Likes Received</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{dashboardStats ? dashboardStats.messagesPerMonth.reduce((a: number, b: { count: number }) => a + b.count, 0) : '--'}</div>
                        <div className="text-sm text-gray-600">Messages</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-purple-500" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{dashboardStats ? dashboardStats.matchesPerMonth.reduce((a: number, b: { count: number }) => a + b.count, 0) : '--'}</div>
                        <div className="text-sm text-gray-600">Matches Made</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="w-5 h-5 text-blue-600" /> Profile Views Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileViewsChart data={dashboardStats ? dashboardStats.profileViewsPerDay : []} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="w-5 h-5 text-rose-600" /> Likes Given vs Received
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LikesComparisonChart data={dashboardStats ? dashboardStats.likesGivenPerMonth.map((d: { month: string; count: number }, i: number) => ({ month: d.month, given: d.count, received: dashboardStats.likesReceivedPerMonth[i]?.count || 0 })) : []} />
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
          {activeTab === 'matches' && (
            <MatchesGrid matches={mutualMatches} loading={matchesLoading} />
          )}
          {activeTab === 'messages' && (
            <MessageUserList matches={mutualMatches} loading={matchesLoading} />
          )}
          {activeTab === 'insights' && (
            <InsightsSection />
          )}
          {isAdmin && activeTab === 'users' && <AdminUsers />}
          {isAdmin && activeTab === 'flagged-users' && <FlaggedUsers />}
        </div>
      </main>
      {/* Suggestions Modal/Section */}
      {showSuggestionsModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-pink-50 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto mt-10 mb-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-center w-full text-pink-600" style={{ letterSpacing: '-1px' }}>Match Suggestions</h2>
              <button className="absolute top-8 right-8 text-gray-400 hover:text-pink-500 text-3xl" onClick={() => setShowSuggestionsModal(false)}>&times;</button>
            </div>
            {suggestionsLoading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : suggestions.length === 0 ? (
              <div className="text-center text-gray-400">No suggestions found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {suggestions.map((suggestion: any) => {
                  const liked = likedSuggestions[suggestion.clerkId];
                  const passed = likedSuggestions["pass-" + suggestion.clerkId];
                  return (
                    <div key={suggestion.clerkId} className="bg-white rounded-3xl shadow-xl flex flex-col items-center border border-pink-100 relative" style={{ minHeight: 440, maxWidth: 370, margin: '0 auto' }}>
                      <div className="relative w-full h-56 rounded-t-3xl overflow-hidden flex items-center justify-center">
                        <img
                          src={(suggestion.profilePhotos && suggestion.profilePhotos.length > 0) ? suggestion.profilePhotos[0] : (suggestion.profilePhoto || '/default-avatar.png')}
                          alt={suggestion.username}
                          className="w-full h-full object-cover filter blur-md rounded-t-3xl"
                        />
                      </div>
                      <div className="flex-1 w-full flex flex-col items-center justify-between p-7 pb-4">
                        <div className="w-full text-center">
                          <div className="text-xl font-bold text-gray-900 mb-1" style={{ fontSize: '1.3rem' }}>{suggestion.username}{suggestion.age ? `, ${suggestion.age}` : ''}</div>
                          <div className="text-pink-500 font-semibold text-base mb-1" style={{ fontSize: '1.1rem' }}>{suggestion.compatibilityScore}% Match</div>
                          {suggestion.bio && <div className="text-gray-700 text-base mb-2">{suggestion.bio}</div>}
                          {suggestion.interests && suggestion.interests.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center mt-2 mb-2">
                              {suggestion.interests.slice(0, 5).map((interest: string, idx: number) => (
                                <span key={idx} className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-semibold">{interest}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4 w-full justify-center">
                          {liked ? (
                            <button className="flex-1 bg-pink-500 text-white font-semibold py-2 rounded-full shadow transition text-base cursor-default" style={{ fontWeight: 600, fontSize: '1rem' }} disabled>❤ Liked</button>
                          ) : (
                            <button
                              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-full shadow transition text-base"
                              style={{ fontWeight: 600, fontSize: '1rem' }}
                              disabled={passed || likeLoading[suggestion.clerkId]}
                              onClick={async () => {
                                setLikeLoading(prev => ({ ...prev, [suggestion.clerkId]: true }));
                                try {
                                  const token = await getToken();
                                  const res = await fetch('http://localhost:5000/api/matches/interact', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                    body: JSON.stringify({ toUserId: suggestion.clerkId, action: 'like' })
                                  });
                                  if (res.ok) {
                                    setLikedSuggestions(prev => ({ ...prev, [suggestion.clerkId]: true }));
                                    // Optionally show toast if mutual match
                                    // const data = await res.json();
                                    // if (data.isMutual) { /* show toast */ }
                                  }
                                } finally {
                                  setLikeLoading(prev => ({ ...prev, [suggestion.clerkId]: false }));
                                }
                              }}
                            >
                              {likeLoading[suggestion.clerkId] ? <span className="animate-spin mr-2">⏳</span> : '❤'} Like
                            </button>
                          )}
                          <button
                            className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-full shadow transition text-base"
                            style={{ fontWeight: 600, fontSize: '1rem' }}
                            disabled={liked || passed || passLoading[suggestion.clerkId]}
                            onClick={async () => {
                              setPassLoading(prev => ({ ...prev, [suggestion.clerkId]: true }));
                              try {
                                const token = await getToken();
                                await fetch('http://localhost:5000/api/matches/interact', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                  body: JSON.stringify({ toUserId: suggestion.clerkId, action: 'pass' })
                                });
                                setLikedSuggestions(prev => ({ ...prev, ["pass-" + suggestion.clerkId]: true }));
                              } finally {
                                setPassLoading(prev => ({ ...prev, [suggestion.clerkId]: false }));
                              }
                            }}
                          >
                            {passLoading[suggestion.clerkId] ? <span className="animate-spin mr-2">⏳</span> : ''}Pass
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
  )
}

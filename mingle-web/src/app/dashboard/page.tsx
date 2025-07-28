"use client";

import { useEffect, useState } from "react";
import UserStats from "@/components/UserStats";
//import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const [userStats, setUserStats] = useState({
    streak: 0,
    coins: 0,
    rank: 0,
  });

  // const { user, isLoaded } = useUser();

  // if (!isLoaded) return <p>Loading...</p>;

  // const userId = user?.id;
    const [loading, setLoading] = useState(true);

    const userId = "12345"; 

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user-stats/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        setUserStats(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [userId]);

  return (
    <div className="p-8 bg-pink-50 min-h-screen w-full">
      {loading ? (
        <p className="text-center text-pink-600">Loading stats...</p>
      ) : (
        <UserStats {...userStats} />
      )}
    </div>
  );
}

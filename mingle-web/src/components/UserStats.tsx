"use client";

import { Flame, Coins, Trophy } from "lucide-react";

type Props = {
  streak: number;
  coins: number;
  rank: number;
};

export default function UserStats({ streak, coins, rank }: Props) {
  return (
    <div className="w-full  px-4 py-10 sm:px-8 md:px-12 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl mt-10 border border-pink-200">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center text-pink-600">
        Your Progress
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Streak Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
          <div className="flex items-center justify-center w-14 h-14 bg-orange-200 rounded-full mb-4 mx-auto">
            <Flame className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-xl text-center font-bold text-orange-800">
            {streak} Day Streak
          </p>
          <p className="text-sm text-center text-orange-700 mt-2">
            Keep going and maintain your streak!
          </p>
        </div>

        {/* Coins Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
          <div className="flex items-center justify-center w-14 h-14 bg-green-200 rounded-full mb-4 mx-auto">
            <Coins className="w-8 h-8 text-green-700" />
          </div>
          <p className="text-xl text-center font-bold text-green-800">
            {coins} Coins
          </p>
          <p className="text-sm text-center text-green-700 mt-2">
            Earn coins through activities and rewards.
          </p>
        </div>

        {/* Rank Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
          <div className="flex items-center justify-center w-14 h-14 bg-blue-200 rounded-full mb-4 mx-auto">
            <Trophy className="w-8 h-8 text-blue-700" />
          </div>
          <p className="text-xl text-center font-bold text-blue-800">
            Rank #{rank}
          </p>
          <p className="text-sm text-center text-blue-700 mt-2">
            Climb the leaderboard and become #1!
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

interface MatchProps {
  id: number;
  name: string;
  age: number;
  bio: string;
  image: string;
  matchPercent: string;
  currentUserLiked: boolean;
}

export default function MatchSuggestionCard({
  id,
  name,
  age,
  bio,
  image,
  matchPercent,
  currentUserLiked,
}: MatchProps) {
  return (
    <div className="w-full sm:max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white p-4 border border-pink-100 transition-transform hover:scale-[1.01]">
      <Link href={`/profile-reveal/${id}`}>
        <div className="relative group">
          <img
            className="w-full h-56 object-cover rounded-xl blur-md group-hover:blur-0 transition duration-300"
            src={image}
            alt={`${name}'s profile`}
          />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl pointer-events-none" />
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {name}, {age}
          </h2>
          <span className="text-sm text-pink-500 font-medium">
            {matchPercent} Match
          </span>
        </div>
        <p className="text-sm text-gray-600">{bio}</p>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2">
        <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl hover:scale-105 transition-transform">
          <Heart className="w-4 h-4" />
          Like
        </button>

        <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
          Pass
        </button>
      </div>
    </div>
  );
}

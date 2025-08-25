import { Match } from "@/types";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function MatchesGrid({
  matches,
  loading,
}: {
  matches: Match[];
  loading: boolean;
}) {
  if (loading)
    return (
      <div className="text-center text-gray-500 py-6">Loading matches...</div>
    );
  if (!matches.length)
    return (
      <div className="text-center text-gray-500 py-6">No matches yet.</div>
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {matches.map((match: Match) => (
        <div
          key={match.clerkId}
          className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-pink-100 flex flex-col overflow-hidden relative group"
        >
          {/* Match Badge */}
          <span className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-10">
            {match.compatibilityScore}% Match
          </span>
          {/* User Image */}
          <Link href={`/profile-reveal/${match.clerkId}`} className="block">
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={
                  match.profilePhotos && match.profilePhotos.length > 0
                    ? match.profilePhotos[0]
                    : match.profilePhoto || "/default-avatar.png"
                }
                alt={match.fullName || match.username}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              {/* <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-2 shadow">
                <Heart className="w-5 h-5 text-pink-500" />
              </div> */}
            </div>
          </Link>
          {/* User Info */}
          <div className="p-5 flex-1 flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-1">
              {match.fullName || match.username}
            </h3>
            {match.age && (
              <div className="text-gray-500 text-sm mb-2">
                {match.age} years old
              </div>
            )}
            <Link href={`/profile-detail/${match.clerkId}`} className="w-full">
              <button className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow transition text-base">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

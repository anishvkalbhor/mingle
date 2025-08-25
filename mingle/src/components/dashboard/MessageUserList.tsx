import { Match } from "@/types";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function MessageUserList({
  matches,
  loading,
}: {
  matches: Match[];
  loading: boolean;
}) {
  if (loading)
    return (
      <div className="text-center text-gray-500 py-6">Loading users...</div>
    );
  if (!matches.length)
    return (
      <div className="text-center text-gray-500 py-6">
        No users available for messaging.
      </div>
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {matches.map((match: Match) => (
        <div
          key={match.clerkId}
          className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-blue-100 flex flex-col overflow-hidden relative group
            hover:-translate-y-2 hover:scale-[1.03] hover:border-pink-300"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(236, 72, 153, 0.10), 0 1.5px 4px 0 rgba(147, 51, 234, 0.08)",
          }}
        >
          {/* Match Badge */}
          {match.compatibilityScore && (
            <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-10">
              {match.compatibilityScore}% Match
            </span>
          )}
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
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 rounded-t-3xl"
              />
              <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-2 shadow">
                <Heart className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </Link>
          {/* User Info */}
          <div className="p-5 flex-1 flex flex-col items-center bg-gradient-to-b from-blue-50/60 to-white">
            <h3 className="text-lg font-bold text-gray-800 text-center mb-1 tracking-wide">
              {match.fullName || match.username}
            </h3>
            {match.age && (
              <div className="text-gray-500 text-sm mb-2">
                {match.age} years old
              </div>
            )}
            <Link href={`/profile-reveal/${match.clerkId}`} className="w-full mt-4">
              <button className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-full shadow transition text-base tracking-wide">
                Message
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
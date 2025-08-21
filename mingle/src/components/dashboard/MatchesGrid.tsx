import { Match } from "@/types"
import Link from "next/link"

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {matches.map((match: Match) => (
        <Link
          key={match.clerkId}
          href={`/profile-reveal/${match.clerkId}`}
          className="hover:shadow-xl transition-shadow"
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-105 cursor-pointer border border-pink-100"
            style={{ minHeight: 320 }}
          >
            <div className="relative mb-3 w-full h-48 rounded-t-2xl overflow-hidden flex items-center justify-center">
              <img
                src={
                  match.profilePhotos && match.profilePhotos.length > 0
                    ? match.profilePhotos[0]
                    : match.profilePhoto || "/default-avatar.png"
                }
                alt={match.fullName || match.username}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-4 bg-pink-500 text-white text-xs px-3 py-1 rounded-full shadow">
                {match.compatibilityScore}% Match
              </span>
            </div>
            <div className="text-xl font-bold text-gray-800 mb-1 text-center">
              {match.fullName || match.username}
            </div>
            {match.age && (
              <div className="text-gray-500 text-sm mb-4">
                {match.age} years old
              </div>
            )}
            <button className="mt-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow transition">
              View Profile
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}

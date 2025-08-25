import { Match } from "@/types";
import Link from "next/link";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {matches.map((match: Match) => (
        <div
          key={match.clerkId}
         
          className="hover:shadow-xl transition-shadow"
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-105 cursor-pointer border border-blue-100"
            style={{ minHeight: 180 }}
          >
            <div className="relative mb-3 w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={
                  match.profilePhotos && match.profilePhotos.length > 0
                    ? match.profilePhotos[0]
                    : match.profilePhoto || "/default-avatar.png"
                }
                alt={match.fullName || match.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-lg font-bold text-gray-800 mb-1 text-center">
              {match.fullName || match.username}
            </div>
            {match.age && (
              <div className="text-gray-500 text-sm mb-2">
                {match.age} years old
              </div>
            )}
            <div className="flex space-x-2">
              <Link href={`/profile-reveal/${match.clerkId}`}>
                <button className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow transition">
                  Message
                </button>
              </Link>
              <Link href={`/profile-detail/${match.clerkId}`}>
                <button className="mt-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow transition">
                  View Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
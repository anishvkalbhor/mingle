"use client";

import { useParams } from "next/navigation";
import ChatRequestCard from "@/components/ChatRequestCard";

const profiles = [
  {
    id: "3",
    name: "Ananya",
    age: 25,
    bio: "Book lover, chai addict ☕📚",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGdpcmx8ZW58MHx8MHx8fDA%3D",
    matchPercent: "96%",
    interests: ["Travel", "Books", "Chai", "Trekking"],
    currentUserLiked: true,
    matchedUserLikedBack: true,
  },
  {
    id: "4",
    name: "Kabir",
    age: 27,
    bio: "Mountain soul 🏔️ | Guitarist 🎸 | Coffee > anything",
    image: "https://i.pinimg.com/736x/93/8f/b4/938fb4620dae758b18d5688502cf3eb6.jpg",
    matchPercent: "95%",
    interests: ["Music", "Mountains", "Coffee", "Guitar"],
    currentUserLiked: true,
    matchedUserLikedBack: false,
  }  
];

export default function ProfileRevealPage() {
  const { id } = useParams();
  const profile = profiles.find((p) => p.id === id);
  const isMutualMatch = profile?.currentUserLiked && profile?.matchedUserLikedBack;

  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl shadow-lg border text-center">
        {isMutualMatch ? (
          <>
            <img src={profile.image} alt="Profile" className="w-full h-96 object-cover rounded-2xl mb-6" />
            <h2 className="text-3xl font-bold text-gray-800">
              {profile.name}, {profile.age}
            </h2>
            <p className="text-sm text-pink-500">{profile.matchPercent} Match</p>
            <p className="text-gray-600 text-base mt-4 mb-6">{profile.bio}</p>
            <ChatRequestCard />
          </>
        ) : (
          <>
           <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Waiting for mutual like 💞
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              You liked this profile. When they like you back, you’ll be able to view their full
              profile here.
            </p>
            <img
              src={profile.image}
              className="w-full h-80 object-cover rounded-xl opacity-40 grayscale blur-md"
              alt="Blurred profile"
            />
          </>
        )}
      </div>
    </div>
  );
}

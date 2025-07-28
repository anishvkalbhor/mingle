import MatchSuggestionCard from "@/components/MatchCards";

const matches = [
  {
    id: 1,
    name: "Saanvi",
    age: 24,
    bio: "Loves sunsets and coffee ☕",
    image:
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGdpcmx8ZW58MHx8MHx8fDA%3D",
    matchPercent: "99%",
    currentUserLiked: true,
    matchedUserLikedBack: true,
  },
  {
    id: 2,
    name: "Aarohi",
    age: 26,
    bio: "Dancer | Traveler | Dreamer 💃🌍",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGdpcmx8ZW58MHx8MHx8fDA%3D",
    matchPercent: "97%",
    currentUserLiked: true,
    matchedUserLikedBack: true,
  },
  {
    id: 3,
    name: "Ananya",
    age: 25,
    bio: "Book lover, chai addict ☕📚, always up for an adventure!",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGdpcmx8ZW58MHx8MHx8fDA%3D",
    matchPercent: "96%",
    currentUserLiked: true,
    matchedUserLikedBack: true,
  },
  {
    id: 4,
    name: "Kabir",
    age: 27,
    bio: "Mountain soul 🏔️ | Guitarist 🎸 | Coffee > anything",
    image:
      "https://i.pinimg.com/736x/93/8f/b4/938fb4620dae758b18d5688502cf3eb6.jpg",
    matchPercent: "94%",
    currentUserLiked: true,
    matchedUserLikedBack: true,
  },
];

export default function MatchSuggestionsPage() {
  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-rose-600 mb-10 text-center">
          💘 Match Suggestions Just for You
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchSuggestionCard key={match.id} {...match} />
          ))}
        </div>
      </div>
    </div>
  );
}

// app/quiz/page.tsx

import Quiz from "@/components/Quiz";

const quizData = [
  {
    question: "Which ideal date appeals to you the most?",
    options: [
      { id: "A", text: "Candlelight Dinner", emoji: "🍷" },
      { id: "B", text: "Adventure Trip", emoji: "🏞️" },
      { id: "C", text: "Movie Night", emoji: "🎬" },
      { id: "D", text: "Cooking Together", emoji: "👩‍🍳" },
    ],
  },
  {
    question: "What quality do you value most in a partner?",
    options: [
      { id: "A", text: "Humor", emoji: "😂" },
      { id: "B", text: "Loyalty", emoji: "🤝" },
      { id: "C", text: "Ambition", emoji: "🚀" },
      { id: "D", text: "Kindness", emoji: "❤️" },
    ],
  },
];

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4">
      <header className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-pink-700 mb-2">📝 Compatibility Quiz</h1>
        <p className="text-pink-800">
          Answer a few fun questions to earn points and improve your matches!
        </p>
      </header>
      <Quiz quiz={quizData} />
    </div>
  );
}

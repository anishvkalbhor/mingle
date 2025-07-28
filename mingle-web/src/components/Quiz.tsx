"use client";

import { useEffect, useState } from "react";

type Option = {
  id: string;
  text: string;
  emoji?: string;
};

type QuizQuestion = {
  question: string;
  options: Option[];
};

type Props = {
  quiz: QuizQuestion[];
};

export default function Quiz({ quiz }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answerId: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (optionId: string) => {
    setSelected(optionId);
    setPoints((prev) => prev + 10);
    setAnswers((prev) => [
      ...prev,
      {
        question: quiz[current].question,
        answerId: optionId,
      },
    ]);
  };

  const handleNext = () => {
    setSelected(null);
    setCurrent((prev) => prev + 1);
  };

  useEffect(() => {
    if (current >= quiz.length && !submitted) {
      const userId = "user123"; // Replace with actual user logic if needed

      fetch("http://localhost:5000/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          score: points,
          answers,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Quiz submitted:", data);
          setSubmitted(true);
        })
        .catch((err) => {
          console.error("Submission error:", err);
        });
    }
  }, [current, quiz.length, submitted, points, answers]);

  if (current >= quiz.length) {
    return (
      <div className="w-full max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center mt-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4">
          🎉 Quiz Completed!
        </h2>
        <p className="text-base sm:text-lg text-green-800">
          You earned {points} compatibility points!
        </p>
      </div>
    );
  }

  const q = quiz[current];

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg mt-10">
      <h2 className="text-xl sm:text-2xl font-bold text-pink-700 mb-6 text-center">
        {q.question}
      </h2>

      <div className="space-y-4">
        {q.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(opt.id)}
            disabled={!!selected}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base sm:text-lg border transition duration-300
              ${
                selected === opt.id
                  ? "bg-pink-600 text-white border-pink-600"
                  : "bg-gray-50 text-gray-800 hover:bg-pink-100 border-gray-300"
              }`}
          >
            <span>
              {opt.emoji} {opt.text}
            </span>
            {selected === opt.id && (
              <span className="text-white text-xl">✅</span>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <button
          onClick={handleNext}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 text-base sm:text-lg"
        >
          Next Question →
        </button>
      )}
    </div>
  );
}

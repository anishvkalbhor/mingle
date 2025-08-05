"use client";

import { useState } from "react";

const locations = ["Delhi", "Mumbai", "Bangalore", "Goa"];
const interests = ["Music", "Food", "Adventure", "Art"];
const budgets = ["Low", "Medium", "High"];
const personalities = ["Introvert", "Extrovert", "Ambivert"];
const types = ["Outdoor", "Indoor", "Romantic", "Fun"];

export default function RomanticDatePlanner() {
  const [location, setLocation] = useState("");
  const [interest, setInterest] = useState("");
  const [budget, setBudget] = useState("");
  const [personality, setPersonality] = useState("");
  const [type, setType] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!location || !interest || !budget || !personality || !type) {
      setResult("❗ Please select all fields before generating your dream date.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/ai/generate-date-ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, interests: interest, budget, personality, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setResult(data.ideas);
    } catch (error) {
      setResult("❌ Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-100 via-white to-pink-200 flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-2xl bg-white/60 backdrop-blur-lg border border-rose-300 rounded-3xl shadow-2xl p-8 md:p-10 space-y-6 relative overflow-hidden">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-rose-400 opacity-30 blur-3xl rounded-full"></div>

        <h1 className="text-4xl md:text-5xl font-bold text-center text-rose-600 drop-shadow-md tracking-tight">
          ✨ Romantic Date Generator
        </h1>
        <p className="text-center text-gray-600">
          Let AI help you plan a dreamy and unforgettable date 💌
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Select label="📍 Location" value={location} setValue={setLocation} options={locations} />
          <Select label="🎯 Interest" value={interest} setValue={setInterest} options={interests} />
          <Select label="💸 Budget" value={budget} setValue={setBudget} options={budgets} />
          <Select label="🧠 Personality" value={personality} setValue={setPersonality} options={personalities} />
          <Select label="🌷 Date Type" value={type} setValue={setType} options={types} />
        </div>

        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-semibold shadow-md transition disabled:opacity-50"
          >
            {loading ? "Generating your perfect date..." : "💖 Generate Dream Date"}
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-inner animate-fade-in">
            <h2 className="text-2xl font-bold text-rose-700 mb-2">💡 Your AI-Planned Date</h2>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}

function Select({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (val: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-rose-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2 border border-rose-300 rounded-lg shadow-sm focus:ring-2 focus:ring-rose-400 bg-white text-gray-800"
      >
        <option value="" disabled>
          Select {label.replace(/[^\w\s]/gi, "")}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

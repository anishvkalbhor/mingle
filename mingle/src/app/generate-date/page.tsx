"use client";

import { useState, useRef, useEffect } from "react";
import { LocationPicker } from "@/components/LocationPicker";
import { FiChevronDown, FiMapPin } from "react-icons/fi";
import { BackToHomeButton } from "@/components/BackToHomeButton";

const interests = [
  "Music",
  "Food",
  "Adventure",
  "Art",
  "Sports",
  "Nature",
  "Culture",
  "Shopping",
  "Nightlife",
  "Photography",
  "Books",
  "Movies",
  "Travel",
  "Fitness",
  "Technology",
];
const budgets = ["Low (₹500-1500)", "Medium (₹1500-3000)", "High (₹3000+)"];
const personalities = ["Introvert", "Extrovert", "Ambivert"];
const types = [
  "Outdoor",
  "Indoor",
  "Romantic",
  "Fun",
  "Adventure",
  "Cultural",
  "Relaxing",
  "Active",
];

export default function RomanticDatePlanner() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [interest, setInterest] = useState("");
  const [budget, setBudget] = useState("");
  const [personality, setPersonality] = useState("");
  const [type, setType] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedCity || !interest || !budget || !personality || !type) {
      setResult(
        "❗ Please select all fields before generating your dream date."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/ai/generate-date-ideas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: `${selectedCity}, ${selectedState}`,
            interests: interest,
            budget: budget.split(" ")[0],
            personality,
            type,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setResult(data.ideas);
    } catch (error) {
      setResult("❌ Oops! Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center px-4 py-12 font-sans">
      <BackToHomeButton />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-2xl bg-white/60 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl p-8 md:p-10 space-y-6 relative">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-md tracking-tight">
          Mingle
        </h1>
        <p className="text-center text-gray-600">
          Let AI help you plan a dreamy and unforgettable date 💌
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📍 Choose Your Location
            </label>
            <LocationPicker
              selectedState={selectedState}
              selectedCity={selectedCity}
              onStateChange={setSelectedState}
              onCityChange={setSelectedCity}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="🎯 Interest"
              value={interest}
              setValue={setInterest}
              options={interests}
            />
            <Select
              label="💸 Budget"
              value={budget}
              setValue={setBudget}
              options={budgets}
            />
            <Select
              label="🧠 Personality"
              value={personality}
              setValue={setPersonality}
              options={personalities}
            />
            <Select
              label="🌷 Date Type"
              value={type}
              setValue={setType}
              options={types}
            />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-md transition disabled:opacity-50"
          >
            {loading
              ? "Generating your perfect date..."
              : "💖 Generate Dream Date"}
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-5 shadow-inner animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              💡 Your AI-Planned Date
            </h2>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {result}
            </p>
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
  disabled = false,
}: {
  label: string;
  value: string;
  setValue: (val: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openUpwards, setOpenUpwards] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (option: string) => {
    setValue(option);
    setIsOpen(false);
    setSearchQuery("");
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Decide whether to open upwards or downwards
  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(filteredOptions.length, 6) * 42 + 50; // estimate: 42px per option + search bar
      setOpenUpwards(spaceBelow < dropdownHeight);
    }
  }, [isOpen, filteredOptions.length]);

  return (
    <div ref={ref} className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {value || `Select ${label.replace(/[^\w\s]/gi, "")}`}
        <FiChevronDown
          className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div
          className={`absolute z-50 w-full bg-white text-gray-700 border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
            openUpwards ? "bottom-full mb-1" : "mt-1"
          }`}
        >
          {/* Search box */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${label}...`}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {filteredOptions.length > 0 ? (
            <div className="py-1">
              {filteredOptions.slice(0, 50).map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-2 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <FiMapPin className="inline mr-2" size={14} />
                  {option}
                </button>
              ))}
              {filteredOptions.length > 50 && (
                <div className="px-4 py-2 text-sm text-gray-500 border-t">
                  Showing first 50 results. Keep typing to refine...
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

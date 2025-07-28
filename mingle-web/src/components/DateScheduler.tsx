"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";

type Venue = {
  name: string;
  address: string;
  imageUrl?: string | null;
};

const statesData: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Delhi: ["New Delhi", "Dwarka", "Karol Bagh", "Rohini"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai", "Salem"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  UttarPradesh: ["Lucknow", "Kanpur", "Agra", "Varanasi"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer"],
  WestBengal: ["Kolkata", "Howrah", "Darjeeling", "Siliguri"],
  Punjab: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  AndhraPradesh: ["Vijayawada", "Visakhapatnam", "Guntur", "Nellore"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  MadhyaPradesh: ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
  Chhattisgarh: ["Raipur", "Bilaspur", "Korba", "Durg"],
  Odisha: ["Bhubaneswar", "Cuttack", "Puri", "Sambalpur"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar", "Tezpur"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
};

export default function DateScheduler() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | null>(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);

  const tileClassName = ({ date: d }: { date: Date }) => {
    if (date && d.toDateString() === date.toDateString()) {
      return "bg-pink-600 text-white rounded-full shadow-md";
    }
    if (d.toDateString() === new Date().toDateString()) {
      return "border border-pink-300 rounded-full";
    }
    return "";
  };

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/venues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: selectedCity }),
      });
      const data = await res.json();
      setVenues(data.venues || []);
      setStep(3);
    } catch (error) {
      console.error("Fetch venues error:", error);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && date) setStep(2);
    else if (step === 2 && selectedState && selectedCity) fetchVenues();
    else if (step === 3 && selectedVenue) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAction = (action: "cancel" | "reschedule" | "accept") => {
    if (action === "cancel") {
      setStep(1);
      setDate(null);
      setSelectedState("");
      setSelectedCity("");
      setVenues([]);
      setSelectedVenue(null);
    } else if (action === "reschedule") {
      setStep(1);
    } else if (action === "accept") {
      alert(`✅ Date locked in for ${date?.toDateString()} at ${selectedVenue?.name}, ${selectedCity}! 💖`);
    }
  };

  const stepsLabels = ["Pick Date", "Select Location", "Choose Venue", "Confirm"];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border border-pink-100 font-sans">
      <h2 className="text-3xl font-bold text-center text-rose-700 mb-8">Plan Your Dream Date 💖</h2>

      <div className="flex flex-col md:flex-row gap-8">
        <nav className="flex md:flex-col gap-4 w-full md:w-1/4">
          {stepsLabels.map((label, idx) => (
            <motion.button
              key={label}
              onClick={() => setStep(idx + 1)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full shadow-lg transition-all
                ${step === idx + 1 ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white" : "bg-pink-100 text-pink-800 hover:from-pink-400 hover:to-purple-500 hover:text-white"}`}
            >
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold text-sm
                  ${step === idx + 1 ? "bg-white text-pink-600 border-white" : "text-pink-700 border-pink-400 bg-white"}`}
              >
                {idx + 1}
              </span>
              <span className="text-purple-800">{label}</span>
            </motion.button>
          ))}
        </nav>

        <div className="flex-1">
          {step === 1 && (
            <div className="text-center">
              <Calendar
                onChange={(d) => setDate(d as Date)}
                value={date}
                tileClassName={tileClassName}
                minDate={new Date()}
                className="react-calendar shadow-lg border border-pink-200 text-pink-700"
              />
              {date && <p className="mt-4 text-pink-500">📅 Selected: {date.toDateString()}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity("");
                }}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-700"
              >
                <option value="">Select State</option>
                {Object.keys(statesData).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 text-gray-700"
              >
                <option value="">Select City</option>
                {selectedState && statesData[selectedState].map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          )}

          {step === 3 && (
            <div>
              {loading ? (
                <p className="text-center text-pink-500 animate-pulse">Loading venues…</p>
              ) : venues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {venues.map((venue) => (
                    <div
                      key={venue.name}
                      onClick={() => setSelectedVenue(venue)}
                      className={`cursor-pointer p-4 border rounded-xl transition hover:shadow-md ${selectedVenue?.name === venue.name ? "bg-pink-100 border-pink-500" : "border-pink-200"}`}
                    >
                      {venue.imageUrl ? (
                        <img src={venue.imageUrl} alt={venue.name} className="w-full h-40 object-cover rounded mb-3" />
                      ) : (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded mb-3 text-gray-400">No Image</div>
                      )}
                      <p className="font-semibold text-rose-800">{venue.name}</p>
                      <p className="text-gray-600 text-sm">{venue.address}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-red-400">No venues found.</p>
              )}
            </div>
          )}

          {step === 4 && selectedVenue && (
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-pink-700 font-sans">💖 Confirm Your Dream Date</h3>
              <p><strong>Date:</strong> {date?.toDateString()}</p>
              <p><strong>Venue:</strong> {selectedVenue.name}, {selectedCity}</p>
              <p className="text-gray-500 text-sm">{selectedVenue.address}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => handleAction("accept")} className="bg-pink-600 text-white px-6 py-2 rounded-xl hover:bg-pink-700">✅ Confirm Date</button>
                <button onClick={() => handleAction("reschedule")} className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-xl hover:bg-yellow-500">✏️ Reschedule</button>
                <button onClick={() => handleAction("cancel")} className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600">❌ Cancel</button>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="flex justify-between mt-6">
              <button onClick={handleBack} disabled={step === 1} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-black">⬅️ Back</button>
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !date) ||
                  (step === 2 && (!selectedState || !selectedCity)) ||
                  (step === 3 && !selectedVenue)
                }
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                Next ➡️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

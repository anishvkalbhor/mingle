"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LocationPicker } from "./LocationPicker";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

type Venue = {
  mapsUrl: string | undefined;
  name: string;
  address: string;
  imageUrl?: string | null;
  rating?: number | null;
  priceLevel?: number | null;
  category?: string;
  types?: string[];
};

export default function DateScheduler() {
  const { getToken, isSignedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [venueType, setVenueType] = useState("all");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const timeSlots = [
    "9:00am",
    "9:30am",
    "10:00am",
    "10:30am",
    "11:00am",
    "11:30am",
    "12:00pm",
    "12:30pm",
    "1:00pm",
    "1:30pm",
    "2:00pm",
    "2:30pm",
    "3:00pm",
    "3:30pm",
    "4:00pm",
    "4:30pm",
    "5:00pm",
    "5:30pm",
    "6:00pm",
    "6:30pm",
    "7:00pm",
    "7:30pm",
    "8:00pm",
    "8:30pm",
    "9:00pm",
    "9:30pm",
    "10:00pm",
  ];

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/venues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity,
          venueType: venueType,
        }),
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
    if (step === 1 && date && time) setStep(2);
    else if (step === 2 && selectedState && selectedCity && venueType)
      fetchVenues();
    else if (step === 3 && selectedVenue) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAction = (action: "cancel" | "reschedule" | "accept") => {
    if (action === "cancel") {
      setStep(1);
      setDate(null);
      setTime("");
      setSelectedState("");
      setSelectedCity("");
      setVenueType("all");
      setVenues([]);
      setSelectedVenue(null);
    } else if (action === "reschedule") {
      setStep(1);
    } else if (action === "accept") {
      setShowConfirmModal(true);
    }
  };

  const runConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#9333ea", "#ec4899", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleConfirmDate = async () => {
    if (!date || !time || !selectedVenue) {
      console.error("Missing required data for saving");
      alert("❌ Missing required information. Please check all fields.");
      return;
    }

    if (!isSignedIn) {
      alert("❌ You must be signed in to save a planned date.");
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        alert("❌ Unable to authenticate. Please sign in again.");
        return;
      }

      console.log("Sending date data:", {
        date: date.toISOString(),
        time,
        state: selectedState,
        city: selectedCity,
        venueType,
        venueName: selectedVenue.name,
        venueAddress: selectedVenue.address,
        venueRating: selectedVenue.rating,
        venueCategory: selectedVenue.category,
        venueMapsUrl: selectedVenue.mapsUrl,
      });

      const response = await fetch("http://localhost:5000/api/planned-dates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: date.toISOString(),
          time,
          state: selectedState,
          city: selectedCity,
          venueType,
          venueName: selectedVenue.name,
          venueAddress: selectedVenue.address,
          venueRating: selectedVenue.rating,
          venueCategory: selectedVenue.category,
          venueMapsUrl: selectedVenue.mapsUrl,
        }),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Date saved successfully:", result);

        runConfetti();

        setShowConfirmModal(false);

        setStep(1);
        setDate(null);
        setTime("");
        setSelectedState("");
        setSelectedCity("");
        setVenueType("all");
        setVenues([]);
        setSelectedVenue(null);
      } else {
        const error = await response.json();
        console.error("Failed to save date:", error);
        alert(`❌ Failed to save your date: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving planned date:", error);
      alert(
        "❌ An error occurred while saving your date. Please check the console for details."
      );
    }
  };

  const stepsLabels = [
    { label: "Pick Date", icon: CalendarIcon },
    { label: "Select Location", icon: MapPin },
    { label: "Choose Venue", icon: Clock },
    { label: "Confirm", icon: CheckCircle },
  ];

  return (
    <>
      <div className="h-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-3 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 font-sans flex flex-col">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
          Plan Your Dream Date 💖
        </h2>

        <div className="mb-3 sm:mb-4 md:mb-6 flex-shrink-0 px-1 sm:px-2 md:px-4">
          <div className="relative">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-2/6 left-4 right-4 sm:left-5 sm:right-5 md:left-6 md:right-6 h-0.5 transform -translate-y-1/2 z-0">
                <div className="absolute w-full h-full bg-gray-200 rounded-full"></div>
                <div
                  className="absolute h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${((step - 1) / (stepsLabels.length - 1)) * 100}%`,
                  }}
                ></div>
              </div>

              {stepsLabels.map((stepItem, idx) => {
                const Icon = stepItem.icon;
                const isActive = step === idx + 1;
                const isCompleted = step > idx + 1;

                return (
                  <div
                    key={stepItem.label}
                    className="flex flex-col items-center relative z-10"
                  >
                    <motion.div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white",
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600"
                          : isCompleted
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white text-gray-400 border-gray-300"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </motion.div>
                    <p
                      className={cn(
                        "mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-center leading-tight",
                        isActive
                          ? "text-purple-600"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-500"
                      )}
                    >
                      <span className="hidden sm:inline">{stepItem.label}</span>
                      <span className="sm:hidden">
                        {stepItem.label.split(" ")[0]}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1 sm:px-2">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="text-center">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-1 sm:mb-2">
                  Select Your Date
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Choose the perfect day for your romantic date
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
                <div className="flex-1 max-w-md mx-auto">
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                      Pick a Date
                    </h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 text-base bg-white border-gray-300 text-gray-900",
                            !date && "text-gray-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date || undefined}
                          onSelect={(selectedDate) =>
                            setDate(selectedDate || null)
                          }
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          required={false}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="flex-1 max-w-md mx-auto">
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                      Select Time
                    </h4>
                    <div className="grid grid-cols-3 gap-2 max-h-64 sm:max-h-80 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={time === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTime(slot)}
                          className={cn(
                            "h-8 sm:h-10 text-xs sm:text-sm text-gray-900",
                            time === slot
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600"
                              : "bg-white border-gray-300 hover:bg-purple-100"
                          )}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="text-center">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-1 sm:mb-2">
                  Select Location & Venue Type
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Choose where you want to have your date
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    📍 Choose Your Location
                  </h4>
                  <LocationPicker
                    selectedState={selectedState}
                    selectedCity={selectedCity}
                    onStateChange={setSelectedState}
                    onCityChange={setSelectedCity}
                  />
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    🎯 What type of date spot?
                  </h4>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-gray-800"
                  >
                    <option value="all">🌟 All Types (Mixed)</option>
                    <option value="restaurant">🍽️ Restaurants</option>
                    <option value="cafe">☕ Cafes</option>
                    <option value="park">🌳 Parks & Gardens</option>
                    <option value="museum">🏛️ Museums & Galleries</option>
                    <option value="cinema">🎬 Movie Theaters</option>
                    <option value="mall">🛍️ Shopping Malls</option>
                    <option value="arcade">🎮 Gaming & Arcades</option>
                    <option value="bowling">🎳 Bowling</option>
                    <option value="minigolf">⛳ Mini Golf</option>
                    <option value="adventure">🧗 Adventure Activities</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Choose Your Venue
                </h3>
                <p className="text-gray-600">
                  Select the perfect spot for your date
                </p>
              </div>

              <div className="max-w-full mx-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : venues.length > 0 ? (
                  <div className="h-screen pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden">
                      {venues.map((venue, index) => (
                        <motion.div
                          key={`${venue.name}-${venue.address}-${index}`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedVenue(venue)}
                          className={cn(
                            "bg-white border-2 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300",
                            selectedVenue === venue
                              ? "border-purple-500 ring-2 ring-purple-200"
                              : "border-gray-200 hover:border-purple-300"
                          )}
                        >
                          {venue.imageUrl ? (
                            <img
                              src={venue.imageUrl}
                              alt={venue.name}
                              className="h-32 w-full object-cover"
                            />
                          ) : (
                            <div className="h-32 w-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                              Image not available
                            </div>
                          )}

                          <div className="p-3">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="text-base font-semibold text-purple-700 truncate flex-1">
                                {venue.name}
                              </h3>
                              {venue.category && (
                                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                  {venue.category}
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {venue.address}
                            </p>

                            <div className="flex items-center gap-3 mb-2">
                              {venue.rating && (
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-500">⭐</span>
                                  <span className="text-sm text-gray-700">
                                    {venue.rating}
                                  </span>
                                </div>
                              )}
                              {venue.priceLevel && (
                                <div className="flex items-center">
                                  <span className="text-green-600">
                                    {"₹".repeat(venue.priceLevel)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {venue.mapsUrl && (
                              <a
                                href={venue.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View on Google Maps
                              </a>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    No venues found for this location.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 4 && selectedVenue && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Confirm Your Date
                </h3>
                <p className="text-gray-600">
                  Review your date details and confirm
                </p>
              </div>

              <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8">
                <div className="text-center space-y-4">
                  <h4 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    💖 Your Dream Date
                  </h4>
                  <div className="space-y-2 text-left">
                    <p className="text-base text-gray-700">
                      <strong>📅 Date:</strong> {date?.toDateString()}
                    </p>
                    <p className="text-base text-gray-700">
                      <strong>🕐 Time:</strong> {time}
                    </p>
                    <p className="text-base text-gray-700">
                      <strong>📍 Venue:</strong> {selectedVenue.name}
                    </p>
                    <p className="text-base text-gray-700">
                      <strong>🏙️ Location:</strong> {selectedCity},{" "}
                      {selectedState}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedVenue.address}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Button
                      onClick={() => handleAction("accept")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2"
                    >
                      ✅ Confirm Date
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAction("reschedule")}
                      className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                    >
                      ✏️ Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAction("cancel")}
                      className="border-red-400 text-red-600 hover:bg-red-50"
                    >
                      ❌ Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {step < 4 && (
          <div className="flex justify-between pt-3 sm:pt-4 border-t border-gray-200 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm sm:text-base hover:text-gray-100 cursor-pointer"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && (!date || !time)) ||
                (step === 2 &&
                  (!selectedState || !selectedCity || !venueType)) ||
                (step === 3 && !selectedVenue)
              }
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm sm:text-base hover:text-gray-100 cursor-pointer"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDate}
        date={date?.toDateString() || ""}
        time={time}
        venue={selectedVenue?.name || ""}
        location={`${selectedCity}, ${selectedState}`}
        address={selectedVenue?.address || ""}
      />
    </>
  );
}

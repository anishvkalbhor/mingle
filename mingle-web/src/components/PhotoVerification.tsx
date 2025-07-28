"use client";

import { useEffect, useRef, useState } from "react";

export default function PhotoVerification() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"verified" | "needsReview" | null>(null);
  const [streaming, setStreaming] = useState<boolean>(true);

  useEffect(() => {
    startCamera();
    return () => stopCamera(); // Stop camera on unmount
  }, []);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
      });
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStreaming(false);
  };

  const handleCapture = async () => {
  const canvas = canvasRef.current;
  const video = videoRef.current;
  if (canvas && video) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setImageData(dataUrl);
      stopCamera();

      try {
        const response = await fetch("http://localhost:5000/api/user/verify-photo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: dataUrl }),
        });

        const result = await response.json();
        
        // Backend should return { status: "verified" } or { status: "needsReview" }
        if (result.status === "verified" || result.status === "needsReview") {
          setVerificationStatus(result.status);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error verifying photo:", error);
        setVerificationStatus("needsReview");
      }
    }
  }
};


  const handleRetake = () => {
    setImageData(null);
    setVerificationStatus(null);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-pink-50 rounded-2xl shadow-xl max-w-2xl w-full mx-auto mt-10 border border-pink-200">
      <h2 className="text-3xl font-bold text-pink-600 text-center">Photo Verification 💕</h2>

      <p className="text-center text-gray-700 max-w-sm">
        Please take a selfie to verify your profile. This helps keep our community real and safe 💖
      </p>

      {streaming && (
        <video
          ref={videoRef}
          autoPlay
          className="rounded-xl border-4 border-pink-200 shadow-md w-full max-w-md h-72 object-cover"
        />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {!imageData && (
        <button
          onClick={handleCapture}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold px-6 py-3 rounded-full shadow hover:scale-105 transition duration-300"
        >
          📸 Capture Selfie
        </button>
      )}

      {imageData && (
        <div className="text-center mt-4">
          <p className="mb-2 text-gray-600">Preview of your selfie:</p>
          <img
            src={imageData}
            alt="Captured selfie"
            className="w-40 h-40 rounded-full border-4 border-pink-300 shadow-lg object-cover mx-auto"
          />

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleRetake}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400"
            >
              🔄 Retake
            </button>

            <button
              onClick={() => alert("Submitted to backend")}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
            >
              ✅ Submit
            </button>
          </div>
        </div>
      )}

      {verificationStatus && (
        <div className="mt-6 text-center text-lg font-bold">
          {verificationStatus === "verified" ? (
            <p className="text-green-600 animate-pulse">
              ✅ You're Verified! Welcome to real love 💘
            </p>
          ) : (
            <p className="text-red-500 animate-bounce">
              ❗ Needs Review. Please try again 💔
            </p>
          )}
        </div>
      )}
    </div>
  );
}

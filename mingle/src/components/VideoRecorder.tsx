"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  onUpload: (url: string) => void
}

export default function VideoRecorder({ onUpload }: Props) {
  const [recording, setRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [timeLeft, setTimeLeft] = useState(45)
  const [timerActive, setTimerActive] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const chunks = useRef<Blob[]>([])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }

    if (timeLeft === 0 && mediaRecorderRef.current?.state === "recording") {
      stopRecording()
    }

    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const startRecording = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    setStream(mediaStream)
    videoRef.current!.srcObject = mediaStream
    videoRef.current!.play()

    const mediaRecorder = new MediaRecorder(mediaStream)
    mediaRecorderRef.current = mediaRecorder
    chunks.current = []
    setRecording(true)
    setTimerActive(true)
    setTimeLeft(45)

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "video/mp4" })
      setVideoBlob(blob)
      stream?.getTracks().forEach((track) => track.stop())
      setTimerActive(false)
    }

    mediaRecorder.start()
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const uploadToCloudinary = async () => {
    if (!videoBlob) return

    const formData = new FormData()
    formData.append("file", videoBlob)
    formData.append("upload_preset", "mingle-web")

    const res = await fetch("https://api.cloudinary.com/v1_1/duycyjk2n/video/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    if (data.secure_url) onUpload(data.secure_url)
  }

  const resetRecorder = () => {
    setVideoBlob(null)
    setTimeLeft(45)
  }

  return (
    <Card className="p-6 w-full max-w-md bg-gradient-to-br from-pink-50 to-rose-100 shadow-xl rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold text-gray-800">
          🎥 Your Intro Video
        </CardTitle>
        <p className="text-sm text-gray-500">
          Record or upload a 30–45s video to introduce yourself.
        </p>
      </CardHeader>

      <CardContent>
        {!videoBlob && (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <video ref={videoRef} autoPlay muted className="w-full aspect-video bg-black rounded-xl" />
              {recording && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  {timeLeft}s left
                </span>
              )}
            </div>

            {!recording && (
              <Button onClick={startRecording} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                🎬 Start Recording
              </Button>
            )}

            {recording && (
              <Button onClick={stopRecording} variant="destructive" className="w-full">
                ⏹️ Stop Recording
              </Button>
            )}
          </div>
        )}

        {videoBlob && (
          <div className="space-y-3">
            <video controls className="w-full aspect-video rounded-xl shadow-md">
              <source src={URL.createObjectURL(videoBlob)} type="video/mp4" />
            </video>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={uploadToCloudinary} className="bg-green-500 hover:bg-green-600 text-white">
                ✅ Upload
              </Button>
              <Button onClick={resetRecorder} className="bg-yellow-400 hover:bg-yellow-500 text-white">
                🔁 Re-record
              </Button>
              <Button onClick={() => setVideoBlob(null)} variant="destructive">
                ❌ Discard
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-gray-500 mt-4">Max: 45 seconds | Format: MP4</p>
      </CardContent>
    </Card>
  )
}

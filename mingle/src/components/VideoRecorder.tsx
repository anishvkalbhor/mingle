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
  const [recordingTime, setRecordingTime] = useState(0)
  const [canStopRecording, setCanStopRecording] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const chunks = useRef<Blob[]>([])

  // Timer effect for countdown
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

  // Recording time effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (recording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1
          // Enable stop button after 20 seconds
          if (newTime >= 20) {
            setCanStopRecording(true)
          }
          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [recording])

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
    setRecordingTime(0)
    setCanStopRecording(false)

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "video/mp4" })
      setVideoBlob(blob)
      stream?.getTracks().forEach((track) => track.stop())
      setTimerActive(false)
      setRecording(false)
      setRecordingTime(0)
      setCanStopRecording(false)
    }

    mediaRecorder.start()
  }

  const stopRecording = () => {
    if (canStopRecording && mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current?.stop()
      setRecording(false)
    }
  }

  const uploadToCloudinary = async () => {
    if (!videoBlob) return

    try {
      const formData = new FormData()
      formData.append("file", videoBlob)
      formData.append("upload_preset", "mingle-web")

      const res = await fetch("https://api.cloudinary.com/v1_1/duycyjk2n/video/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (data.secure_url) onUpload(data.secure_url)
    } catch (error) {
      console.error('Error uploading video:', error)
    }
  }

  const resetRecorder = () => {
    setVideoBlob(null)
    setTimeLeft(45)
    setRecordingTime(0)
    setCanStopRecording(false)
  }

  return (
    <Card className="p-6 w-full max-w-md bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold text-gray-800">
          🎥 Your Intro Video
        </CardTitle>
        <p className="text-sm text-gray-500">
          Record or upload a 20–45s video to introduce yourself.
        </p>
      </CardHeader>

      <CardContent>
        {!videoBlob && (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <video ref={videoRef} autoPlay muted className="w-full aspect-video bg-black rounded-xl" style={{ transform: 'scaleX(-1)' }} />
              {recording && (
                <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {timeLeft}s left
                  </span>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {recordingTime}s recorded
                  </span>
                </div>
              )}
            </div>

            {!recording && (
              <Button onClick={startRecording} className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              >
                🎬 Start Recording
              </Button>
            )}

            {recording && (
              <div className="space-y-2">
                <Button 
                  onClick={stopRecording} 
                  variant="destructive" 
                  className="w-full"
                  disabled={!canStopRecording}
                >
                  {canStopRecording ? "⏹️ Stop Recording" : `⏹️ Stop Recording (${20 - recordingTime}s left)`}
                </Button>
                {!canStopRecording && (
                  <p className="text-xs text-center text-gray-500">
                    Minimum recording time: 20 seconds
                  </p>
                )}
              </div>
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

        <p className="text-xs text-center text-gray-500 mt-4">Min: 20s | Max: 45s | Format: MP4</p>
      </CardContent>
    </Card>
  )
}

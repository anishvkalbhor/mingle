"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  onUpload: (url: string) => void
}

export default function VideoRecorder({ onUpload }: Props) {
  const [recording, setRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const chunks: Blob[] = []

  const startRecording = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    setStream(mediaStream)
    videoRef.current!.srcObject = mediaStream

    const mediaRecorder = new MediaRecorder(mediaStream)
    mediaRecorderRef.current = mediaRecorder
    setRecording(true)

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/mp4" })
      setVideoBlob(blob)
      stream?.getTracks().forEach((track) => track.stop())
    }

    mediaRecorder.start()

    // Stop after 30 seconds
    setTimeout(() => {
      mediaRecorder.stop()
      setRecording(false)
    }, 30000)
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

  return (
    <div className="space-y-3">
      <video ref={videoRef} autoPlay muted className="w-full rounded-md bg-black h-48" />
      {!recording && !videoBlob && (
        <Button onClick={startRecording} variant="default">
          🎥 Start Recording
        </Button>
      )}
      {videoBlob && (
        <div className="space-x-2">
          <Button onClick={uploadToCloudinary}>⬆️ Upload Video</Button>
          <Button onClick={() => setVideoBlob(null)} variant="destructive">
            ❌ Discard
          </Button>
        </div>
      )}
      <p className="text-xs text-gray-500">Max: 30 seconds | Format: MP4</p>
    </div>
  )
}

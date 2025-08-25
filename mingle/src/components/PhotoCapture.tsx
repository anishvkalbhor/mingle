"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  onUpload: (url: string) => void
}

export default function PhotoCapture({ onUpload }: Props) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      setError(null)
      setIsVideoReady(false)
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false 
      })
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              setIsVideoReady(true)
            }).catch((error) => {
              console.error('Error playing video:', error)
              setError('Camera started but video playback failed. Please try again.')
            })
          }
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setError('Unable to access camera. Please make sure you have granted camera permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsVideoReady(false)
  }

  const capturePhoto = async () => {
    // Check if refs exist
    if (!videoRef.current) {
      console.error('Video ref not available')
      setError('Camera not initialized. Please refresh and try again.')
      return
    }

    if (!canvasRef.current) {
      console.error('Canvas ref not available')
      setError('Canvas not available. Please refresh and try again.')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) {
      console.error('Canvas context not available')
      setError('Canvas context not available. Please refresh and try again.')
      return
    }

    // Check if video is ready and has dimensions
    if (!isVideoReady || video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video not ready yet')
      setError('Camera not ready. Please wait a moment and try again.')
      return
    }

    setIsCapturing(true)
    setError(null)

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Photo captured successfully, size:', blob.size)
          setPhotoBlob(blob)
          stopCamera()
        } else {
          console.error('Failed to create blob from canvas')
          setError('Failed to capture photo. Please try again.')
        }
        setIsCapturing(false)
      }, 'image/jpeg', 0.9)
    } catch (error) {
      console.error('Error capturing photo:', error)
      setError('Failed to capture photo. Please try again.')
      setIsCapturing(false)
    }
  }

  const uploadToCloudinary = async () => {
    if (!photoBlob) return

    try {
      const formData = new FormData()
      formData.append("file", photoBlob)
      formData.append("upload_preset", "mingle-web")

      const res = await fetch("https://api.cloudinary.com/v1_1/duycyjk2n/image/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (data.secure_url) {
        console.log('Photo uploaded successfully:', data.secure_url)
        onUpload(data.secure_url)
      } else {
        console.error('Upload response:', data)
        setError('Failed to upload photo. Please try again.')
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      setError('Failed to upload photo. Please try again.')
    }
  }

  const resetCapture = () => {
    setPhotoBlob(null)
    setError(null)
    startCamera()
  }

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <Card className="p-6 w-full max-w-md bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold text-gray-800">
          📸 Live Photo Capture
        </CardTitle>
        <p className="text-sm text-gray-500">
          Take a live photo using your device camera
        </p>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!photoBlob && (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline
                className="w-full aspect-video bg-black rounded-xl"
                style={{ transform: 'scaleX(-1)' }}
              />
              {isCapturing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-lg font-semibold">
                    📸 Capturing...
                  </div>
                </div>
              )}
              {!isVideoReady && !error && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-lg font-semibold">
                    📹 Starting camera...
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={capturePhoto} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!stream || !isVideoReady || isCapturing}
            >
              {isCapturing ? "📸 Capturing..." : "📸 Capture Photo"}
            </Button>
          </div>
        )}

        {photoBlob && (
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img 
                src={URL.createObjectURL(photoBlob)} 
                alt="Captured photo"
                className="w-full aspect-video object-cover rounded-xl"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={uploadToCloudinary} className="bg-green-500 hover:bg-green-600 text-white">
                ✅ Upload
              </Button>
              <Button onClick={resetCapture} className="bg-yellow-400 hover:bg-yellow-500 text-white">
                🔁 Re-capture
              </Button>
              <Button onClick={() => setPhotoBlob(null)} variant="destructive">
                ❌ Discard
              </Button>
            </div>
          </div>
        )}

        {/* Hidden canvas element for photo capture */}
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }}
          width="1280"
          height="720"
        />

        <p className="text-xs text-center text-gray-500 mt-4">
          Format: JPEG | Max Size: 10MB
        </p>
      </CardContent>
    </Card>
  )
} 
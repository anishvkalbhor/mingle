"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Camera, X, Plus, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MapLocationPicker from "@/components/MapLocationPickerOSM"

interface BasicInfoStepProps {
  data: any
  onUpdate: (data: any) => void
}

// Image compression utility
const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxWidth) {
          width = (width * maxWidth) / height
          height = maxWidth
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)

      try {
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
        resolve(compressedDataUrl)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// Storage utility with quota handling
const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      // Try to free up space by removing old data
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i)
        if (
          storageKey &&
          (storageKey.includes("_editProfileData") ||
            storageKey.includes("_tempData") ||
            storageKey.includes("_oldProfileData"))
        ) {
          keysToRemove.push(storageKey)
        }
      }

      // Remove old temporary data
      keysToRemove.forEach((key) => {
        try {
          localStorage.removeItem(key)
        } catch (e) {
          console.warn("Failed to remove old data:", e)
        }
      })

      // Try again
      try {
        localStorage.setItem(key, value)
        return true
      } catch (retryError) {
        console.error("Storage quota exceeded even after cleanup:", retryError)
        return false
      }
    }
    console.error("Failed to save to localStorage:", error)
    return false
  }
}

export default function BasicInfoStep({ data, onUpdate }: BasicInfoStepProps) {
  const [photoPreview, setPhotoPreview] = useState<string[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)

  const genderOptions = ["Male", "Female", "Non-binary", "Other"]
  const orientationOptions = ["Straight", "Gay", "Lesbian", "Bisexual", "Asexual", "Pansexual", "Other"]

  useEffect(() => {
    // Load existing photos from data
    if (data.profilePhotos && data.profilePhotos.length > 0) {
      setPhotoPreview(data.profilePhotos)
    }

    // Get user's location
    if (navigator.geolocation && !data.location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode this to get city name
          const location = `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`
          onUpdate({ location })
        },
        (error) => {
          console.log("Location access denied")
        },
      )
    }
  }, [data.profilePhotos])

  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value })
  }

  const handleOrientationToggle = (orientation: string) => {
    const current = data.sexualOrientation || []
    const updated = current.includes(orientation)
      ? current.filter((o: string) => o !== orientation)
      : [...current, orientation]
    onUpdate({ sexualOrientation: updated })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + photoPreview.length > 6) {
      alert("Maximum 6 photos allowed")
      return
    }

    setIsUploading(true)
    setStorageError(null)

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit for original file

      if (!isValidType) {
        alert(`${file.name} is not a valid image file`)
        return false
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 10MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) {
      setIsUploading(false)
      return
    }

    try {
      // Compress and convert files to base64 strings
      const compressedImages = await Promise.all(
        validFiles.map(async (file) => {
          try {
            // Compress image to reduce storage size
            return await compressImage(file, 800, 0.8)
          } catch (error) {
            console.error("Error compressing image:", error)
            // Fallback to original file if compression fails
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(file)
            })
          }
        }),
      )

      const newPhotos = [...photoPreview, ...compressedImages]

      // Test if we can store this data
      const testData = { ...data, profilePhotos: newPhotos }
      const testDataString = JSON.stringify(testData)

      // Check if the data is too large (rough estimate)
      if (testDataString.length > 4 * 1024 * 1024) {
        // 4MB limit
        setStorageError("Images are too large. Please use fewer or smaller images.")
        setIsUploading(false)
        return
      }

      setPhotoPreview(newPhotos)
      onUpdate({ profilePhotos: newPhotos })
    } catch (error) {
      console.error("Error processing images:", error)
      setStorageError("Error uploading images. Please try again with smaller images.")
    }

    setIsUploading(false)
    // Reset input
    e.target.value = ""
  }

  const removePhoto = (index: number) => {
    const updatedPreviews = photoPreview.filter((_, i) => i !== index)
    setPhotoPreview(updatedPreviews)
    onUpdate({ profilePhotos: updatedPreviews })
    setStorageError(null) // Clear any storage errors when removing photos
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newPreviews = [...photoPreview]

    // Remove dragged item
    const [draggedPreview] = newPreviews.splice(draggedIndex, 1)

    // Insert at new position
    newPreviews.splice(dropIndex, 0, draggedPreview)

    setPhotoPreview(newPreviews)
    onUpdate({ profilePhotos: newPreviews })
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-8">
      {/* Storage Error Alert */}
      {storageError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{storageError}</AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <User className="w-5 h-5 mr-2 text-pink-500" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700 font-medium">
              Full Name <span className="text-pink-500">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={data.fullName || ""}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
              Date of Birth <span className="text-pink-500">*</span>
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={data.dateOfBirth || ""}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">
              Gender <span className="text-pink-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {genderOptions.map((gender) => (
                <Badge
                  key={gender}
                  variant={data.gender === gender ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                    data.gender === gender
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                      : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                  }`}
                  onClick={() => handleInputChange("gender", gender)}
                >
                  {gender}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">
              Sexual Orientation <span className="text-pink-500">*</span>
            </Label>
            <p className="text-sm text-gray-500 mb-2">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {orientationOptions.map((orientation) => (
                <Badge
                  key={orientation}
                  variant={data.sexualOrientation?.includes(orientation) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                    data.sexualOrientation?.includes(orientation)
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                      : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                  }`}
                  onClick={() => handleOrientationToggle(orientation)}
                >
                  {orientation}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-700 font-medium">
              Location <span className="text-pink-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="location"
                type="text"
                placeholder="Enter your city or click the map icon"
                value={data.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 pr-12"
              />
              <MapLocationPicker
                currentLocation={""}
                onLocationSelect={(location) => handleInputChange("location", location)}
                trigger={
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-full transition-all duration-200 group"
                    title="Choose location on map"
                  >
                    <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Photos */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Camera className="w-5 h-5 mr-2 text-pink-500" />
            Profile Photos <span className="text-pink-500">*</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload 1-6 photos. Images will be compressed to save space. First photo will be your main profile picture.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {/* Existing photos */}
            {photoPreview.map((preview, index) => (
              <div
                key={index}
                className={`relative group cursor-move transition-all duration-200 ${
                  draggedIndex === index ? "opacity-50 scale-95" : "hover:scale-105"
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-pink-300 transition-colors">
                  <img
                    src={preview || "/placeholder.svg?height=200&width=200"}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                </div>

                {/* Remove button */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="w-3 h-3" />
                </Button>

                {/* Main photo indicator */}
                {index === 0 && <Badge className="absolute bottom-2 left-2 bg-pink-500 text-white text-xs">Main</Badge>}

                {/* Photo number */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}

            {/* Upload button */}
            {photoPreview.length < 6 && (
              <label
                className={`aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 group ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-pink-100 transition-colors">
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Plus className="w-6 h-6 text-gray-400 group-hover:text-pink-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-pink-600 font-medium">
                    {isUploading ? "Uploading..." : "Add Photo"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">Max 10MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>{photoPreview.length}/6 photos uploaded</span>
            {photoPreview.length > 0 && <span>Drag photos to reorder • First photo is your main picture</span>}
          </div>

          {/* Photo upload tips */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              <Upload className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-2">Photo Tips for Better Matches:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use high-quality, well-lit photos</li>
                  <li>• Include a clear face shot as your main photo</li>
                  <li>• Show your personality and interests</li>
                  <li>• Avoid group photos where you're hard to identify</li>
                  <li>• Images are automatically compressed to save space</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

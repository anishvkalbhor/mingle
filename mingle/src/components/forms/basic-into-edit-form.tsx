"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, MapPin, Camera, X, Plus, Upload, AlertCircle } from "lucide-react"
import { useUser, useAuth } from "@clerk/nextjs"
import { LocationPickerModal } from "@/components/LocationPickerModal"
import { Button } from "@/components/ui/button"

interface BasicInfoEditFormProps {
  onDataChange: (updatedData: BasicInfoFormData) => void
}

interface BasicInfoFormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  sexualOrientation: string; // single value, not array
  location: string;
  profilePhotos: string[];
}

export default function BasicInfoEditForm({ onDataChange }: BasicInfoEditFormProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<BasicInfoFormData>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    sexualOrientation: "",
    location: "",
    profilePhotos: [],
  });
  const [photoPreview, setPhotoPreview] = useState<string[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const genderOptions = ["Male", "Female", "Non-binary", "Other"]
  const orientationOptions = ["Straight", "Gay", "Lesbian", "Bisexual", "Asexual", "Pansexual", "Other"]

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    (async () => {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const result = await res.json();
      if (result.status === "success" && result.data && result.data.basicInfo) {
        setFormData({
          fullName: result.data.basicInfo.fullName || "",
          dateOfBirth: result.data.basicInfo.dateOfBirth || "",
          gender: result.data.basicInfo.gender || "",
          sexualOrientation: result.data.basicInfo.sexualOrientation || "",
          location: result.data.basicInfo.location || "",
          profilePhotos: result.data.basicInfo.profilePhotos || [],
        });
        if (Array.isArray(result.data.basicInfo.profilePhotos)) {
          setPhotoPreview(result.data.basicInfo.profilePhotos);
        }
      }
    })();
  }, [isLoaded, isSignedIn, user, getToken]);

  const handleInputChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onDataChange(updated);
  };

  const handleOrientationSelect = (orientation: string) => {
    const updated = { ...formData, sexualOrientation: orientation };
    setFormData(updated);
    onDataChange(updated);
  };

  const handleLocationSelect = (location: string, coords: [number, number]) => {
    const updated = { ...formData, location };
    setFormData(updated);
    onDataChange(updated);
  };

  const handleMapPinClick = () => {
    if (!process.env.NEXT_PUBLIC_MAPTILER_KEY || process.env.NEXT_PUBLIC_MAPTILER_KEY === 'your_maptiler_api_key_here') {
      alert('MapTiler API key not configured. Please add NEXT_PUBLIC_MAPTILER_KEY to your .env.local file. See LOCATION_PICKER_SETUP.md for instructions.')
      return
    }
    setShowLocationPicker(true)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photoPreview.length > 6) {
      alert("Maximum 6 photos allowed");
      return;
    }
    setIsUploading(true);
    setStorageError(null);
    const uploadedUrls: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not a valid image file`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB`);
        continue;
      }
      const formDataUpload = new FormData();
      formDataUpload.append("photo", file);
      try {
        const res = await fetch("http://localhost:5000/api/users/upload-photo", {
          method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
        if (data.status === "success" && data.url) {
          uploadedUrls.push(data.url);
      } else {
          alert("Failed to upload photo. Please try again.");
        }
      } catch (err) {
        alert("Error uploading photo. Please try again.");
      }
    }
    const newPhotos = [...photoPreview, ...uploadedUrls];
    setPhotoPreview(newPhotos);
    const updated = { ...formData, profilePhotos: newPhotos };
    setFormData(updated);
    onDataChange(updated);
    setIsUploading(false);
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    const updatedPreviews = photoPreview.filter((_, i) => i !== index);
    setPhotoPreview(updatedPreviews);
    const updated = { ...formData, profilePhotos: updatedPreviews };
    setFormData(updated);
    setStorageError(null);
    onDataChange(updated);
  };

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
    const [draggedPreview] = newPreviews.splice(draggedIndex, 1)
    newPreviews.splice(dropIndex, 0, draggedPreview)
    setPhotoPreview(newPreviews)
    const updated = { ...formData, profilePhotos: newPreviews };
    setFormData(updated);
    onDataChange(updated);
    setDraggedIndex(null)
  }

  function extractBasicInfo(data: any) {
    return {
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      sexualOrientation: data.sexualOrientation,
      location: data.location,
      profilePhotos: data.profilePhotos,
    };
  }

  // Remove handleSave and the <form> wrapper. Instead, call onDataChange with the new values on every change.
  return (
    <div className="space-y-8">
      {storageError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{storageError}</AlertDescription>
        </Alert>
      )}
        <div className="space-y-6">
        <Label htmlFor="fullName" className="text-gray-700 font-medium">
          Full Name <span className="text-pink-500">*</span>
              </Label>
              <Input
          id="fullName"
                type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
              />
        <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
          Date of Birth <span className="text-pink-500">*</span>
              </Label>
              <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
        />
        <Label className="text-gray-700 font-medium">
          Gender <span className="text-pink-500">*</span>
              </Label>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map((gender) => (
            <Badge
              key={gender}
              variant={formData.gender === gender ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                formData.gender === gender
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                  : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
              }`}
              onClick={() => handleInputChange("gender", gender)}
            >
              {gender}
            </Badge>
          ))}
            </div>
        <Label className="text-gray-700 font-medium">
          Sexual Orientation <span className="text-pink-500">*</span>
              </Label>
        <p className="text-sm text-gray-500 mb-2">Select one</p>
        <div className="flex flex-wrap gap-2">
          {orientationOptions.map((orientation) => (
            <Badge
              key={orientation}
              variant={formData.sexualOrientation === orientation ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                formData.sexualOrientation === orientation
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                  : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
              }`}
              onClick={() => handleOrientationSelect(orientation)}
            >
              {orientation}
            </Badge>
          ))}
        </div>
        <Label htmlFor="location" className="text-gray-700 font-medium">
          Location <span className="text-pink-500">*</span>
              </Label>
              <div className="relative">
                <Input
            id="location"
                type="text"
            placeholder="Enter your city"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
                className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 pl-12 pr-12"
              />
              <MapPin 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-pink-500 transition-colors" 
                onClick={handleMapPinClick}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleMapPinClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2 text-xs text-gray-500 hover:text-pink-500"
              >
                Pick on Map
              </Button>
            </div>
          </div>
      {/* Profile Photos */}
      <div className="space-y-4">
        <Label className="text-gray-700 font-medium">
          Profile Photos <span className="text-pink-500">*</span>
              </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                <button
                  type="button"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white flex items-center justify-center"
                onClick={() => removePhoto(index)}
              >
                <X className="w-3 h-3" />
                </button>
              {index === 0 && <Badge className="absolute bottom-2 left-2 bg-pink-500 text-white text-xs">Main</Badge>}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
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
        </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
        currentLocation={formData.location}
      />
    </div>
  )
}

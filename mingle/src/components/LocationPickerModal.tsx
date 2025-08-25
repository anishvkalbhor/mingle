"use client"

import { Dialog } from "@headlessui/react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, X } from "lucide-react"

const MapViewer = dynamic(() => import("./MapViewer"), { ssr: false })

const mapStyles = [
  { name: "Streets", id: "streets-v2" },
  { name: "Satellite", id: "satellite" },
  { name: "Terrain", id: "topo-v2" },
  { name: "Hybrid", id: "hybrid" }
]

interface LocationPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: string, coords: [number, number]) => void
  currentLocation?: string
}

export const LocationPickerModal = ({ 
  isOpen, 
  onClose, 
  onLocationSelect,
  currentLocation 
}: LocationPickerModalProps) => {
  const [coords, setCoords] = useState<[number, number] | null>(null)
  const [layer, setLayer] = useState("streets-v2")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Try to get current location first
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Location error:", error)
          // Default to a central location if geolocation fails
          setCoords([40.7128, -74.0060]) // New York
        }
      )
    }
  }, [isOpen])

  const searchLocation = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}&limit=5`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const firstResult = data.features[0]
        const [lng, lat] = firstResult.center
        setCoords([lat, lng])
        setSelectedLocation(firstResult.place_name)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}&limit=1`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const location = data.features[0].place_name
        setSelectedLocation(location)
        setCoords([lat, lng])
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error)
    }
  }

  const handleConfirmLocation = () => {
    if (selectedLocation && coords) {
      onLocationSelect(selectedLocation, coords)
      onClose()
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchLocation(searchQuery)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-end sm:items-center justify-center px-4 sm:px-0">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-4xl p-6 max-h-[90vh] overflow-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Select Your Location</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for a city, state, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 text-gray-700"
              />
              <Button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 text-sm"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>

          {/* Selected Location Display */}
          {selectedLocation && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  Selected: {selectedLocation}
                </span>
              </div>
            </div>
          )}

          {/* Map Layer Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Map Style</label>
            <select
              value={layer}
              onChange={(e) => setLayer(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full text-gray-700"
            >
              {mapStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>

          {/* Map Container */}
          <div className="h-96 w-full rounded overflow-hidden border border-gray-200">
            {coords ? (
              <MapViewer 
                coords={coords} 
                layer={layer} 
                onMapClick={handleMapClick}
                showClickHandler={true}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-500">Loading map...</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>How to use:</strong> Search for a location or click anywhere on the map to select the nearest city. 
              The selected location will be automatically detected.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose} className="text-gray-700">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmLocation}
              disabled={!selectedLocation}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Confirm Location
            </Button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  )
} 
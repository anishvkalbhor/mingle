"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Search, X, Check } from "lucide-react"

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: any
  }
}

interface MapLocationPickerProps {
  currentLocation: string
  onLocationSelect: (location: string) => void
  trigger?: React.ReactNode
}

interface LocationResult {
  display_name: string
  lat: string
  lon: string
  address: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
  }
}

export default function MapLocationPicker({ 
  currentLocation, 
  onLocationSelect, 
  trigger 
}: MapLocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<LocationResult[]>([])
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }) // Default to NYC
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [googleMaps, setGoogleMaps] = useState<any>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)

  // Load Google Maps API
  useEffect(() => {
    if (!isOpen) return

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setGoogleMaps(window.google.maps)
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.google && window.google.maps) {
          setGoogleMaps(window.google.maps)
        }
      }
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [isOpen])

  // Initialize map
  useEffect(() => {
    if (!googleMaps || !mapRef.current || map) return

    const newMap = new googleMaps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 10,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    })

    // Add click listener to map
    newMap.addListener('click', (event: any) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      handleMapClick(lat, lng)
    })

    setMap(newMap)
  }, [googleMaps, mapCenter])

  // Get user's current location
  useEffect(() => {
    if (!isOpen) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.warn("Could not get user location:", error)
        }
      )
    }
  }, [isOpen])

  const handleMapClick = async (lat: number, lng: number) => {
    if (!googleMaps || !map) return

    // Update marker position
    setMarkerPosition({ lat, lng })

    // Remove existing marker
    if (marker) {
      marker.setMap(null)
    }

    // Add new marker
    const newMarker = new googleMaps.Marker({
      position: { lat, lng },
      map: map,
      title: 'Selected Location'
    })

    setMarker(newMarker)

    // Reverse geocode to get address
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      )
      const data = await response.json()
      
      if (data && data.address) {
        const locationData: LocationResult = {
          display_name: data.display_name,
          lat: lat.toString(),
          lon: lng.toString(),
          address: data.address
        }
        setSelectedLocation(locationData)
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error)
    }
  }

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      )
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error searching locations:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchLocation(searchQuery)
  }

  const handleLocationResultClick = (location: LocationResult) => {
    const lat = parseFloat(location.lat)
    const lng = parseFloat(location.lon)
    
    // Update map center and marker
    if (map) {
      map.setCenter({ lat, lng })
      map.setZoom(12)
    }
    
    handleMapClick(lat, lng)
    setSelectedLocation(location)
    setSearchResults([])
    setSearchQuery("")
  }

  const formatLocationString = (location: LocationResult) => {
    const { address } = location
    const city = address.city || address.town || address.village || ""
    const state = address.state || ""
    
    if (city && state) {
      return `${city}, ${state}`
    } else if (city) {
      return city
    } else if (state) {
      return state
    }
    
    return location.display_name.split(",")[0]
  }

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      const formattedLocation = formatLocationString(selectedLocation)
      onLocationSelect(formattedLocation)
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSearchQuery("")
    setSearchResults([])
    setSelectedLocation(null)
    setMarkerPosition(null)
    if (marker) {
      marker.setMap(null)
      setMarker(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-200 hover:border-pink-300 hover:bg-pink-50"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Choose Location on Map
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-pink-500" />
            Choose Your Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
          {/* Search Panel */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="location-search" className="text-sm font-medium">
                Search for a location
              </Label>
              <form onSubmit={handleSearchSubmit} className="mt-2">
                <div className="relative">
                  <Input
                    id="location-search"
                    type="text"
                    placeholder="Enter city or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    disabled={isLoading}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <Label className="text-sm font-medium">Search Results</Label>
                {searchResults.map((location, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:bg-pink-50 transition-colors"
                    onClick={() => handleLocationResultClick(location)}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm font-medium">
                        {formatLocationString(location)}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {location.display_name}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Selected Location */}
            {selectedLocation && (
              <Card className="border-pink-200 bg-pink-50">
                <CardContent className="p-3">
                  <Label className="text-sm font-medium text-pink-700">
                    Selected Location
                  </Label>
                  <p className="text-sm font-medium mt-1">
                    {formatLocationString(selectedLocation)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Click "Confirm Location" to use this location
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="text-xs text-gray-500">
              💡 Tip: You can also click directly on the map to select a location
            </div>
          </div>

          {/* Map */}
          <div className="md:col-span-2">
            <div
              ref={mapRef}
              className="w-full h-full rounded-lg border border-gray-200"
              style={{ minHeight: "400px" }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLocation}
            disabled={!selectedLocation}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Confirm Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Search, X, Check, Loader2 } from "lucide-react"

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
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const [leafletMap, setLeafletMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)

  // Load Leaflet for OpenStreetMap
  useEffect(() => {
    if (!isOpen || isMapLoaded) return

    const loadLeaflet = async () => {
      try {
        // Import Leaflet dynamically
        const L = await import('leaflet')
        
        // Set up default icon paths
        delete (L as any).Icon.Default.prototype._getIconUrl
        ;(L as any).Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        if (mapRef.current) {
          const map = L.map(mapRef.current, {
            center: [mapCenter.lat, mapCenter.lng],
            zoom: 10,
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            dragging: true,
            touchZoom: true,
            boxZoom: true,
            keyboard: true,
            tapTolerance: 15,
            closePopupOnClick: true,
            trackResize: true,
            inertia: true,
            inertiaDeceleration: 3000,
            inertiaMaxSpeed: 1500,
            easeLinearity: 0.25,
            maxBoundsViscosity: 0.0
          })
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            subdomains: ['a', 'b', 'c']
          }).addTo(map)

          // Add click handler with proper event handling
          map.on('click', function(e: any) {
            console.log('Map clicked at:', e.latlng) // Debug log
            handleMapClick(e.latlng.lat, e.latlng.lng)
          })

          // Add mobile touch support
          map.on('touchstart', function(e: any) {
            console.log('Map touched') // Debug log
          })

          // Force map to resize after initialization
          setTimeout(() => {
            map.invalidateSize()
          }, 100)

          setLeafletMap(map)
          setIsMapLoaded(true)
        }
      } catch (error) {
        console.error("Error loading map:", error)
        setIsMapLoaded(true) // Still set to true to avoid infinite loading
      }
    }

    // Add a small delay to ensure the dialog is fully open
    const timer = setTimeout(loadLeaflet, 200)
    return () => clearTimeout(timer)
  }, [isOpen, mapCenter])

  // Force map resize when dialog opens
  useEffect(() => {
    if (isOpen && leafletMap) {
      const timer = setTimeout(() => {
        leafletMap.invalidateSize()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, leafletMap])

  // Get user's current location
  useEffect(() => {
    if (!isOpen) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter({ lat: latitude, lng: longitude })
          
          // Update existing map center
          if (leafletMap) {
            leafletMap.setView([latitude, longitude], 12)
          }
        },
        (error) => {
          console.warn("Could not get user location:", error)
        }
      )
    }
  }, [isOpen, leafletMap])

  const handleMapClick = async (lat: number, lng: number) => {
    console.log('handleMapClick called with:', lat, lng) // Debug log
    
    if (!leafletMap) {
      console.log('No leaflet map available') // Debug log
      return
    }

    try {
      // Remove existing marker
      if (marker) {
        console.log('Removing existing marker') // Debug log
        leafletMap.removeLayer(marker)
      }

      // Add new marker
      const L = await import('leaflet')
      const newMarker = L.marker([lat, lng]).addTo(leafletMap)
      setMarker(newMarker)
      console.log('New marker added at:', lat, lng) // Debug log

      // Reverse geocode to get address
      console.log('Starting reverse geocoding...') // Debug log
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Reverse geocoding response:', data) // Debug log
      
      if (data && data.address) {
        const locationData: LocationResult = {
          display_name: data.display_name,
          lat: lat.toString(),
          lon: lng.toString(),
          address: data.address
        }
        setSelectedLocation(locationData)
        console.log('Location selected:', locationData) // Debug log
      } else {
        console.log('No address data found in response') // Debug log
      }
    } catch (error) {
      console.error("Error in handleMapClick:", error)
      
      // Even if geocoding fails, still place the marker and create a basic location
      try {
        const L = await import('leaflet')
        if (marker) {
          leafletMap.removeLayer(marker)
        }
        const newMarker = L.marker([lat, lng]).addTo(leafletMap)
        setMarker(newMarker)
        
        // Create a basic location object with coordinates
        const locationData: LocationResult = {
          display_name: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          lat: lat.toString(),
          lon: lng.toString(),
          address: {}
        }
        setSelectedLocation(locationData)
      } catch (markerError) {
        console.error("Error creating marker:", markerError)
      }
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
    
    // Update map center
    if (leafletMap) {
      leafletMap.setView([lat, lng], 12)
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
    console.log('Dialog closing, cleaning up...') // Debug log
    setIsOpen(false)
    setSearchQuery("")
    setSearchResults([])
    setSelectedLocation(null)
    
    // Clean up marker
    if (marker && leafletMap) {
      try {
        leafletMap.removeLayer(marker)
        setMarker(null)
      } catch (error) {
        console.warn('Error removing marker:', error)
      }
    }
  }

  // Reset map state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsMapLoaded(false)
      setSelectedLocation(null)
      setSearchQuery("")
      setSearchResults([])
      
      // Clean up map
      if (leafletMap) {
        try {
          leafletMap.remove()
          setLeafletMap(null)
          setMarker(null)
        } catch (error) {
          console.warn('Error cleaning up map:', error)
        }
      }
    }
  }, [isOpen])

  return (
  <>
    {/* Add Leaflet CSS dynamically */}
    {isOpen && (
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
    )}

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

      <DialogContent className="min-h-10/12 min-w-10/12 p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="flex items-center text-lg">
            <MapPin className="w-5 h-5 mr-2 text-pink-500" />
            Choose Your Location
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Sidebar Panel */}
          <div className="w-full lg:w-1/3 p-4 bg-gray-50 border-r overflow-y-auto scrollbar-thin scrollbar-thumb-pink-200">
            <div className="space-y-4">
              {/* Search */}
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
                      className="pr-12 h-10"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-pink-500 hover:bg-pink-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  <Label className="text-sm font-medium">Search Results</Label>
                  {searchResults.map((location, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:bg-pink-50 transition-colors border-gray-200"
                      onClick={() => handleLocationResultClick(location)}
                    >
                      <CardContent className="p-3">
                        <p className="text-sm font-medium text-gray-800">
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
                    <p className="text-sm font-medium mt-1 text-pink-800">
                      {formatLocationString(selectedLocation)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Click "Confirm Location" to use this location
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Instructions */}
              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800">How to use:</p>
                    <ul className="mt-1 space-y-1 text-blue-700 list-disc list-inside">
                      <li>Search for a city above</li>
                      <li>Click the Search Icon to search the location</li>
                      <li>Click "Confirm Location" when done</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative bg-gray-100 min-h-[500px] h-full">
            <div ref={mapRef} className="absolute inset-0" />
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-pink-500" />
                  <p className="text-sm text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t bg-white">
          <div className="text-xs text-gray-500 text-center sm:text-left">
            {selectedLocation ? (
              <span className="text-green-600 font-medium">
                ✓ Location selected: {formatLocationString(selectedLocation)}
              </span>
            ) : (
              "Select a location to continue"
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLocation}
              disabled={!selectedLocation}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex-1 sm:flex-none"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>
)
}

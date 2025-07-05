"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useRef } from "react"

interface Props {
  coords: [number, number]
  layer: string
}

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
})

const RecenterControl = ({ coords }: { coords: [number, number] }) => {
  const map = useMap()

  return (
    <button
      className="absolute bottom-3 right-3 bg-white border border-gray-300 text-sm px-3 py-1 rounded shadow hover:bg-gray-100 z-[1000]"
      onClick={() => map.setView(coords, map.getZoom(), { animate: true })}
    >
      Recenter
    </button>
  )
}

export default function MapViewer({ coords, layer }: Props) {
  const mapRef = useRef(null)

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={coords}
        zoom={20}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/${layer}/256/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
          attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
        />
        <Marker position={coords}>
          <Popup>You are here!</Popup>
        </Marker>
        <RecenterControl coords={coords} />
      </MapContainer>
    </div>
  )
}

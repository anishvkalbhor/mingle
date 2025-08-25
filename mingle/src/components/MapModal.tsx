"use client"

import { Dialog } from "@headlessui/react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const MapViewer = dynamic(() => import("./MapViewer"), { ssr: false })

const mapStyles = [
  { name: "Streets", id: "streets-v2" },
  { name: "Satellite", id: "satellite" },
  { name: "Terrain", id: "topo-v2" },
  { name: "Hybrid", id: "hybrid" }
]

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
}

export const MapModal = ({ isOpen, onClose }: MapModalProps) => {
  const [coords, setCoords] = useState<[number, number] | null>(null)
  const [layer, setLayer] = useState("streets-v2")

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Location error:", error)
        }
      )
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-end sm:items-center justify-center px-4 sm:px-0">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-3xl p-6 max-h-[90vh] overflow-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Current Location</h2>
            <button
              onClick={onClose}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Close
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Map Layer</label>
            <select
              value={layer}
              onChange={(e) => setLayer(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              {mapStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-96 w-full rounded overflow-hidden">
            {coords ? (
              <MapViewer coords={coords} layer={layer} />
            ) : (
              <p className="text-sm text-gray-500">Fetching your location...</p>
            )}
          </div>
        </motion.div>
      </div>
    </Dialog>
  )
}

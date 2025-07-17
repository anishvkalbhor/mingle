import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface DashboardCardProps {
  title: string
  icon: React.ReactNode
  value: string
  color: "pink" | "blue" | "green" | "yellow"
  trend?: string
}

const colorConfig = {
  pink: {
    gradient: "from-pink-500 to-rose-500",
    bg: "from-pink-500/10 to-rose-500/10",
    border: "border-pink-200",
    text: "text-pink-700"
  },
  blue: {
    gradient: "from-blue-500 to-indigo-500", 
    bg: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-200",
    text: "text-blue-700"
  },
  green: {
    gradient: "from-green-500 to-emerald-500",
    bg: "from-green-500/10 to-emerald-500/10", 
    border: "border-green-200",
    text: "text-green-700"
  },
  yellow: {
    gradient: "from-yellow-500 to-orange-500",
    bg: "from-yellow-500/10 to-orange-500/10",
    border: "border-yellow-200", 
    text: "text-yellow-700"
  }
}

export function DashboardCard({ title, icon, value, color, trend }: DashboardCardProps) {
  const config = colorConfig[color]

  return (
    <Card className="group shadow-lg border-0 bg-white/90 backdrop-blur-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bg}`}></div>
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {trend && (
              <div className="flex items-center">
                <TrendingUp className={`w-4 h-4 mr-1 ${config.text}`} />
                <span className={`text-sm font-medium ${config.text}`}>{trend}</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

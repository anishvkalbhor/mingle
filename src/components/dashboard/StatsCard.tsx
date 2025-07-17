
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: 'blue' | 'rose' | 'green' | 'purple';
}

export const StatsCard = ({ title, value, trend, icon, color }: StatsCardProps) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    rose: 'from-rose-500 to-rose-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  };

  const bgClasses = {
    blue: 'bg-blue-50',
    rose: 'bg-rose-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={cn(
            "p-2 rounded-lg",
            bgClasses[color]
          )}>
            <div className={cn(
              "p-1 rounded bg-gradient-to-r text-white",
              colorClasses[color]
            )}>
              {icon}
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-700 font-medium"
          >
            {trend}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-200">
            {value}
          </p>
          <p className="text-sm text-gray-600 font-medium">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
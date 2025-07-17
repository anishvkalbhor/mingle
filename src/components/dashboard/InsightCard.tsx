import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface InsightCardProps {
  message: string;
  icon: ReactNode;
}

export const InsightCard = ({ message, icon }: InsightCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
      <CardContent className="p-5 flex items-center gap-5">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg flex-shrink-0">
          {icon}
        </div>
        <p className="text-base font-semibold text-gray-800">{message}</p>
      </CardContent>
    </Card>
  );
};

import { InsightCard } from "./InsightCard";
import { Users, Smile, Moon, PawPrint } from "lucide-react";

const insights = [
  {
    message: "You engage more with humorous profiles.",
    icon: <Smile className="w-6 h-6" />,
  },
  {
    message: "You are most compatible with introverts.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    message: "Your most active time is in the evenings.",
    icon: <Moon className="w-6 h-6" />,
  },
  {
    message: "Profiles with pets catch your eye more often.",
    icon: <PawPrint className="w-6 h-6" />,
  },
];

export const InsightsSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">AI-Powered Insights ✨</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => (
          <InsightCard key={index} message={insight.message} icon={insight.icon} />
        ))}
      </div>
    </section>
  );
};

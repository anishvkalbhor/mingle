import { Card, CardContent } from '@/components/ui/card';
import { Users, Smile, Moon, PawPrint } from 'lucide-react';

const insights = [
  {
    message: 'You engage more with humorous profiles.',
    icon: <Smile className="w-6 h-6" />,
  },
  {
    message: 'You are most compatible with introverts.',
    icon: <Users className="w-6 h-6" />,
  },
  {
    message: 'Your most active time is in the evenings.',
    icon: <Moon className="w-6 h-6" />,
  },
  {
    message: 'Profiles with pets catch your eye more often.',
    icon: <PawPrint className="w-6 h-6" />,
  },
];

export const InsightsSection = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <span className="text-purple-500">⚛️</span> AI-Powered Insights <span className="text-yellow-400">✨</span>
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => (
          <Card key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
            <CardContent className="p-5 flex items-center gap-5">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg flex-shrink-0">
                {insight.icon}
              </div>
              <p className="text-base font-semibold text-gray-800">{insight.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}; 
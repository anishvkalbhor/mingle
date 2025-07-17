"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Bot } from 'lucide-react';

const features = [
  {
    icon: <Bot className="w-10 h-10 text-purple-500" />,
    title: 'AI-Powered Matching',
    description: 'Our smart algorithm connects you with the most compatible partners based on your personality, interests, and values.',
  },
  {
    icon: <Heart className="w-10 h-10 text-pink-500" />,
    title: 'Meaningful Connections',
    description: 'We focus on quality over quantity, helping you build deep, long-lasting relationships.',
  },
  {
    icon: <Users className="w-10 h-10 text-blue-500" />,
    title: 'Vibrant Community',
    description: 'Join a community of like-minded individuals who are serious about finding love and making new friends.',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Why Mingle?</h2>
          <p className="mt-4 text-lg text-gray-600">Discover a new way of dating.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-50 rounded-2xl">
              <CardContent>
                <div className="flex justify-center items-center mb-6">
                  <div className="p-4 bg-white rounded-full shadow-md">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Sarah & Tom',
    role: 'Found Love on Mingle',
    avatar: '/avatars/sarah-tom.jpg',
    testimonial: 'Mingle helped us find each other when we least expected it. The AI matching was spot on, and we connected on a level we never thought possible. We are now happily married!',
  },
  {
    name: 'Jessica L.',
    role: 'Mingle User',
    avatar: '/avatars/jessica.jpg',
    testimonial: "I was tired of the endless swiping on other apps. Mingle's focus on genuine connections made all the difference. I've met so many amazing people here.",
  },
  {
    name: 'Mike P.',
    role: 'Mingle User',
    avatar: '/avatars/mike.jpg',
    testimonial: 'The community is fantastic, and the app is so easy to use. I love the personality prompts—they really help break the ice and start meaningful conversations.',
  },
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Success Stories</h2>
          <p className="mt-4 text-lg text-gray-600">See what our users have to say.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
              <CardContent>
                <div className="flex items-center mb-6">
                  <Avatar className="w-16 h-16 mr-4 border-2 border-pink-200">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.testimonial}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

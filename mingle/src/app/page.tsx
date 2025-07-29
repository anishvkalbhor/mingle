'use client';

import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Heart, Users, Globe, Smile, Sparkles, MessageCircle, Shield, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [cardState, setCardState] = useState('horizontal'); // 'horizontal', 'stacked'
  const [currentCards, setCurrentCards] = useState([0, 1, 2]); // Track card order

  useEffect(() => {
    const fetchUser = async () => {
      if (isSignedIn && user) {
        const res = await fetch('/api/users/me');
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data?.data?.isAdmin || false);
        }
      }
    };
    fetchUser();
  }, [isSignedIn, user]);

  useEffect(() => {
    // Step 1: Start with horizontal layout
    const timer1 = setTimeout(() => {
      setCardState('horizontal');
    }, 500);

    // Step 2: Transition to stacked layout
    const timer2 = setTimeout(() => {
      setCardState('stacked');
    }, 2000);

    // Step 3: Start cycling animation
    const interval = setInterval(() => {
      setCurrentCards(prev => {
        const newCards = [...prev];
        const first = newCards.shift();
        newCards.push(first!);
        return newCards;
      });
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, []);

  const cardImages = [
    '/card1.png',
    '/card2.png', 
    '/card3.png'
  ];

  // Fallback colors for cards if images don't exist
  const cardColors = [
    'bg-gradient-to-br from-pink-400 to-purple-500',
    'bg-gradient-to-br from-purple-400 to-blue-500', 
    'bg-gradient-to-br from-blue-400 to-pink-500'
  ];

  const getCardStyle = (index: number) => {
    const baseStyle = "w-80 h-[500px] rounded-2xl bg-cover bg-center shadow-lg transition-all duration-1000 ease-in-out absolute";
    
    if (cardState === 'horizontal') {
      const positions = ['left-[5%]', 'left-[35%]', 'left-[65%]'];
      return `${baseStyle} ${positions[index]} opacity-100 scale-100`;
    } else {
      // Stacked layout
      const rotations = ['-rotate-12', 'rotate-0', 'rotate-12'];
      const zIndexes = ['z-30', 'z-20', 'z-10'];
      const transforms = [
        'translate-x-[-50%] translate-y-12',
        'translate-x-[-50%] translate-y-0', 
        'translate-x-[-50%] translate-y-12'
      ];
      return `${baseStyle} left-1/2 ${rotations[index]} ${zIndexes[index]} ${transforms[index]} opacity-100 scale-100`;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="py-6 px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Heart className="h-8 w-8 text-purple-500 fill-current" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
            <span className="text-2xl font-bold text-purple-600">
              Mingle
            </span>
          </div>
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-purple-600 underline font-medium">Home</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Features</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Contact</a>
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    LOGIN IN
                  </Button>
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    LOGIN IN
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    SIGNUP NOW
                  </Button>
                </SignUpButton>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Section */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Side - Text and Button */}
          <div className="flex-1 max-w-3xl -mt-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="font-normal">Find your love</span>
              <br />
              <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Delete all</span>
              <br />
              <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Dating apps</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl text-black font-bold">
              We designed a platform to find your love the most genuine way, <span className="font-bold">no more regret for no matches</span>
            </p>
            <div className="relative">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg px-16 py-4 rounded-full font-semibold uppercase tracking-wide min-w-[320px]"
                >
                  FIND YOUR LOVE
                </Button>
              </Link>
            </div>
            
            {/* Features Section - Moved to bottom of button area */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">10k+ Members</h3>
                <p className="text-gray-600 text-sm">Over thousands of people are using happyMatch.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart AI</h3>
                <p className="text-gray-600 text-sm">Best match based on an intelligent algorithm.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smile className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfect Match</h3>
                <p className="text-gray-600 text-sm">10k+ people are happy using our platform.</p>
              </div>
            </div>
          </div>

          {/* Right Side - Animated Cards */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-5xl h-[600px] -mt-8">
              {currentCards.map((cardIndex, index) => (
                <div
                  key={`${cardIndex}-${index}`}
                  className={`${getCardStyle(index)} ${cardColors[cardIndex]}`}
                  style={{
                    backgroundImage: `url(${cardImages[cardIndex]})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Success Stories Section */}
      <section className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800">Success Stories</h2>
            <p className="mt-4 text-lg text-gray-600">See what our users have to say.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah & Tom',
                role: 'Found Love on Mingle',
                avatar: '',
                testimonial: 'Mingle helped us find each other when we least expected it. The AI matching was spot on, and we connected on a level we never thought possible. We are now happily married!',
              },
              {
                name: 'Jessica L.',
                role: 'Mingle User',
                avatar: '',
                testimonial: "I was tired of the endless swiping on other apps. Mingle's focus on genuine connections made all the difference. I've met so many amazing people here.",
              },
              {
                name: 'Mike P.',
                role: 'Mingle User',
                avatar: '',
                testimonial: 'The community is fantastic, and the app is so easy to use. I love the personality prompts—they really help break the ice and start meaningful conversations.',
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                <CardContent>
                  <div className="flex items-center mb-6">
                    <Avatar className="w-16 h-16 mr-4 border-2 border-pink-200">
                      {testimonial.avatar ? (
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      ) : (
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      )}
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

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600">Have questions? We have answers.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                question: 'How does the AI matching work?',
                answer: 'Our AI algorithm analyzes your profile, preferences, and behavior to suggest the most compatible matches. It learns from your interactions to improve its recommendations over time.',
              },
              {
                question: 'Is Mingle safe and secure?',
                answer: 'Yes, we take your safety and privacy very seriously. We use advanced security measures to protect your data and have a dedicated team to monitor and remove fake profiles.',
              },
              {
                question: 'Can I use Mingle for free?',
                answer: 'Mingle offers a free tier that allows you to create a profile, browse matches, and send a limited number of messages. For unlimited access and advanced features, you can upgrade to our premium subscription.',
              },
              {
                question: 'What makes Mingle different from other dating apps?',
                answer: 'Mingle focuses on fostering genuine, long-term connections rather than casual hookups. Our AI-powered matching, in-depth profiles, and vibrant community set us apart.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl shadow p-6">
                <button
                  type="button"
                  className="w-full text-left flex justify-between items-center text-lg font-semibold focus:outline-none"
                  onClick={e => {
                    const content = document.getElementById(`faq-content-${idx}`);
                    if (content) content.classList.toggle('hidden');
                  }}
                >
                  {faq.question}
                  <span className="ml-2">▼</span>
                </button>
                <div id={`faq-content-${idx}`} className="mt-2 text-base text-gray-600 hidden">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isSignedIn && (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Find Your Person?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join Mingle today and start your journey to meaningful connections.
              </p>
              <SignUpButton mode="modal">
                <Button 
                  size="lg" 
                  className="bg-white text-pink-600 hover:bg-gray-100 text-lg px-8 py-4"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </SignUpButton>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-8 bg-white/80 border-t border-purple-100">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-purple-500 fill-current" />
            <span className="text-lg font-semibold text-purple-600">
              Mingle
            </span>
          </div>
          <p>&copy; 2025 Mingle. Making meaningful connections possible.</p>
        </div>
      </footer>
    </div>
  );
}
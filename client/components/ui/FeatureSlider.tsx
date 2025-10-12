import React, { useState, useEffect } from 'react';
import { ChevronRight, TrendingUp, DollarSign, Grid3X3, Sparkles, CheckCircle } from 'lucide-react';

interface FeatureCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  content: React.ReactNode;
}

const FeatureSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features: FeatureCard[] = [
    {
      id: 1,
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      title: "Higher Search Rankings",
      description: "Get your profile, services, and design work in front of clients searching for designers to hire.",
      content: (
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-8 h-48 lg:h-56 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-4 lg:px-6 lg:py-5 w-full max-w-md flex items-center gap-3">
            <span className="text-gray-600 text-base truncate">Landing Page Designers</span>
            <div className="ml-auto bg-pink-500 rounded-full p-2 flex-shrink-0">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      icon: <DollarSign className="h-5 w-5 text-purple-600" />,
      title: "No Fee Transactions",
      description: "Pay no fees when you transact on Dribbble (non-Pro users pay 3.5% of earnings).",
      content: (
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-8 h-48 lg:h-56 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-4 lg:px-6 lg:py-5 w-full max-w-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Project Cost</span>
              <span className="font-semibold text-base">$3,000</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Platform Fee</span>
              <span className="text-sm">- $105</span>
            </div>
            <div className="text-sm text-pink-600 mb-2">0% with PRO subscription.</div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="font-semibold text-sm">Total Payout</span>
              <span className="font-bold text-base">$3000</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      icon: <Grid3X3 className="h-5 w-5 text-purple-600" />,
      title: "Recommended to Clients",
      description: "Show up as a recommended designer for clients ready to hire now.",
      content: (
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-8 h-48 lg:h-56 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-4 lg:px-6 lg:py-5 w-full max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">Breno Bitencourt</span>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded flex-shrink-0">PRO</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">16 projects completed</span>
                </div>
              </div>
              <div className="bg-purple-600 rounded p-2 flex-shrink-0">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      icon: <Sparkles className="h-5 w-5 text-purple-600" />,
      title: "Advanced Profile Features",
      description: "Convert more leads by presenting yourself and your work in the best light.",
      content: (
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-8 h-48 lg:h-56 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-4 lg:px-6 lg:py-5 w-full max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">Kirk! Wallace</div>
                <div className="text-sm text-gray-600 truncate">Independent Art Studio</div>
                <div className="flex gap-2 lg:gap-3 mt-1.5 text-sm text-gray-500">
                  <span className="truncate">11,073 followers</span>
                  <span className="truncate">278 following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      icon: <CheckCircle className="h-5 w-5 text-purple-600" />,
      title: "Webflow for Free",
      description: "Get 12 months free of Webflow's Freelancer ($192 value) or Agency ($420 value) plans.",
      content: (
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-8 h-48 lg:h-56 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-4 lg:px-6 lg:py-5 w-full max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">Webflow Interface</div>
                <div className="text-sm text-gray-600 truncate">Design tool interface</div>
                <div className="text-sm text-gray-500 truncate mt-1">
                  Elements • Layouts • Structure
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden bg-gray-100 rounded-xl">
      {/* Slider Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {features.map((feature) => (
          <div key={feature.id} className="w-full flex-shrink-0 px-4 py-6"> 
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Content Card */}
              <div className="flex-1 max-w-sm">
                {feature.content}
              </div>
              
              {/* Feature Info */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  {feature.icon}
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 truncate">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-xs lg:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrow */}
      <button
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-1.5 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index === currentIndex ? 'bg-purple-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureSlider;

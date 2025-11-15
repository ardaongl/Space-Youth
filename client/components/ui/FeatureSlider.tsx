import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Coins, Users, Code, Play } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();

  const features: FeatureCard[] = [
    {
      id: 1,
      icon: <BookOpen className="h-5 w-5 text-blue-600" />,
      title: t('announcements.newCourse.title'),
      description: t('announcements.newCourse.description'),
      content: (
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 h-48 lg:h-56 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-4 lg:px-6 lg:py-5 w-full max-w-md flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 truncate">Space Technology Fundamentals</h4>
              <p className="text-xs text-gray-600 mt-1">Advanced Course • 4.8 ⭐</p>
              <button className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                {t('announcements.newCourse.action')}
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      icon: <Coins className="h-5 w-5 text-yellow-600" />,
      title: t('announcements.coinUpdate.title'),
      description: t('announcements.coinUpdate.description'),
      content: (
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-8 h-48 lg:h-56 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-4 lg:px-6 lg:py-5 w-full max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">{t('announcements.coinUpdate.title')}</h4>
                <p className="text-xs text-gray-600">Current Balance</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">1,250</div>
              <div className="text-xs text-gray-600 mb-3">{t('common.coins')} Available</div>
              <button className="bg-yellow-600 text-white text-xs px-4 py-2 rounded hover:bg-yellow-700 transition-colors">
                {t('announcements.coinUpdate.action')}
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      icon: <Users className="h-5 w-5 text-green-600" />,
      title: t('announcements.workshopAnnouncement.title'),
      description: t('announcements.workshopAnnouncement.description'),
      content: (
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-8 h-48 lg:h-56 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-4 lg:px-6 lg:py-5 w-full max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Design Thinking Workshop</h4>
                <p className="text-xs text-gray-600">March 15, 2024</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Limited Spots Available</div>
              <button className="bg-green-600 text-white text-xs px-4 py-2 rounded hover:bg-green-700 transition-colors">
                {t('announcements.workshopAnnouncement.action')}
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      icon: <Code className="h-5 w-5 text-purple-600" />,
      title: t('announcements.hackathonNews.title'),
      description: t('announcements.hackathonNews.description'),
      content: (
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-8 h-48 lg:h-56 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-4 lg:px-6 lg:py-5 w-full max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Space Innovation Hackathon</h4>
                <p className="text-xs text-gray-600">48 Hours • $10K Prize</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Registration Opens Soon</div>
              <button className="bg-purple-600 text-white text-xs px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                {t('announcements.hackathonNews.action')}
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      icon: <Play className="h-5 w-5 text-red-600" />,
      title: t('announcements.videoContent.title'),
      description: t('announcements.videoContent.description'),
      content: (
        <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-lg p-8 h-48 lg:h-56 flex items-center justify-center">
          <div className="bg-white rounded-lg px-5 py-4 lg:px-6 lg:py-5 w-full max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Play className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">New Video Series</h4>
                <p className="text-xs text-gray-600">50+ New Videos Added</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Tutorials & Lectures</div>
              <button className="bg-red-600 text-white text-xs px-4 py-2 rounded hover:bg-red-700 transition-colors">
                {t('announcements.videoContent.action')}
              </button>
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
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureSlider;

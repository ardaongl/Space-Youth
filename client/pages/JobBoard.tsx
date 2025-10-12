import AppLayout from "@/components/layout/AppLayout";
import { Briefcase, Rocket, Sparkles } from "lucide-react";

export default function JobBoard() {
  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Animated Logo */}
          <div className="flex justify-center animate-in fade-in zoom-in duration-700">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <img 
                src="/2.png" 
                alt="Space Youth Logo" 
                className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Coming Soon Title */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-bounce" />
              <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Job Board
              </h1>
              <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-pulse" />
            </div>
            
            <p className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 animate-in fade-in delay-300">
              Coming Soon
            </p>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-in fade-in delay-500">
              Uzay teknolojileri ve eğitim alanında kariyer fırsatlarını keşfetmeye hazır olun. 
              Yakında sizlerle!
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex items-center justify-center gap-6 animate-in fade-in delay-700">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-bounce" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Yakında Açılıyor
              </span>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 animate-in fade-in delay-1000">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse delay-100"></div>
            <div className="w-3 h-3 bg-pink-600 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </AppLayout>
  );
}

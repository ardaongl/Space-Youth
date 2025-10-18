import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAppDispatch } from '@/store';
import { setLanguage } from '@/store/slices/languageSlice';
import { Button } from '@/components/ui/button';
import { Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    shortName: 'EN'
  },
  {
    code: 'tr',
    name: 'Türkçe',
    flag: '🇹🇷',
    shortName: 'TR'
  }
];

export function LanguageSwitcher() {
  const { currentLanguage } = useLanguage();
  const dispatch = useAppDispatch();

  const switchToLanguage = (language: 'en' | 'tr') => {
    dispatch(setLanguage(language));
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 gap-2 hover:bg-secondary/50 transition-all duration-200"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-sm font-medium">{currentLang?.shortName}</span>
        <Globe className="h-3 w-3 opacity-60" />
      </Button>
      
      {/* Dropdown Menu */}
      <div className="absolute top-full right-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchToLanguage(lang.code as 'en' | 'tr')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors",
                "hover:bg-secondary/50",
                currentLanguage === lang.code 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground"
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1 text-left">
                <div className="font-medium">{lang.name}</div>
                <div className="text-xs text-muted-foreground">{lang.shortName}</div>
              </div>
              {currentLanguage === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

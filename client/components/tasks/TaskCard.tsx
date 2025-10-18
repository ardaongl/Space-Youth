import React from "react";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface TaskCardProps {
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  type: "BRIEF";
  category: "UX" | "PM" | "Other";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function TaskCard({
  title,
  description,
  duration,
  level,
  type,
  icon,
  href,
}: TaskCardProps) {
  const { t } = useLanguage();
  
  const getLevelTranslation = (level: string) => {
    switch (level) {
      case "Beginner": return t('tasks.beginner');
      case "Intermediate": return t('tasks.intermediate');
      case "Advanced": return t('tasks.advanced');
      default: return level;
    }
  };

  const getTypeTranslation = (type: string) => {
    switch (type) {
      case "BRIEF": return t('tasks.brief');
      default: return type;
    }
  };

  return (
    <Link
      to={href}
      className="group block overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary"
    >
      <div className="aspect-[2/1.4] flex items-center justify-center bg-muted/30 p-8">
        <div className="w-24 h-24 text-muted-foreground group-hover:text-primary transition-colors">
          {React.createElement(icon, { className: "w-full h-full" })}
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {getTypeTranslation(type)}
            </span>
          </div>
          <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <span>•</span>
          <span>{getLevelTranslation(level)}</span>
        </div>
      </div>
    </Link>
  );
}

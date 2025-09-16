import { cn } from "@/lib/utils";

interface StreakStarsProps {
  completedCount: number;
  totalStars?: number;
}

export function StreakStars({ completedCount, totalStars = 5 }: StreakStarsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalStars }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "relative h-3 w-3 rounded-full transition-all duration-300",
            index < completedCount
              ? "bg-gradient-to-r from-amber-300 to-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
              : "bg-muted"
          )}
        >
          {index < completedCount && (
            <>
              {/* Inner glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-200 to-transparent opacity-50" />
              
              {/* Shine effect */}
              <div className="absolute -inset-1/4 animate-pulse">
                <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-sm" />
              </div>
              
              {/* Sparkle effect */}
              <div className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-white opacity-70" />
            </>
          )}
        </div>
      ))}
      <span className="ml-1 text-sm font-medium bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
        {completedCount}/{totalStars}
      </span>
    </div>
  );
}
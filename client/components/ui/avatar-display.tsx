import { cn } from "@/lib/utils";

interface AvatarDisplayProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const sizeClasses = {
  sm: "h-9 w-9 text-sm",
  md: "h-16 w-16 text-xl",
  lg: "h-24 w-24 text-2xl",
  xl: "h-32 w-32 text-4xl",
};

export function AvatarDisplay({ name, size = "sm", className }: AvatarDisplayProps) {
  const initials = getInitials(name);
  
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center font-bold",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}


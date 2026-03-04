import { useEffect, useState } from "react";
import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STATUSES = [
  { text: "Connecting to calendar...", duration: 1000 },
  { text: "Reserving your time slot...", duration: 1200 },
  { text: "Sending confirmation...", duration: 1000 },
  { text: "Meeting booked!", duration: 800 },
];

interface BookingLoadingAnimationProps {
  onComplete: () => void;
  isRescheduling?: boolean;
  compact?: boolean;
}

const BookingLoadingAnimation = ({ onComplete, isRescheduling = false, compact = false }: BookingLoadingAnimationProps) => {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const statuses = isRescheduling
    ? [
        { text: "Connecting to calendar...", duration: 1000 },
        { text: "Updating your time slot...", duration: 1200 },
        { text: "Sending updated confirmation...", duration: 1000 },
        { text: "Meeting rescheduled!", duration: 800 },
      ]
    : STATUSES;

  useEffect(() => {
    if (currentStatus >= statuses.length) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentStatus((prev) => prev + 1);
        setFadeIn(true);
      }, 200);
    }, statuses[currentStatus].duration);

    return () => clearTimeout(timer);
  }, [currentStatus, statuses, onComplete]);

  const progress = Math.min(((currentStatus + 1) / statuses.length) * 100, 100);
  const isDone = currentStatus >= statuses.length - 1;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      compact ? "py-8 px-4" : "py-16 px-8"
    )}>
      {/* Animated logo */}
      <div className={cn(
        "relative mb-8",
        compact ? "mb-5" : "mb-8"
      )}>
        <div className={cn(
          "rounded-full bg-primary/10 flex items-center justify-center animate-pulse",
          compact ? "w-20 h-20" : "w-28 h-28"
        )}>
          <img
            src={RevenuegridLogo}
            alt="Revenue Grid"
            className={cn(
              "object-contain",
              compact ? "h-8" : "h-12",
              "animate-[spin_3s_linear_infinite]"
            )}
            style={{ animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </div>
        {isDone && (
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 animate-scale-in">
            <Check className={cn("text-primary-foreground", compact ? "w-4 h-4" : "w-5 h-5")} />
          </div>
        )}
      </div>

      {/* Status text */}
      <p className={cn(
        "font-medium text-foreground transition-opacity duration-200 text-center",
        compact ? "text-sm mb-4" : "text-lg mb-6",
        fadeIn ? "opacity-100" : "opacity-0"
      )}>
        {currentStatus < statuses.length ? statuses[currentStatus].text : statuses[statuses.length - 1].text}
      </p>

      {/* Progress bar */}
      <div className={cn(
        "bg-muted rounded-full overflow-hidden",
        compact ? "w-48 h-1.5" : "w-64 h-2"
      )}>
        <div
          className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step dots */}
      <div className={cn("flex gap-2", compact ? "mt-3" : "mt-4")}>
        {statuses.map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-full transition-all duration-300",
              compact ? "w-1.5 h-1.5" : "w-2 h-2",
              i <= currentStatus ? "bg-primary" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default BookingLoadingAnimation;

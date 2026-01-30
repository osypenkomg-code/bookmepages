import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  compact?: boolean;
}

const StepIndicator = ({ steps, currentStep, compact = false }: StepIndicatorProps) => {
  // For compact mode (mobile with 4 steps), show only 3 steps at a time:
  // current step and the next 2, or previous and next if in the middle
  const getVisibleSteps = () => {
    if (!compact || steps.length <= 3) {
      return steps.map((step, index) => ({ step, originalIndex: index }));
    }
    
    // For 4 steps, show a sliding window of 3 steps
    let startIndex = Math.max(0, currentStep - 1);
    if (startIndex + 3 > steps.length) {
      startIndex = steps.length - 3;
    }
    
    return steps.slice(startIndex, startIndex + 3).map((step, i) => ({
      step,
      originalIndex: startIndex + i
    }));
  };

  const visibleSteps = getVisibleSteps();

  return (
    <div className={cn("flex items-center justify-center", compact ? "mb-4" : "mb-8")}>
      {visibleSteps.map(({ step, originalIndex }, displayIndex) => (
        <div key={step} className="flex items-center">
          {/* Step circle and label */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "rounded-full flex items-center justify-center font-medium transition-all duration-300",
                compact ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm",
                originalIndex < currentStep && "bg-primary text-primary-foreground",
                originalIndex === currentStep && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                originalIndex > currentStep && "bg-muted text-muted-foreground"
              )}
            >
              {originalIndex < currentStep ? (
                <Check className={compact ? "w-3 h-3" : "w-4 h-4"} />
              ) : (
                originalIndex + 1
              )}
            </div>
            <span className={cn(
              "font-medium whitespace-nowrap",
              compact ? "text-[10px] mt-1" : "text-xs mt-2",
              originalIndex <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </span>
          </div>
          
          {/* Connector line */}
          {displayIndex < visibleSteps.length - 1 && (
            <div className={cn("flex items-center", compact ? "h-7" : "h-9")}>
              <div
                className={cn(
                  "h-0.5 transition-all duration-300",
                  compact ? "w-6 mx-1.5" : "w-16 md:w-24 mx-2",
                  originalIndex < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;

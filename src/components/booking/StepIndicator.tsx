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
    <div className="flex items-center justify-center mb-8">
      {visibleSteps.map(({ step, originalIndex }, displayIndex) => (
        <div key={step} className="flex items-center">
          {/* Step circle and label */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                originalIndex < currentStep && "bg-primary text-primary-foreground",
                originalIndex === currentStep && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                originalIndex > currentStep && "bg-muted text-muted-foreground"
              )}
            >
              {originalIndex < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                originalIndex + 1
              )}
            </div>
            <span className={cn(
              "text-xs mt-2 font-medium whitespace-nowrap",
              originalIndex <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </span>
          </div>
          
          {/* Connector line */}
          {displayIndex < visibleSteps.length - 1 && (
            <div className="flex items-center h-9">
              <div
                className={cn(
                  "h-0.5 mx-2 transition-all duration-300",
                  compact ? "w-8" : "w-16 md:w-24",
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

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          {/* Step circle and label */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                index < currentStep && "bg-primary text-primary-foreground",
                index === currentStep && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                index > currentStep && "bg-muted text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <span className={cn(
              "text-xs mt-2 font-medium whitespace-nowrap",
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </span>
          </div>
          
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="flex items-center h-9">
              <div
                className={cn(
                  "w-16 md:w-24 h-0.5 mx-3 transition-all duration-300",
                  index < currentStep ? "bg-primary" : "bg-muted"
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

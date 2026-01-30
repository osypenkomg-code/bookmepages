import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";
import StepIndicator from "./StepIndicator";
import LocationSelector, { LocationType } from "./LocationSelector";
import BookingCalendar from "./BookingCalendar";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  notes: string;
}

const TIME_SLOTS = [
  { time: "09:00 AM", available: true },
  { time: "09:30 AM", available: true },
  { time: "10:00 AM", available: false },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: true },
  { time: "02:00 PM", available: true },
  { time: "02:30 PM", available: true },
  { time: "03:00 PM", available: true },
  { time: "06:30 PM", available: true },
  { time: "07:00 PM", available: true },
  { time: "07:30 PM", available: true },
];

const LOCATION_NAMES: Record<LocationType, string> = {
  zoom: "Zoom",
  teams: "Microsoft Teams",
  "google-meet": "Google Meet",
};

export type PlatformMode = "full" | "custom" | "disabled";

interface BookingWizardProps {
  title?: string;
  duration?: string;
  organizerName?: string;
  organizerEmail?: string;
  timezone?: string;
  isRescheduling?: boolean;
  isMobilePreview?: boolean;
  platformMode?: PlatformMode;
  onComplete?: () => void;
}

const BookingWizard = ({
  title = "Test BookMe shortening #1",
  duration = "30min",
  organizerName = "Maksym Osypenko",
  organizerEmail = "maksym.osypenko@revenuegrid.com",
  timezone = "(UTC +02:00) Kyiv",
  isRescheduling = false,
  isMobilePreview = false,
  platformMode = "full",
  onComplete,
}: BookingWizardProps) => {
  // Auto-select today or next available date (27th for demo)
  const getInitialDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // For demo, dates from 27th onwards are available
    if (today.getDate() >= 27) {
      return today;
    }
    // Otherwise select the 27th of current month
    return new Date(today.getFullYear(), today.getMonth(), 27);
  };

  const isMobileHook = useIsMobile();
  // Use prop override if set, otherwise fall back to hook
  const isMobile = isMobilePreview || isMobileHook;
  
  // Show platform step for "full" and "custom" modes, skip for "disabled"
  const showPlatformStep = platformMode !== "disabled";
  
  // Define steps based on device and platform selection setting
  const getSteps = () => {
    if (isMobile) {
      return showPlatformStep 
        ? ["Date", "Time", "Platform", "Details"]
        : ["Date", "Time", "Details"];
    } else {
      return showPlatformStep 
        ? ["Date & Time", "Platform", "Details"]
        : ["Date & Time", "Details"];
    }
  };
  
  const steps = getSteps();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(getInitialDate());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  // Default to Teams when platform selection is disabled
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    platformMode === "disabled" ? "teams" : platformMode === "custom" ? null : "zoom"
  );
  const [customLocation, setCustomLocation] = useState("");
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: isRescheduling ? "John Doe" : "",
    email: isRescheduling ? "john.doe@example.com" : "",
    phoneNumber: "",
    notes: "",
  });

  // Get the display name for the location
  const getLocationDisplay = () => {
    if (platformMode === "custom") {
      return customLocation || "Custom location";
    }
    return selectedLocation ? LOCATION_NAMES[selectedLocation] : "Not selected";
  };

  // Map current step to logical step based on device and platform selection
  const getLogicalStep = () => {
    if (isMobile) {
      if (showPlatformStep) {
        // Mobile with platform: 0=Date, 1=Time, 2=Platform, 3=Details
        return currentStep;
      } else {
        // Mobile without platform: 0=Date, 1=Time, 2=Details
        // Map to logical: 0, 1, 3 (skip 2)
        if (currentStep === 0) return 0;
        if (currentStep === 1) return 1;
        return 3;
      }
    } else {
      if (showPlatformStep) {
        // Desktop with platform: 0=Date&Time, 1=Platform, 2=Details → map to 0, 2, 3
        if (currentStep === 0) return 0;
        if (currentStep === 1) return 2;
        return 3;
      } else {
        // Desktop without platform: 0=Date&Time, 1=Details → map to 0, 3
        if (currentStep === 0) return 0;
        return 3;
      }
    }
  };

  const canProceed = () => {
    const logicalStep = getLogicalStep();
    if (isMobile) {
      switch (logicalStep) {
        case 0: return selectedDate !== null;
        case 1: return selectedTime !== null;
        case 2: 
          // For custom mode, require custom location text
          if (platformMode === "custom") return customLocation.trim() !== "";
          return selectedLocation !== null;
        case 3: return formData.email.trim() !== "";
        default: return false;
      }
    } else {
      // Desktop: step 0 needs both date and time
      if (logicalStep === 0) return selectedDate !== null && selectedTime !== null;
      if (logicalStep === 2) {
        if (platformMode === "custom") return customLocation.trim() !== "";
        return selectedLocation !== null;
      }
      if (logicalStep === 3) return formData.email.trim() !== "";
      return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length - 1) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: isRescheduling ? "Meeting Rescheduled!" : "Meeting Booked!",
      description: `Your meeting has been ${isRescheduling ? "rescheduled" : "confirmed"} for ${selectedDate?.toLocaleDateString()} at ${selectedTime} via ${getLocationDisplay()}.`,
    });
    onComplete?.();
  };

  const handleFormChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderTimeSlots = () => (
    <>
      {selectedDate && (
        <>
          <p className={cn("text-muted-foreground", isMobile ? "text-xs mb-1" : "text-sm mb-2")}>
            {formatDate(selectedDate)}
          </p>
          <p className={cn("text-xs text-muted-foreground", isMobile ? "mb-2" : "mb-4")}>{timezone}</p>
          <div className={cn("grid grid-cols-2 w-full", isMobile ? "gap-1.5" : "gap-2")}>
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={cn(
                  "rounded-lg border-2 font-medium transition-all duration-200",
                  isMobile ? "py-2 px-2 text-xs" : "py-2.5 px-3 text-sm",
                  selectedTime === slot.time
                    ? "border-primary bg-primary text-primary-foreground"
                    : slot.available
                      ? "border-border hover:border-primary/50 text-foreground"
                      : "border-border/50 text-muted-foreground/50 cursor-not-allowed line-through"
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );

  const renderPlatformStep = () => (
    <div className="flex flex-col items-center px-2 w-full">
      <h2 className={cn(
        "font-semibold text-foreground text-center",
        isMobile ? "text-lg mb-3" : "text-xl mb-6"
      )}>
        {platformMode === "custom" ? "Enter meeting location" : "Choose meeting platform"}
      </h2>
      
      {platformMode === "custom" ? (
        <div className={cn("w-full", isMobile ? "max-w-xs" : "max-w-md")}>
          <div className="space-y-2">
            <Label htmlFor="customLocation" className={isMobile ? "text-xs" : undefined}>
              Meeting link or location
            </Label>
            <Input
              id="customLocation"
              placeholder="https://meet.example.com/abc or Room 101"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              className={isMobile ? "h-10 text-sm" : "h-12"}
            />
            <p className={cn("text-muted-foreground", isMobile ? "text-[10px]" : "text-xs")}>
              Enter a video call link, phone number, or physical address
            </p>
          </div>
        </div>
      ) : (
        <LocationSelector
          selected={selectedLocation}
          onChange={setSelectedLocation}
          compact={isMobile}
        />
      )}
    </div>
  );

  const renderDetailsStep = () => (
    <div className={cn("w-full px-2", isMobile ? "max-w-sm" : "max-w-md")}>
      <h2 className={cn(
        "font-semibold text-foreground text-center",
        isMobile ? "text-lg mb-3" : "text-xl mb-6"
      )}>
        {isRescheduling ? "Confirm details" : "Your details"}
      </h2>
      
      {/* Summary - more compact on mobile */}
      <div className={cn(
        "bg-secondary/50 rounded-xl space-y-1",
        isMobile ? "p-3 mb-3" : "p-4 mb-6 space-y-2"
      )}>
        <div className={cn("flex items-center gap-2", isMobile ? "text-xs" : "text-sm")}>
          <Calendar className={cn("text-primary", isMobile ? "w-3 h-3" : "w-4 h-4")} />
          <span>{selectedDate && formatDate(selectedDate)}</span>
        </div>
        <div className={cn("flex items-center gap-2", isMobile ? "text-xs" : "text-sm")}>
          <Clock className={cn("text-primary", isMobile ? "w-3 h-3" : "w-4 h-4")} />
          <span>{selectedTime} ({duration})</span>
        </div>
        <div className={cn("flex items-center gap-2", isMobile ? "text-xs" : "text-sm")}>
          <MapPin className={cn("text-primary", isMobile ? "w-3 h-3" : "w-4 h-4")} />
          <span className="truncate">{getLocationDisplay()}</span>
        </div>
        <div className={cn("flex items-center gap-2", isMobile ? "text-xs" : "text-sm")}>
          <User className={cn("text-primary", isMobile ? "w-3 h-3" : "w-4 h-4")} />
          <span>{organizerName}</span>
        </div>
      </div>

      <form className={cn(isMobile ? "space-y-2" : "space-y-4")}>
        <div className="space-y-1">
          <Label htmlFor="fullName" className={isMobile ? "text-xs" : undefined}>Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => handleFormChange("fullName", e.target.value)}
            className={isMobile ? "h-9 text-sm" : "h-11"}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className={isMobile ? "text-xs" : undefined}>
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleFormChange("email", e.target.value)}
            className={isMobile ? "h-9 text-sm" : "h-11"}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone" className={isMobile ? "text-xs" : undefined}>Phone number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phoneNumber}
            onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
            className={isMobile ? "h-9 text-sm" : "h-11"}
          />
        </div>

        {/* Hide notes on mobile to save space */}
        {!isMobile && (
          <div className="space-y-2">
            <Label htmlFor="notes">
              {isRescheduling ? "Reason for rescheduling (optional)" : "Notes (optional)"}
            </Label>
            <Textarea
              id="notes"
              placeholder={isRescheduling ? "Why are you rescheduling?" : "Anything you'd like to discuss?"}
              value={formData.notes}
              onChange={(e) => handleFormChange("notes", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        )}
      </form>
    </div>
  );

  const renderStepContent = () => {
    if (isMobile) {
      // Mobile: steps depend on whether platform selection is shown
      if (showPlatformStep) {
        // 4 steps: Date, Time, Platform, Details
        switch (currentStep) {
          case 0:
            return (
              <div className="flex flex-col items-center w-full px-2">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  {isRescheduling ? "Select a new date" : "Select a date"}
                </h2>
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  compact={true}
                />
              </div>
            );
          case 1:
            return (
              <div className="flex flex-col items-center w-full max-w-xs px-2">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {isRescheduling ? "Select a new time" : "Select a time"}
                </h2>
                {renderTimeSlots()}
              </div>
            );
          case 2:
            return renderPlatformStep();
          case 3:
            return renderDetailsStep();
          default:
            return null;
        }
      } else {
        // 3 steps: Date, Time, Details (skip platform)
        switch (currentStep) {
          case 0:
            return (
              <div className="flex flex-col items-center w-full px-2">
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  {isRescheduling ? "Select a new date" : "Select a date"}
                </h2>
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  compact={true}
                />
              </div>
            );
          case 1:
            return (
              <div className="flex flex-col items-center w-full max-w-xs px-2">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {isRescheduling ? "Select a new time" : "Select a time"}
                </h2>
                {renderTimeSlots()}
              </div>
            );
          case 2:
            return renderDetailsStep();
          default:
            return null;
        }
      }
    } else {
      // Desktop: steps depend on whether platform selection is shown
      if (showPlatformStep) {
        // 3 steps: Date & Time, Platform, Details
        switch (currentStep) {
          case 0:
            return (
              <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full px-2">
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    {isRescheduling ? "Select a new date & time" : "Select a date & time"}
                  </h2>
                  <BookingCalendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                  />
                </div>
                <div className="flex flex-col items-center w-full max-w-xs">
                  {renderTimeSlots()}
                </div>
              </div>
            );
          case 1:
            return renderPlatformStep();
          case 2:
            return renderDetailsStep();
          default:
            return null;
        }
      } else {
        // 2 steps: Date & Time, Details (skip platform)
        switch (currentStep) {
          case 0:
            return (
              <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full px-2">
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    {isRescheduling ? "Select a new date & time" : "Select a date & time"}
                  </h2>
                  <BookingCalendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                  />
                </div>
                <div className="flex flex-col items-center w-full max-w-xs">
                  {renderTimeSlots()}
                </div>
              </div>
            );
          case 1:
            return renderDetailsStep();
          default:
            return null;
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header - compact on mobile with meeting info */}
      <header className={cn(
        "px-4 flex items-center justify-between border-b border-border bg-card",
        isMobile ? "py-2" : "py-4 px-6"
      )}>
        <img src={RevenuegridLogo} alt="Revenue Grid" className={isMobile ? "h-5" : "h-7"} />
        <div className="flex items-center gap-2">
          {isRescheduling && (
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium",
              isMobile ? "text-xs" : "text-sm px-3 py-1"
            )}>
              Rescheduling
            </span>
          )}
          <div className="text-right">
            <p className={cn("font-medium text-foreground", isMobile ? "text-xs" : "text-sm")}>{title}</p>
            <p className={cn("text-muted-foreground", isMobile ? "text-[10px]" : "text-xs")}>{duration} • {organizerEmail}</p>
          </div>
        </div>
      </header>

      <div className={cn(
        "flex-1 flex items-start justify-center",
        isMobile ? "p-2 pt-1" : "p-4 md:p-8 mt-12"
      )}>
        <div className={cn(
          "bg-card rounded-2xl shadow-lg border border-border w-full max-w-2xl overflow-hidden",
          isMobile && "rounded-xl"
        )}>
          <div className={cn(
            isMobile ? "p-2 pb-3" : "p-6 md:p-10"
          )}>
            <StepIndicator steps={steps} currentStep={currentStep} compact={isMobile} />
            
            <div className={cn(
              "flex items-center justify-center",
              isMobile ? "min-h-0" : "min-h-[400px]"
            )}>
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className={cn(
              "flex items-center justify-between border-t border-border",
              isMobile ? "mt-3 pt-3" : "mt-8 pt-6"
            )}>
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  isMobile && "text-sm px-2"
                )}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className={cn(
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  isMobile ? "px-4 text-sm" : "px-6"
                )}
              >
                {currentStep === steps.length - 1 
                  ? (isRescheduling ? "Confirm Reschedule" : "Book Meeting")
                  : "Continue"
                }
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - hidden on mobile */}
      {!isMobile && (
        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-card">
          © 2026 RevenueGrid.com. All Rights Reserved.
        </footer>
      )}
    </div>
  );
};

export default BookingWizard;

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

interface BookingFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  notes: string;
}

interface BookingWizardProps {
  title?: string;
  duration?: string;
  organizerName?: string;
  organizerEmail?: string;
  timezone?: string;
  isRescheduling?: boolean;
  onComplete?: () => void;
}

const STEPS = ["Date", "Time", "Platform", "Details"];

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

const BookingWizard = ({
  title = "Test BookMe shortening #1",
  duration = "30min",
  organizerName = "Maksym Osypenko",
  organizerEmail = "maksym.osypenko@revenuegrid.com",
  timezone = "(UTC +02:00) Kyiv",
  isRescheduling = false,
  onComplete,
}: BookingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType>("zoom");
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: isRescheduling ? "John Doe" : "",
    email: isRescheduling ? "john.doe@example.com" : "",
    phoneNumber: "",
    notes: "",
  });

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selectedDate !== null;
      case 1: return selectedTime !== null;
      case 2: return selectedLocation !== null;
      case 3: return formData.email.trim() !== "";
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === STEPS.length - 1) {
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
      description: `Your meeting has been ${isRescheduling ? "rescheduled" : "confirmed"} for ${selectedDate?.toLocaleDateString()} at ${selectedTime} via ${LOCATION_NAMES[selectedLocation]}.`,
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {isRescheduling ? "Select a new date" : "Select a date"}
            </h2>
            <BookingCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col items-center w-full max-w-md">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {isRescheduling ? "Select a new time" : "Select a time"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {selectedDate && formatDate(selectedDate)} • {timezone}
            </p>
            <div className="grid grid-cols-3 gap-3 w-full">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    "py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all duration-200",
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
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Choose meeting platform
            </h2>
            <LocationSelector
              selected={selectedLocation}
              onChange={setSelectedLocation}
            />
          </div>
        );

      case 3:
        return (
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              {isRescheduling ? "Confirm details" : "Your details"}
            </h2>
            
            {/* Summary */}
            <div className="bg-secondary/50 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{selectedDate && formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{selectedTime} ({duration})</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{LOCATION_NAMES[selectedLocation]}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-primary" />
                <span>{organizerName}</span>
              </div>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleFormChange("fullName", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-rg-coral">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phoneNumber}
                  onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                  className="h-11"
                />
              </div>

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
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between border-b border-border bg-card">
        <img src={RevenuegridLogo} alt="Revenue Grid" className="h-7" />
        <div className="flex items-center gap-4">
          {isRescheduling && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
              Rescheduling
            </span>
          )}
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{duration} • {organizerEmail}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 mt-12">
        <div className="bg-card rounded-2xl shadow-lg border border-border w-full max-w-2xl overflow-hidden">
          <div className="p-6 md:p-10">
            <StepIndicator steps={STEPS} currentStep={currentStep} />
            
            <div className="min-h-[400px] flex items-center justify-center">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                {currentStep === STEPS.length - 1 
                  ? (isRescheduling ? "Confirm Reschedule" : "Book Meeting")
                  : "Continue"
                }
                {currentStep < STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-card">
        © 2026 RevenueGrid.com. All Rights Reserved.
      </footer>
    </div>
  );
};

export default BookingWizard;

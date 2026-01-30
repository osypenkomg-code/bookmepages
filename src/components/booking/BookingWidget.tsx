import { useState } from "react";
import BookingHeader from "./BookingHeader";
import BookingCalendar from "./BookingCalendar";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingConfirmation, { BookingFormData } from "./BookingConfirmation";
import { toast } from "@/hooks/use-toast";
import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";

interface BookingWidgetProps {
  title?: string;
  duration?: string;
  location?: string;
  organizerName?: string;
  organizerEmail?: string;
  timezone?: string;
  isRescheduling?: boolean;
  isMobilePreview?: boolean;
  onComplete?: () => void;
}

const BookingWidget = ({
  title = "Test BookMe shortening #1",
  duration = "30min",
  location = "Zoom",
  organizerName = "Maksym Osypenko",
  organizerEmail = "maksym.osypenko@revenuegrid.com",
  timezone = "(UTC +02:00) Kyiv",
  isRescheduling = false,
  isMobilePreview = false,
  onComplete,
}: BookingWidgetProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 0, 27));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "confirm">("select");

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("confirm");
  };

  const handleBack = () => {
    setStep("select");
  };

  const handleConfirm = (formData: BookingFormData) => {
    toast({
      title: isRescheduling ? "Meeting Rescheduled!" : "Meeting Booked!",
      description: `Your meeting with ${organizerName} has been ${isRescheduling ? "rescheduled" : "confirmed"} for ${selectedDate?.toLocaleDateString()} at ${selectedTime}.`,
    });
    onComplete?.();
  };

  if (step === "confirm" && selectedDate && selectedTime) {
    return (
      <BookingConfirmation
        title={title}
        date={selectedDate}
        time={selectedTime}
        duration={duration}
        location={location}
        timezone={timezone}
        organizerName={organizerName}
        organizerEmail={organizerEmail}
        isMobilePreview={isMobilePreview}
        onBack={handleBack}
        onConfirm={handleConfirm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header for reschedule mode */}
      {isRescheduling && (
        <header className="py-4 px-6 flex items-center justify-between border-b border-border bg-card">
          <img src={RevenuegridLogo} alt="Revenue Grid" className="h-7" />
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
            Rescheduling
          </span>
        </header>
      )}

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 mt-12">
        <div className="bg-card rounded-2xl shadow-lg border border-border w-full max-w-4xl overflow-hidden">
          <div className="p-8 md:p-12">
            <BookingHeader
              title={title}
              duration={duration}
              location={location}
              organizerName={organizerName}
              organizerEmail={organizerEmail}
            />
            
            <div className={`grid gap-8 mt-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2 md:gap-12'}`}>
              {/* Calendar Section */}
              <div className="flex justify-center">
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>
              
              {/* Time Slots Section */}
              <div className={`flex justify-center ${isMobilePreview ? '' : 'md:justify-start'}`}>
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={handleTimeSelect}
                  timezone={timezone}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © 2026 RevenueGrid.com. All Rights Reserved.
      </footer>
    </div>
  );
};

export default BookingWidget;

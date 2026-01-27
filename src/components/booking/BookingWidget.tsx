import { useState } from "react";
import BookingHeader from "./BookingHeader";
import BookingCalendar from "./BookingCalendar";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingConfirmation, { BookingFormData } from "./BookingConfirmation";
import { toast } from "@/hooks/use-toast";

interface BookingWidgetProps {
  title?: string;
  duration?: string;
  location?: string;
  organizerName?: string;
  organizerEmail?: string;
  timezone?: string;
}

const BookingWidget = ({
  title = "Test BookMe shortening #1",
  duration = "30min",
  location = "Zoom",
  organizerName = "Maksym Osypenko",
  organizerEmail = "maksym.osypenko@revenuegrid.com",
  timezone = "(UTC +02:00) Kyiv",
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
      title: "Meeting Booked!",
      description: `Your meeting with ${organizerName} has been confirmed for ${selectedDate?.toLocaleDateString()} at ${selectedTime}.`,
    });
    console.log("Booking confirmed:", { date: selectedDate, time: selectedTime, ...formData });
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
        onBack={handleBack}
        onConfirm={handleConfirm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="bg-card rounded-2xl shadow-lg border border-border w-full max-w-4xl overflow-hidden">
          <div className="p-8 md:p-12">
            <BookingHeader
              title={title}
              duration={duration}
              location={location}
              organizerName={organizerName}
              organizerEmail={organizerEmail}
            />
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-8">
              {/* Calendar Section */}
              <div className="flex justify-center">
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>
              
              {/* Time Slots Section */}
              <div className="flex justify-center md:justify-start">
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

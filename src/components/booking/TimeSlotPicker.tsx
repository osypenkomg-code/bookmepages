import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  timeSlots?: TimeSlot[];
  timezone?: string;
}

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

const TimeSlotPicker = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  timeSlots = [
    { time: "06:30 PM", available: true },
    { time: "07:00 PM", available: true },
    { time: "07:30 PM", available: true },
  ],
  timezone = "(UTC +02:00) Kyiv",
}: TimeSlotPickerProps) => {
  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <p>Select a date to view available times</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs">
      <p className="text-sm text-muted-foreground mb-2">{formatDate(selectedDate)}</p>
      <h3 className="text-lg font-semibold text-rg-navy mb-2">What time works best?</h3>
      
      {/* Timezone Selector */}
      <button className="flex items-center gap-1 text-sm text-primary mb-6 hover:underline">
        {timezone}
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {/* Time Slots */}
      <div className="space-y-3">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => slot.available && onTimeSelect(slot.time)}
            disabled={!slot.available}
            className={cn(
              "w-full py-3 px-4 rounded-lg border-2 transition-all duration-200",
              "text-sm font-medium",
              selectedTime === slot.time
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50 text-primary",
              !slot.available && "opacity-50 cursor-not-allowed"
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
  compact?: boolean;
}

const DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BookingCalendar = ({
  selectedDate,
  onDateSelect,
  availableDates = [],
  compact = false,
}: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // January 2026

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);

  const isDateAvailable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // For demo, make dates from 27th onwards available
    return date >= today && day >= 27;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    if (isDateAvailable(day)) {
      onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const cellSize = compact ? "h-8 w-8" : "h-10 w-10";
    
    // Empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className={cellSize} />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const available = isDateAvailable(day);
      const selected = isDateSelected(day);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={!available}
          className={cn(
            cellSize,
            "rounded-full font-medium transition-all duration-200",
            "flex items-center justify-center",
            compact ? "text-xs" : "text-sm",
            selected && "bg-primary text-primary-foreground shadow-md",
            !selected && available && "text-primary hover:bg-primary/20 cursor-pointer",
            !available && "text-muted-foreground/40 cursor-not-allowed"
          )}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="w-full max-w-sm">
      {/* Month Navigation */}
      <div className={cn("flex items-center justify-center gap-4", compact ? "mb-2" : "mb-4")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className={cn("text-primary hover:bg-primary/10", compact ? "h-6 w-6" : "h-8 w-8")}
        >
          <ChevronLeft className={compact ? "h-3 w-3" : "h-4 w-4"} />
        </Button>
        <h2 className={cn(
          "font-semibold text-primary min-w-[140px] text-center",
          compact ? "text-base" : "text-lg min-w-[160px]"
        )}>
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className={cn("text-primary hover:bg-primary/10", compact ? "h-6 w-6" : "h-8 w-8")}
        >
          <ChevronRight className={compact ? "h-3 w-3" : "h-4 w-4"} />
        </Button>
      </div>
      
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className={cn(
              "flex items-center justify-center font-medium text-muted-foreground",
              compact ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default BookingCalendar;

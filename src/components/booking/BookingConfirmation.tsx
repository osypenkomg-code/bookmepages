import { useState } from "react";
import { Calendar, Clock, MapPin, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";

interface BookingConfirmationProps {
  title: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  timezone: string;
  organizerName: string;
  organizerEmail: string;
  isMobilePreview?: boolean;
  onBack: () => void;
  onConfirm: (formData: BookingFormData) => void;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  notes: string;
}

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

const BookingConfirmation = ({
  title,
  date,
  time,
  duration,
  location,
  timezone,
  organizerName,
  organizerEmail,
  isMobilePreview = false,
  onBack,
  onConfirm,
}: BookingConfirmationProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  const handleChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Parse time to create end time
  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    return { hours: period === "PM" && hours !== 12 ? hours + 12 : hours, minutes };
  };

  const getEndTime = () => {
    const { hours, minutes } = parseTime(time);
    const durationMinutes = parseInt(duration);
    const endMinutes = minutes + durationMinutes;
    const endHours = hours + Math.floor(endMinutes / 60);
    const finalMinutes = endMinutes % 60;
    const period = endHours >= 12 ? "PM" : "AM";
    const displayHours = endHours > 12 ? endHours - 12 : endHours;
    return `${displayHours}:${finalMinutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header with logo */}
      <div className="py-4 px-6">
        <img src={RevenuegridLogo} alt="Revenue Grid" className="h-8" />
      </div>

      <div className={`flex-1 flex items-center justify-center p-4 ${isMobilePreview ? '' : 'md:p-8'}`}>
        <div className="bg-card rounded-2xl shadow-lg border border-border w-full max-w-4xl overflow-hidden">
          <div className={`p-6 ${isMobilePreview ? '' : 'md:p-12'}`}>
            <h1 className={`text-2xl font-semibold text-rg-navy mb-6 ${isMobilePreview ? '' : 'md:text-3xl'}`}>
              Booking Confirmation
            </h1>

            <div className={`grid gap-6 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2 md:gap-12'}`}>
              {/* Left Column - Booking Details */}
              <div>
                <p className="text-muted-foreground mb-6">
                  You are booking "{title}"
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <span className="font-medium text-foreground">{formatDate(date)}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">
                        {time}-{getEndTime()}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        (Time zone: {timezone}).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <span className="font-medium text-foreground">{location}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground">Organizer</span>
                      <p className="text-foreground">{organizerName}</p>
                      <p className="text-sm text-muted-foreground">{organizerEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-rg-navy">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-rg-navy">
                    Email <span className="text-rg-coral">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-rg-navy">
                    Phone number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    By clicking the 'Book meeting' button, you consent to be contacted by the organizer
                    or an affiliated party at the phone number(s) you provided, even though you may be
                    on a Do Not Call Registry and/or it may be a wireless number.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-rg-navy">
                    Note Text
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Note Text"
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be sure not to include any personally identifiable information, such as social security
                    numbers, account numbers, or medical/health information
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    className="text-primary hover:bg-primary/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 h-auto text-base"
                  >
                    Book meeting
                  </Button>
                </div>
              </form>
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

export default BookingConfirmation;

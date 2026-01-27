import { useState } from "react";
import { Calendar, Clock, MapPin, User, CalendarX, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";

interface BookingDetails {
  title: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  timezone: string;
  attendeeName: string;
  attendeeEmail: string;
}

interface AttendeeViewProps {
  booking?: BookingDetails;
  onReschedule: () => void;
}

const defaultBooking: BookingDetails = {
  title: "Test BookMe shortening #1",
  date: new Date(2026, 0, 27),
  time: "06:30 PM",
  duration: "30min",
  location: "Zoom",
  organizerName: "Maksym Osypenko",
  organizerEmail: "maksym.osypenko@revenuegrid.com",
  timezone: "(UTC +02:00) Kyiv",
  attendeeName: "John Doe",
  attendeeEmail: "john.doe@example.com",
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const AttendeeView = ({ booking = defaultBooking, onReschedule }: AttendeeViewProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const cancelReasons = [
    "Schedule conflict",
    "No longer needed",
    "Found alternative solution",
    "Emergency/Personal reasons",
    "Other",
  ];

  const handleCancel = () => {
    const reason = selectedReason === "Other" ? cancelReason : selectedReason;
    toast({
      title: "Meeting Cancelled",
      description: `Your meeting has been cancelled. Reason: ${reason}`,
      variant: "destructive",
    });
    setShowCancelDialog(false);
    setCancelReason("");
    setSelectedReason(null);
  };

  const handleReschedule = () => {
    toast({
      title: "Rescheduling Meeting",
      description: "You'll now be redirected to select a new time.",
    });
    onReschedule();
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between border-b border-border bg-card">
        <img src={RevenuegridLogo} alt="Revenue Grid" className="h-7" />
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">Your Booking</p>
          <p className="text-xs text-muted-foreground">{booking.attendeeEmail}</p>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 mt-12">
        <div className="bg-card rounded-2xl shadow-lg border border-border w-full max-w-xl overflow-hidden">
          <div className="p-6 md:p-10">
            {/* Status Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Confirmed
              </span>
            </div>

            <h1 className="text-2xl font-semibold text-foreground text-center mb-2">
              {booking.title}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Your meeting is scheduled
            </p>

            {/* Booking Details */}
            <div className="bg-secondary/50 rounded-xl p-6 mb-8 space-y-4">
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{formatDate(booking.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{booking.time} ({booking.duration})</p>
                  <p className="text-sm text-muted-foreground">{booking.timezone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{booking.location}</p>
                  <p className="text-sm text-muted-foreground">Meeting link will be sent via email</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{booking.organizerName}</p>
                  <p className="text-sm text-muted-foreground">{booking.organizerEmail}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleReschedule}
                className="h-14 flex items-center justify-center gap-2 border-2 hover:border-primary hover:bg-primary/5"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Reschedule</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                className="h-14 flex items-center justify-center gap-2 border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive"
              >
                <CalendarX className="w-5 h-5" />
                <span>Cancel</span>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Need to make changes? Reschedule or cancel anytime before the meeting.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-card">
        © 2026 RevenueGrid.com. All Rights Reserved.
      </footer>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <CalendarX className="w-5 h-5" />
              Cancel Meeting
            </DialogTitle>
            <DialogDescription>
              Please let us know why you're cancelling. This helps the organizer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {cancelReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200",
                    selectedReason === reason
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-medium">{reason}</span>
                </button>
              ))}
            </div>

            {selectedReason === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="reason">Please specify</Label>
                <Textarea
                  id="reason"
                  placeholder="Tell us more..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Meeting
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={!selectedReason || (selectedReason === "Other" && !cancelReason.trim())}
            >
              Cancel Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendeeView;

import { useState } from "react";
import { Calendar, Clock, MapPin, User, CalendarX, RefreshCw, AlertCircle } from "lucide-react";
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingDetails {
  title: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  organizerName: string;
  organizerCompany: string;
  organizerEmail: string;
  timezone: string;
  timezoneShort: string;
  attendeeName: string;
  attendeeEmail: string;
  meetingLink?: string;
}

interface AttendeeViewProps {
  booking?: BookingDetails;
  onReschedule: () => void;
  isMobilePreview?: boolean;
  isExpired?: boolean;
}

const defaultBooking: BookingDetails = {
  title: "Test BookMe shortening #1",
  date: new Date(2026, 0, 27),
  time: "06:30 PM",
  duration: "30min",
  location: "Zoom",
  organizerName: "Maksym Osypenko",
  organizerCompany: "RevenueGrid",
  organizerEmail: "maksym.osypenko@revenuegrid.com",
  timezone: "(UTC +02:00) Kyiv",
  timezoneShort: "Kyiv time (UTC+2)",
  attendeeName: "John Doe",
  attendeeEmail: "john.doe@example.com",
  meetingLink: "https://zoom.us/j/123456789",
};

const formatDate = (date: Date, compact = false) => {
  if (compact) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const AttendeeView = ({ booking = defaultBooking, onReschedule, isMobilePreview = false, isExpired = false }: AttendeeViewProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  
  const isMobileHook = useIsMobile();
  const isMobile = isMobilePreview || isMobileHook;

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
      <header className={cn(
        "px-4 flex items-center justify-between border-b border-border bg-card",
        isMobile ? "py-2" : "py-4 px-6"
      )}>
        <img src={RevenuegridLogo} alt="Revenue Grid" className={isMobile ? "h-5" : "h-7"} />
        <div className="text-right">
          <p className={cn("font-medium text-foreground", isMobile ? "text-xs" : "text-sm")}>Your Booking</p>
          <p className={cn("text-muted-foreground", isMobile ? "text-[10px]" : "text-xs")}>{booking.attendeeEmail}</p>
        </div>
      </header>

      <div className={cn(
        "flex-1 flex items-start justify-center",
        isMobile ? "p-2 pt-2" : "p-4 md:p-8 mt-12"
      )}>
        <div className={cn(
          "bg-card rounded-2xl shadow-lg border border-border w-full max-w-xl overflow-hidden",
          isMobile && "rounded-xl"
        )}>
          <div className={cn(isMobile ? "p-3" : "p-6 md:p-10")}>
            {/* Status Badge */}
            <div className={cn("flex justify-center", isMobile ? "mb-2" : "mb-6")}>
              {isExpired ? (
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground font-medium",
                  isMobile ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm gap-2"
                )}>
                  <Clock className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                  Meeting Started
                </span>
              ) : (
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full bg-green-100 text-green-700 font-medium",
                  isMobile ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm gap-2"
                )}>
                  <span className={cn("rounded-full bg-green-500 animate-pulse", isMobile ? "w-1.5 h-1.5" : "w-2 h-2")}></span>
                  Confirmed
                </span>
              )}
            </div>

            <h1 className={cn(
              "font-semibold text-foreground text-center",
              isMobile ? "text-lg mb-1" : "text-2xl mb-2"
            )}>
              {booking.title}
            </h1>
            <p className={cn(
              "text-center text-muted-foreground",
              isMobile ? "text-xs mb-3" : "mb-8"
            )}>
              {isExpired ? "This meeting has already started" : "Your meeting is scheduled"}
            </p>

            {/* Booking Details */}
            <div className={cn(
              "bg-secondary/50 rounded-xl",
              isMobile ? "p-3 mb-3 space-y-2" : "p-6 mb-8 space-y-4"
            )}>
              <div className={cn("flex items-start", isMobile ? "gap-2" : "gap-4")}>
                <Calendar className={cn("text-primary mt-0.5", isMobile ? "w-4 h-4" : "w-5 h-5")} />
                <p className={cn("font-medium text-foreground", isMobile ? "text-xs" : "text-sm")}>
                  {formatDate(booking.date, isMobile)}
                </p>
              </div>

              <div className={cn("flex items-start", isMobile ? "gap-2" : "gap-4")}>
                <Clock className={cn("text-primary mt-0.5", isMobile ? "w-4 h-4" : "w-5 h-5")} />
                <div>
                  <p className={cn("font-medium text-foreground", isMobile ? "text-xs" : "text-sm")}>
                    {booking.time} ({booking.duration})
                  </p>
                  <p className={cn("text-muted-foreground", isMobile ? "text-[10px]" : "text-sm")}>{booking.timezoneShort}</p>
                </div>
              </div>

              <div className={cn("flex items-start", isMobile ? "gap-2" : "gap-4")}>
                <MapPin className={cn("text-primary mt-0.5", isMobile ? "w-4 h-4" : "w-5 h-5")} />
                <div>
                  <p className={cn("font-medium text-foreground", isMobile ? "text-xs" : "text-sm")}>{booking.location}</p>
                  {booking.meetingLink ? (
                    <a 
                      href={booking.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-1 text-primary hover:underline font-medium",
                        isMobile ? "text-[10px]" : "text-sm"
                      )}
                    >
                      Join meeting
                    </a>
                  ) : (
                    <p className={cn("text-muted-foreground", isMobile ? "text-[10px]" : "text-sm")}>
                      The meeting link will be included in the calendar invite.
                    </p>
                  )}
                </div>
              </div>

              <div className={cn("flex items-start", isMobile ? "gap-2" : "gap-4")}>
                <User className={cn("text-primary mt-0.5", isMobile ? "w-4 h-4" : "w-5 h-5")} />
                <div>
                  <p className={cn("font-medium text-foreground", isMobile ? "text-xs" : "text-sm")}>{booking.organizerName}</p>
                  <p className={cn("text-muted-foreground", isMobile ? "text-[10px]" : "text-sm")}>{booking.organizerCompany}</p>
                </div>
              </div>
            </div>

            {/* Expired Notice */}
            {isExpired && (
              <div className={cn(
                "bg-muted border border-border rounded-xl",
                isMobile ? "p-3 mb-3" : "p-5 mb-6"
              )}>
                <div className="flex items-start gap-2">
                  <AlertCircle className={cn(
                    "text-muted-foreground shrink-0",
                    isMobile ? "w-4 h-4 mt-0.5" : "w-5 h-5 mt-0.5"
                  )} />
                  <div>
                    <p className={cn(
                      "text-foreground font-medium",
                      isMobile ? "text-xs mb-0.5" : "text-sm mb-1"
                    )}>
                      Modifications are no longer available
                    </p>
                    <p className={cn(
                      "text-muted-foreground",
                      isMobile ? "text-xs leading-tight" : "text-sm"
                    )}>
                      This meeting has already started. If you need to make changes, please contact the organizer directly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={cn("grid grid-cols-2", isMobile ? "gap-2" : "gap-4")}>
              <Button
                onClick={handleReschedule}
                disabled={isExpired}
                className={cn(
                  "flex items-center justify-center gap-2",
                  isMobile ? "h-10 text-xs" : "h-14"
                )}
              >
                <RefreshCw className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
                <span>Reschedule</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                disabled={isExpired}
                className={cn(
                  "flex items-center justify-center gap-2 border-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive",
                  isMobile ? "h-10 text-xs" : "h-14",
                  isExpired && "border-border text-muted-foreground"
                )}
              >
                <CalendarX className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
                <span>Cancel</span>
              </Button>
            </div>

            {isExpired && (
              <div className={cn("flex justify-center", isMobile ? "mt-3" : "mt-6")}>
                <Button
                  variant="default"
                  className={cn(isMobile ? "h-9 text-xs" : "h-12")}
                  onClick={() => window.location.href = `mailto:${booking.organizerEmail}?subject=Regarding: ${booking.title}`}
                >
                  Contact Organizer
                </Button>
              </div>
            )}

            {!isMobile && !isExpired && (
              <p className="text-xs text-muted-foreground text-center mt-6">
                You can reschedule or cancel until the host's cutoff time.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer - hidden on mobile */}
      {!isMobile && (
        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-card">
          © 2026 RevenueGrid.com. All Rights Reserved.
        </footer>
      )}

      {/* Cancel Dialog - Desktop */}
      {!isMobile && (
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
      )}

      {/* Cancel Drawer - Mobile (renders inside the component flow) */}
      {isMobile && showCancelDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end">
          <div className="bg-card w-full rounded-t-2xl max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 text-destructive font-semibold">
                <CalendarX className="w-5 h-5" />
                Cancel Meeting
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Please let us know why you're cancelling.
              </p>
            </div>

            <div className="p-4 space-y-2">
              {cancelReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all duration-200",
                    selectedReason === reason
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-medium">{reason}</span>
                </button>
              ))}

              {selectedReason === "Other" && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="reason-mobile" className="text-sm">Please specify</Label>
                  <Textarea
                    id="reason-mobile"
                    placeholder="Tell us more..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCancelDialog(false)}
                className="flex-1"
              >
                Keep
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={!selectedReason || (selectedReason === "Other" && !cancelReason.trim())}
                className="flex-1"
              >
                Cancel Meeting
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeeView;

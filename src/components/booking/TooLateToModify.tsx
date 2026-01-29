import { Clock, AlertCircle, Calendar, MapPin, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";

interface TooLateToModifyProps {
  action: "reschedule" | "cancel";
  meetingTitle?: string;
  meetingDate?: string;
  meetingTime?: string;
  organizerName?: string;
  organizerEmail?: string;
  cutoffMinutes?: number;
  onGoBack?: () => void;
}

const TooLateToModify = ({
  action = "reschedule",
  meetingTitle = "Product Demo Call",
  meetingDate = "January 28, 2026",
  meetingTime = "2:00 PM EST",
  organizerName = "John Smith",
  organizerEmail = "john.smith@revenuegrid.com",
  cutoffMinutes = 10,
  onGoBack,
}: TooLateToModifyProps) => {
  const actionLabel = action === "reschedule" ? "Reschedule" : "Cancel";
  const actionVerb = action === "reschedule" ? "rescheduling" : "cancelling";

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between border-b border-border bg-card">
        <img src={RevenuegridLogo} alt="Revenue Grid" className="h-7" />
      </header>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="bg-card rounded-2xl shadow-lg border border-border w-full max-w-lg overflow-hidden">
          <div className="p-6 md:p-10">
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-10 h-10 text-amber-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-foreground text-center mb-2">
              Too Late to {actionLabel}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Your meeting is starting very soon
            </p>

            {/* Alert Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-amber-800 font-medium mb-1">
                    {actionLabel} window has closed
                  </p>
                  <p className="text-sm text-amber-700">
                    {action === "reschedule"
                      ? `Meetings cannot be rescheduled within ${cutoffMinutes} minutes of the start time. Please contact the organizer directly if you need to make changes.`
                      : `Meetings cannot be cancelled within ${cutoffMinutes} minutes of the start time. Please contact the organizer directly if you cannot attend.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Meeting Details */}
            <div className="bg-secondary/50 rounded-xl p-5 mb-6 space-y-4">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                Meeting Details
              </h3>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{meetingTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {meetingDate} at {meetingTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{organizerName}</p>
                  <p className="text-sm text-muted-foreground">{organizerEmail}</p>
                </div>
              </div>
            </div>

            {/* Time Remaining Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                <Clock className="w-4 h-4" />
                Less than {cutoffMinutes} minutes until meeting
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full h-12" 
                variant="default"
                onClick={() => window.location.href = `mailto:${organizerEmail}?subject=Regarding: ${meetingTitle}`}
              >
                Contact Organizer
              </Button>
              
              {onGoBack && (
                <Button 
                  className="w-full h-12" 
                  variant="outline"
                  onClick={onGoBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              To avoid this in the future, please {action === "reschedule" ? "reschedule" : "cancel"} at least {cutoffMinutes} minutes before the meeting start time.
            </p>
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

export default TooLateToModify;

import { Clock, AlertCircle, Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";
import { cn } from "@/lib/utils";

interface TooLateToModifyProps {
  action: "reschedule" | "cancel";
  meetingTitle?: string;
  meetingDate?: string;
  meetingTime?: string;
  organizerName?: string;
  organizerEmail?: string;
  cutoffMinutes?: number;
  onGoBack?: () => void;
  isMobilePreview?: boolean;
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
  isMobilePreview = false,
}: TooLateToModifyProps) => {
  const actionLabel = action === "reschedule" ? "Reschedule" : "Cancel";

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className={cn(
        "flex items-center justify-between border-b border-border bg-card",
        isMobilePreview ? "py-2 px-4" : "py-4 px-6"
      )}>
        <img 
          src={RevenuegridLogo} 
          alt="Revenue Grid" 
          className={isMobilePreview ? "h-5" : "h-7"} 
        />
      </header>

      <div className={cn(
        "flex-1 flex items-center justify-center",
        isMobilePreview ? "p-3" : "p-4 md:p-8"
      )}>
        <div className="bg-card rounded-2xl shadow-lg border border-border w-full max-w-lg overflow-hidden">
          <div className={isMobilePreview ? "p-4" : "p-6 md:p-10"}>
            {/* Warning Icon */}
            <div className="flex justify-center mb-3">
              <div className={cn(
                "rounded-full bg-amber-100 flex items-center justify-center",
                isMobilePreview ? "w-12 h-12" : "w-20 h-20"
              )}>
                <Clock className={isMobilePreview ? "w-6 h-6 text-amber-600" : "w-10 h-10 text-amber-600"} />
              </div>
            </div>

            {/* Title */}
            <h1 className={cn(
              "font-semibold text-foreground text-center mb-1",
              isMobilePreview ? "text-lg" : "text-2xl"
            )}>
              Too Late to {actionLabel}
            </h1>
            <p className={cn(
              "text-center text-muted-foreground",
              isMobilePreview ? "text-xs mb-4" : "mb-8"
            )}>
              Your meeting is starting very soon
            </p>

            {/* Alert Box */}
            <div className={cn(
              "bg-amber-50 border border-amber-200 rounded-xl",
              isMobilePreview ? "p-3 mb-3" : "p-5 mb-6"
            )}>
              <div className="flex items-start gap-2">
                <AlertCircle className={cn(
                  "text-amber-600 shrink-0",
                  isMobilePreview ? "w-4 h-4 mt-0.5" : "w-5 h-5 mt-0.5"
                )} />
                <div>
                  <p className={cn(
                    "text-amber-800 font-medium",
                    isMobilePreview ? "text-xs mb-0.5" : "text-sm mb-1"
                  )}>
                    {actionLabel} window has closed
                  </p>
                  <p className={cn(
                    "text-amber-700",
                    isMobilePreview ? "text-xs leading-tight" : "text-sm"
                  )}>
                    {isMobilePreview 
                      ? `Cannot ${action} within ${cutoffMinutes}min of start. Contact organizer directly.`
                      : action === "reschedule"
                        ? `Meetings cannot be rescheduled within ${cutoffMinutes} minutes of the start time. Please contact the organizer directly if you need to make changes.`
                        : `Meetings cannot be cancelled within ${cutoffMinutes} minutes of the start time. Please contact the organizer directly if you cannot attend.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Meeting Details */}
            <div className={cn(
              "bg-secondary/50 rounded-xl space-y-2",
              isMobilePreview ? "p-3 mb-3" : "p-5 mb-6 space-y-4"
            )}>
              <h3 className={cn(
                "font-semibold text-foreground uppercase tracking-wide",
                isMobilePreview ? "text-[10px]" : "text-sm"
              )}>
                Meeting Details
              </h3>

              <div className="flex items-start gap-2">
                <Calendar className={cn(
                  "text-primary mt-0.5",
                  isMobilePreview ? "w-4 h-4" : "w-5 h-5"
                )} />
                <div>
                  <p className={cn(
                    "font-medium text-foreground",
                    isMobilePreview ? "text-xs" : ""
                  )}>{meetingTitle}</p>
                  <p className={cn(
                    "text-muted-foreground",
                    isMobilePreview ? "text-[10px]" : "text-sm"
                  )}>
                    {meetingDate} at {meetingTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <User className={cn(
                  "text-primary mt-0.5",
                  isMobilePreview ? "w-4 h-4" : "w-5 h-5"
                )} />
                <div>
                  <p className={cn(
                    "font-medium text-foreground",
                    isMobilePreview ? "text-xs" : ""
                  )}>{organizerName}</p>
                  <p className={cn(
                    "text-muted-foreground",
                    isMobilePreview ? "text-[10px]" : "text-sm"
                  )}>{organizerEmail}</p>
                </div>
              </div>
            </div>

            {/* Time Remaining Badge */}
            <div className={cn(
              "flex justify-center",
              isMobilePreview ? "mb-3" : "mb-6"
            )}>
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full bg-red-100 text-red-700 font-medium",
                isMobilePreview ? "px-3 py-1 text-[10px]" : "px-4 py-2 text-sm gap-2"
              )}>
                <Clock className={isMobilePreview ? "w-3 h-3" : "w-4 h-4"} />
                Less than {cutoffMinutes} min until meeting
              </span>
            </div>

            {/* Action Buttons */}
            <div className={isMobilePreview ? "space-y-2" : "space-y-3"}>
              <Button 
                className={cn("w-full", isMobilePreview ? "h-9 text-sm" : "h-12")}
                variant="default"
                onClick={() => window.location.href = `mailto:${organizerEmail}?subject=Regarding: ${meetingTitle}`}
              >
                Contact Organizer
              </Button>
              
              {onGoBack && (
                <Button 
                  className={cn("w-full", isMobilePreview ? "h-9 text-sm" : "h-12")}
                  variant="outline"
                  onClick={onGoBack}
                >
                  <ArrowLeft className={isMobilePreview ? "w-3 h-3 mr-1.5" : "w-4 h-4 mr-2"} />
                  Go Back
                </Button>
              )}
            </div>

            {!isMobilePreview && (
              <p className="text-xs text-muted-foreground text-center mt-6">
                To avoid this in the future, please {action === "reschedule" ? "reschedule" : "cancel"} at least {cutoffMinutes} minutes before the meeting start time.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={cn(
        "text-center text-muted-foreground border-t border-border bg-card",
        isMobilePreview ? "py-2 text-[10px]" : "py-4 text-sm"
      )}>
        © 2026 RevenueGrid.com
      </footer>
    </div>
  );
};

export default TooLateToModify;

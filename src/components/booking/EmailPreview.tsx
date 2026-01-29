import { useState } from "react";
import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";
import { Calendar, Clock, MapPin, User, FileText, Phone, MessageSquare, RefreshCw, CalendarX, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type EmailType = "host-confirmation" | "invitee-confirmation" | "host-reschedule" | "host-cancellation";

const emailTypes: { id: EmailType; label: string; description: string }[] = [
  { id: "host-confirmation", label: "Host Confirmation", description: "Sent to organizer when meeting is booked" },
  { id: "invitee-confirmation", label: "Invitee Confirmation", description: "Sent to attendee when meeting is booked" },
  { id: "host-reschedule", label: "Reschedule Notice", description: "Sent to organizer when meeting is rescheduled" },
  { id: "host-cancellation", label: "Cancellation Notice", description: "Sent to organizer when meeting is cancelled" },
];

const sampleData = {
  eventTitle: "Product Demo Call",
  userDisplayName: "John Smith",
  inviteeName: "Jane Doe",
  inviteeEmail: "jane.doe@example.com",
  phone: "+1 (555) 123-4567",
  notes: "Looking forward to discussing the new features.",
  startDate: "January 28, 2026 at 2:00 PM EST",
  newStartDate: "January 30, 2026 at 3:00 PM EST",
  originalStartDate: "January 28, 2026 at 2:00 PM EST",
  duration: "30",
  location: "Zoom Meeting",
  eventDescription: "A brief product demonstration to showcase the latest features and improvements.",
  eventId: "EVT-2026-001234",
  rescheduleReason: "I have a conflicting appointment at the original time.",
  cancellationReason: "Schedule conflict - no longer needed at this time.",
  rescheduleLink: "https://book.revenuegrid.com/reschedule/abc123",
  cancelLink: "https://book.revenuegrid.com/cancel/abc123",
};

const EmailHeader = () => (
  <div className="bg-[#1a2942] px-8 py-6 text-center">
    <img src={RevenuegridLogo} alt="Revenue Grid" className="h-8 mx-auto brightness-0 invert" />
  </div>
);

const EmailFooter = () => (
  <div className="bg-gray-100 px-8 py-6 text-center border-t border-gray-200">
    <p className="text-xs text-gray-500 mb-2">
      SCC__{sampleData.eventId}
    </p>
    <p className="text-xs text-gray-500 mb-1">
      950 East Paces Ferry Road, N.E., Suite 2150 Salesforce Tower, Atlanta, GA 30326
    </p>
    <a href="https://www.revenuegrid.com" className="text-xs text-primary hover:underline">
      www.revenuegrid.com
    </a>
    <div className="flex justify-center gap-4 mt-4">
      {["f", "in", "X", "yt"].map((icon) => (
        <div key={icon} className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-xs text-gray-500">{icon}</span>
        </div>
      ))}
    </div>
  </div>
);

const SuccessIcon = () => (
  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const RescheduleIcon = () => (
  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
    <RefreshCw className="w-8 h-8 text-blue-600" />
  </div>
);

const CancelIcon = () => (
  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
    <CalendarX className="w-8 h-8 text-red-600" />
  </div>
);

const MeetingDetailsCard = ({ showReason, reasonLabel, reason }: { showReason?: boolean; reasonLabel?: string; reason?: string }) => (
  <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
    <h3 className="text-lg font-semibold text-[#1a2942] mb-4 flex items-center gap-2">
      <Calendar className="w-5 h-5 text-primary" />
      Meeting Details
    </h3>

    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">Subject</p>
          <p className="font-medium text-gray-800">{sampleData.eventTitle}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <User className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">Invitee(s)</p>
          <p className="font-medium text-gray-800">{sampleData.inviteeEmail}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">Phone number(s)</p>
          <p className="font-medium text-gray-800">{sampleData.phone}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">Notes</p>
          <p className="font-medium text-gray-800">{sampleData.notes}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4" />

      <div className="flex items-start gap-3">
        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">Start date</p>
          <p className="font-medium text-gray-800">{sampleData.startDate}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">Duration (min)</p>
          <p className="font-medium text-gray-800">{sampleData.duration}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p className="font-medium text-gray-800">{sampleData.location}</p>
        </div>
      </div>

      {showReason && reason && (
        <>
          <div className="border-t border-gray-200 my-4" />
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">{reasonLabel}</p>
              <p className="font-medium text-gray-800 italic">"{reason}"</p>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);

const ActionButtons = () => (
  <div className="flex gap-4 justify-center mb-8">
    <a
      href={sampleData.rescheduleLink}
      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      Reschedule
    </a>
    <a
      href={sampleData.cancelLink}
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-destructive border-2 border-destructive/30 rounded-lg font-medium hover:bg-destructive/10 transition-colors"
    >
      <CalendarX className="w-4 h-4" />
      Cancel
    </a>
  </div>
);

// Host Confirmation Email
const HostConfirmationEmail = () => (
  <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-border">
    <EmailHeader />
    <div className="px-8 py-8">
      <div className="text-center mb-8">
        <SuccessIcon />
        <h1 className="text-2xl font-bold text-[#1a2942] mb-2">A new meeting has been confirmed</h1>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 text-base">
          Dear <span className="font-semibold">{sampleData.userDisplayName}</span>,
        </p>
      </div>

      <div className="mb-8">
        <p className="text-gray-700 text-base">
          A new meeting '<span className="font-semibold text-[#1a2942]">{sampleData.eventTitle}</span>' has been confirmed by the invitee(s).
        </p>
      </div>

      <MeetingDetailsCard />

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
        <p className="text-gray-700">{sampleData.eventDescription}</p>
      </div>
    </div>
    <EmailFooter />
  </div>
);

// Invitee Confirmation Email
const InviteeConfirmationEmail = () => (
  <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-border">
    <EmailHeader />
    <div className="px-8 py-8">
      <div className="text-center mb-8">
        <SuccessIcon />
        <h1 className="text-2xl font-bold text-[#1a2942] mb-2">Your meeting is confirmed!</h1>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 text-base">
          Hi <span className="font-semibold">{sampleData.inviteeName}</span>,
        </p>
      </div>

      <div className="mb-8">
        <p className="text-gray-700 text-base">
          Your meeting '<span className="font-semibold text-[#1a2942]">{sampleData.eventTitle}</span>' with <span className="font-semibold">{sampleData.userDisplayName}</span> has been scheduled.
        </p>
      </div>

      <MeetingDetailsCard />

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
        <p className="text-gray-700">{sampleData.eventDescription}</p>
      </div>

      <div className="border-t border-gray-200 pt-6 mb-4">
        <p className="text-center text-gray-600 mb-4">Need to make changes?</p>
        <ActionButtons />
      </div>
    </div>
    <EmailFooter />
  </div>
);

// Host Reschedule Notification Email
const HostRescheduleEmail = () => (
  <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-border">
    <EmailHeader />
    <div className="px-8 py-8">
      <div className="text-center mb-8">
        <RescheduleIcon />
        <h1 className="text-2xl font-bold text-[#1a2942] mb-2">Meeting has been rescheduled</h1>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 text-base">
          Dear <span className="font-semibold">{sampleData.userDisplayName}</span>,
        </p>
      </div>

      <div className="mb-8">
        <p className="text-gray-700 text-base">
          The meeting '<span className="font-semibold text-[#1a2942]">{sampleData.eventTitle}</span>' has been rescheduled by <span className="font-semibold">{sampleData.inviteeName}</span>.
        </p>
      </div>

      {/* Time Change Highlight */}
      <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Schedule Change</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 w-24">Original:</span>
            <span className="font-medium text-gray-500 line-through">{sampleData.originalStartDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-blue-600 w-24">New time:</span>
            <span className="font-semibold text-blue-800">{sampleData.newStartDate}</span>
          </div>
        </div>
      </div>

      <MeetingDetailsCard 
        showReason={true} 
        reasonLabel="Reason for rescheduling" 
        reason={sampleData.rescheduleReason} 
      />
    </div>
    <EmailFooter />
  </div>
);

// Host Cancellation Notification Email
const HostCancellationEmail = () => (
  <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-border">
    <EmailHeader />
    <div className="px-8 py-8">
      <div className="text-center mb-8">
        <CancelIcon />
        <h1 className="text-2xl font-bold text-[#1a2942] mb-2">Meeting has been cancelled</h1>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 text-base">
          Dear <span className="font-semibold">{sampleData.userDisplayName}</span>,
        </p>
      </div>

      <div className="mb-8">
        <p className="text-gray-700 text-base">
          The meeting '<span className="font-semibold text-[#1a2942]">{sampleData.eventTitle}</span>' has been cancelled by <span className="font-semibold">{sampleData.inviteeName}</span>.
        </p>
      </div>

      {/* Cancellation Notice */}
      <div className="bg-red-50 rounded-xl p-6 mb-8 border border-red-200">
        <h3 className="text-lg font-semibold text-red-800 mb-3">Cancellation Details</h3>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Originally scheduled:</span> {sampleData.startDate}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Reason:</span> <span className="italic">"{sampleData.cancellationReason}"</span>
          </p>
        </div>
      </div>

      <MeetingDetailsCard />

      <div className="text-center text-gray-600 text-sm">
        <p>This time slot is now available for other bookings.</p>
      </div>
    </div>
    <EmailFooter />
  </div>
);

const TemplateVariables = ({ emailType }: { emailType: EmailType }) => {
  const baseVars = ["{eventTitle}", "{UserDisplayName}", "{invitees}", "{startDate}", "{duration}", "{locationString}", "{phone}", "{notes}"];
  
  const typeSpecificVars: Record<EmailType, string[]> = {
    "host-confirmation": baseVars,
    "invitee-confirmation": [...baseVars, "{rescheduleLink}", "{cancelLink}"],
    "host-reschedule": [...baseVars, "{originalStartDate}", "{newStartDate}", "{rescheduleReason}"],
    "host-cancellation": [...baseVars, "{cancellationReason}"],
  };

  return (
    <div className="mt-6 bg-card rounded-lg p-4 border border-border">
      <h4 className="text-sm font-semibold text-foreground mb-3">Template Variables</h4>
      <div className="flex flex-wrap gap-2">
        {typeSpecificVars[emailType].map((variable) => (
          <code key={variable} className="bg-muted px-2 py-1 rounded text-xs">{variable}</code>
        ))}
      </div>
    </div>
  );
};

const EmailPreview = () => {
  const [selectedType, setSelectedType] = useState<EmailType>("host-confirmation");

  const renderEmail = () => {
    switch (selectedType) {
      case "host-confirmation":
        return <HostConfirmationEmail />;
      case "invitee-confirmation":
        return <InviteeConfirmationEmail />;
      case "host-reschedule":
        return <HostRescheduleEmail />;
      case "host-cancellation":
        return <HostCancellationEmail />;
    }
  };

  const currentType = emailTypes.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-muted py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Email Template Preview</h2>
        <p className="text-sm text-muted-foreground">{currentType?.description}</p>
      </div>

      {/* Email Type Tabs */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex flex-wrap justify-center gap-2 bg-card rounded-lg p-2 border border-border">
          {emailTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                selectedType === type.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email Preview Container */}
      <div className="max-w-2xl mx-auto">
        {renderEmail()}
        <TemplateVariables emailType={selectedType} />
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground mt-8">
        © 2026 RevenueGrid.com. All Rights Reserved.
      </footer>
    </div>
  );
};

export default EmailPreview;

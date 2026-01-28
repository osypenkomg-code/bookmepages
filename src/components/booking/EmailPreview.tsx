import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";
import { Calendar, Clock, MapPin, User, FileText, Phone, MessageSquare } from "lucide-react";

const EmailPreview = () => {
  // Sample data for the preview
  const sampleData = {
    eventTitle: "Product Demo Call",
    userDisplayName: "John Smith",
    invitees: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    notes: "Looking forward to discussing the new features.",
    startDate: "January 28, 2026 at 2:00 PM EST",
    duration: "30",
    location: "Zoom Meeting",
    eventDescription: "A brief product demonstration to showcase the latest features and improvements.",
    eventId: "EVT-2026-001234",
  };

  return (
    <div className="min-h-screen bg-muted py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Email Confirmation Preview</h2>
        <p className="text-sm text-muted-foreground">This is how the confirmation email will appear to the organizer</p>
      </div>

      {/* Email Preview Container */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-border">
          {/* Email Header */}
          <div className="bg-[#1a2942] px-8 py-6 text-center">
            <img src={RevenuegridLogo} alt="Revenue Grid" className="h-8 mx-auto brightness-0 invert" />
          </div>

          {/* Email Body */}
          <div className="px-8 py-8">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#1a2942] mb-2">A new meeting has been confirmed</h1>
            </div>

            {/* Greeting */}
            <div className="mb-6">
              <p className="text-gray-700 text-base">
                Dear <span className="font-semibold">{sampleData.userDisplayName}</span>,
              </p>
            </div>

            {/* Main Message */}
            <div className="mb-8">
              <p className="text-gray-700 text-base">
                A new meeting '<span className="font-semibold text-[#1a2942]">{sampleData.eventTitle}</span>' has been confirmed by the invitee(s).
              </p>
            </div>

            {/* Meeting Details Card */}
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
                    <p className="font-medium text-gray-800">{sampleData.invitees}</p>
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
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-gray-700">{sampleData.eventDescription}</p>
            </div>
          </div>

          {/* Email Footer */}
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

            {/* Social Icons Placeholder */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">f</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">in</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">X</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">yt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Template Variables Legend */}
        <div className="mt-6 bg-card rounded-lg p-4 border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Template Variables</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <code className="bg-muted px-2 py-1 rounded">{"{eventTitle}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{UserDisplayName}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{invitees}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{startDate}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{duration}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{locationString}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{phone}"}</code>
            <code className="bg-muted px-2 py-1 rounded">{"{notes}"}</code>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground mt-8">
        © 2026 RevenueGrid.com. All Rights Reserved.
      </footer>
    </div>
  );
};

export default EmailPreview;

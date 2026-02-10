import { useState } from "react";
import BookingWidget from "@/components/booking/BookingWidget";
import BookingWizard from "@/components/booking/BookingWizard";
import AttendeeView from "@/components/booking/AttendeeView";
import EmailPreview from "@/components/booking/EmailPreview";
import TooLateToModify from "@/components/booking/TooLateToModify";
import ViewSwitcher, { ViewMode, PlatformMode, EnabledPlatforms } from "@/components/booking/ViewSwitcher";
import MobileFrame from "@/components/booking/MobileFrame";

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("organizer-wizard");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [tooLateAction, setTooLateAction] = useState<"reschedule" | "cancel">("reschedule");
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [platformMode, setPlatformMode] = useState<PlatformMode>("full");
  const [enabledPlatforms, setEnabledPlatforms] = useState<EnabledPlatforms>({
    zoom: true,
    teams: true,
    googleMeet: true,
  });
  const handleReschedule = () => {
    setIsRescheduling(true);
  };

  const handleRescheduleComplete = () => {
    setIsRescheduling(false);
    setViewMode("attendee");
  };

  const renderView = () => {
    // If rescheduling from attendee view, show wizard in reschedule mode
    if (isRescheduling) {
      return (
        <BookingWizard 
          isRescheduling={true} 
          isMobilePreview={isMobilePreview}
          platformMode={platformMode}
          onComplete={handleRescheduleComplete}
        />
      );
    }

    switch (viewMode) {
      case "organizer-classic":
        return (
          <BookingWidget 
            isMobilePreview={isMobilePreview} 
            location={platformMode === "disabled" ? "Microsoft Teams" : undefined}
          />
        );
      case "organizer-wizard":
        return (
          <BookingWizard 
            isMobilePreview={isMobilePreview} 
            platformMode={platformMode}
            enabledPlatforms={enabledPlatforms}
          />
        );
      case "attendee":
        return <AttendeeView onReschedule={handleReschedule} isMobilePreview={isMobilePreview} />;
      case "attendee-expired":
        return <AttendeeView onReschedule={handleReschedule} isMobilePreview={isMobilePreview} isExpired={true} />;
      case "email-preview":
        return <EmailPreview isMobilePreview={isMobilePreview} onNavigateToAttendee={() => setViewMode("attendee")} />;
      case "too-late":
        return (
          <TooLateToModify 
            action={tooLateAction}
            onGoBack={() => setViewMode("attendee")}
            isMobilePreview={isMobilePreview}
          />
        );
      default:
        return <BookingWizard platformMode={platformMode} />;
    }
  };

  // Email preview handles its own mobile frame
  const shouldUseMobileFrame = isMobilePreview && viewMode !== "email-preview";

  return (
    <>
      <ViewSwitcher 
        currentView={isRescheduling ? "organizer-wizard" : viewMode} 
        onChange={(view) => {
          setIsRescheduling(false);
          setViewMode(view);
        }}
        isMobilePreview={isMobilePreview}
        onMobilePreviewChange={setIsMobilePreview}
        platformMode={platformMode}
        onPlatformModeChange={setPlatformMode}
        enabledPlatforms={enabledPlatforms}
        onEnabledPlatformsChange={setEnabledPlatforms}
      />
      <MobileFrame enabled={shouldUseMobileFrame}>
        {renderView()}
      </MobileFrame>
    </>
  );
};

export default Index;

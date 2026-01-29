import { useState } from "react";
import BookingWidget from "@/components/booking/BookingWidget";
import BookingWizard from "@/components/booking/BookingWizard";
import AttendeeView from "@/components/booking/AttendeeView";
import EmailPreview from "@/components/booking/EmailPreview";
import TooLateToModify from "@/components/booking/TooLateToModify";
import ViewSwitcher, { ViewMode } from "@/components/booking/ViewSwitcher";

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("organizer-wizard");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [tooLateAction, setTooLateAction] = useState<"reschedule" | "cancel">("reschedule");

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
          onComplete={handleRescheduleComplete}
        />
      );
    }

    switch (viewMode) {
      case "organizer-classic":
        return <BookingWidget />;
      case "organizer-wizard":
        return <BookingWizard />;
      case "attendee":
        return <AttendeeView onReschedule={handleReschedule} />;
      case "email-preview":
        return <EmailPreview />;
      case "too-late":
        return (
          <TooLateToModify 
            action={tooLateAction}
            onGoBack={() => setViewMode("attendee")}
          />
        );
      default:
        return <BookingWizard />;
    }
  };

  return (
    <>
      <ViewSwitcher 
        currentView={isRescheduling ? "organizer-wizard" : viewMode} 
        onChange={(view) => {
          setIsRescheduling(false);
          setViewMode(view);
        }} 
      />
      {renderView()}
    </>
  );
};

export default Index;

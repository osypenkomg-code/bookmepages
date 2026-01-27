import RevenuegridLogo from "@/assets/revenuegrid-logo.svg";

interface BookingHeaderProps {
  title: string;
  duration: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
}

const BookingHeader = ({
  title,
  duration,
  location,
  organizerName,
  organizerEmail,
}: BookingHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <img src={RevenuegridLogo} alt="Revenue Grid" className="h-8" />
      </div>
      <h1 className="text-2xl font-semibold text-rg-navy mb-4">"{title}"</h1>
      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          {duration}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-rg-coral" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location}
        </span>
      </div>
      <div className="text-sm">
        <p className="text-foreground font-medium">Organizer: {organizerName}</p>
        <p className="text-muted-foreground">{organizerEmail}</p>
      </div>
    </div>
  );
};

export default BookingHeader;

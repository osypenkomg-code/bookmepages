import { cn } from "@/lib/utils";

export type LocationType = "zoom" | "teams" | "google-meet";

interface LocationSelectorProps {
  selected: LocationType;
  onChange: (location: LocationType) => void;
}

const locations: { id: LocationType; name: string; icon: JSX.Element }[] = [
  {
    id: "zoom",
    name: "Zoom",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M4.585 8.968a3.585 3.585 0 0 0-3.585 3.585v3.36c0 1.98 1.605 3.586 3.585 3.586h8.32a3.585 3.585 0 0 0 3.585-3.585v-3.36a3.585 3.585 0 0 0-3.585-3.586h-8.32Zm14.44 1.11v5.844l2.834 2.006c.63.445 1.141.27 1.141-.506V8.578c0-.803-.482-.928-1.141-.506l-2.834 2.006Z"/>
      </svg>
    ),
  },
  {
    id: "teams",
    name: "Teams",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M20.625 8.25h-3.75v-1.5a1.5 1.5 0 0 1 1.5-1.5h.75a1.5 1.5 0 0 1 1.5 1.5v1.5Zm-4.875 0H9.375a1.125 1.125 0 0 0-1.125 1.125v6.75A1.125 1.125 0 0 0 9.375 17.25h6.375a1.125 1.125 0 0 0 1.125-1.125v-6.75A1.125 1.125 0 0 0 15.75 8.25Zm5.25 1.5h-3v5.625c0 .621-.504 1.125-1.125 1.125H13.5v1.875c0 .621.504 1.125 1.125 1.125h5.25c.621 0 1.125-.504 1.125-1.125V10.875c0-.621-.504-1.125-1.125-1.125Zm-8.625-4.5a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25Zm7.5 0a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z"/>
      </svg>
    ),
  },
  {
    id: "google-meet",
    name: "Google Meet",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5Zm0-6c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8Zm3.5 9.5h-1.79l-1.21 1.21a1.5 1.5 0 0 1-1 .29v1.79c0 .28-.22.5-.5.5s-.5-.22-.5-.5V15.5c-.28 0-.56-.11-.79-.29l-1.21-1.21H7c-.28 0-.5-.22-.5-.5V12c0-.28.22-.5.5-.5h1.79l1.21-1.21c.19-.19.45-.29.71-.29.26 0 .52.1.71.29l1.21 1.21H15c.28 0 .5.22.5.5v1.5c0 .28-.22.5-.5.5Z"/>
      </svg>
    ),
  },
];

const LocationSelector = ({ selected, onChange }: LocationSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Select meeting platform</p>
      <div className="flex gap-3">
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => onChange(loc.id)}
            className={cn(
              "flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-200",
              "hover:border-primary/50 hover:bg-secondary/50",
              selected === loc.id
                ? "border-primary bg-secondary text-primary"
                : "border-border text-muted-foreground"
            )}
          >
            <div className={cn(
              "transition-colors",
              selected === loc.id ? "text-primary" : "text-muted-foreground"
            )}>
              {loc.icon}
            </div>
            <span className="text-sm font-medium">{loc.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationSelector;

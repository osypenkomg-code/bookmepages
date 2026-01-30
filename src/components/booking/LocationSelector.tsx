import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type LocationType = "zoom" | "teams" | "google-meet";

export interface EnabledPlatforms {
  zoom: boolean;
  teams: boolean;
  googleMeet: boolean;
}

interface LocationSelectorProps {
  selected: LocationType | null;
  onChange: (location: LocationType) => void;
  compact?: boolean;
  enabledPlatforms?: EnabledPlatforms;
}

const locations: { 
  id: LocationType; 
  name: string; 
  shortName: string;
  description: string;
  icon: (compact?: boolean) => JSX.Element;
}[] = [
  {
    id: "zoom",
    name: "Zoom",
    shortName: "Zoom",
    description: "Join via Zoom video call. A link will be sent to your email.",
    icon: (compact) => (
      <svg viewBox="0 0 48 48" className={compact ? "w-6 h-6" : "w-8 h-8"}>
        <path fill="#2196F3" d="M29 18.5v11c0 1.93-1.57 3.5-3.5 3.5h-14c-1.93 0-3.5-1.57-3.5-3.5v-11c0-1.93 1.57-3.5 3.5-3.5h14c1.93 0 3.5 1.57 3.5 3.5z"/>
        <path fill="#2196F3" d="M40.08 17.16l-8.08 5.39v2.9l8.08 5.39c.78.52 1.92.05 1.92-.92v-11.84c0-.97-1.14-1.44-1.92-.92z"/>
      </svg>
    ),
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    shortName: "Teams",
    description: "Join via Teams meeting. Calendar invite will include the link.",
    icon: (compact) => (
      <svg viewBox="0 0 48 48" className={compact ? "w-6 h-6" : "w-8 h-8"}>
        <path fill="#5059C9" d="M44 22v10c0 2.2-1.8 4-4 4h-9V18h9c2.2 0 4 1.8 4 4z"/>
        <circle fill="#5059C9" cx="35.5" cy="11.5" r="4.5"/>
        <path fill="#7B83EB" d="M38 18H16c-2.2 0-4 1.8-4 4v12c0 4.4 3.6 8 8 8h10c4.4 0 8-3.6 8-8V22c0-2.2-1.8-4-4-4z"/>
        <circle fill="#7B83EB" cx="24" cy="10" r="6"/>
        <path fill="#fff" d="M20 27h8v2h-8z"/>
        <path fill="#fff" d="M23 24h2v8h-2z"/>
      </svg>
    ),
  },
  {
    id: "google-meet",
    name: "Google Meet",
    shortName: "Meet",
    description: "Join via Google Meet. Works directly in your browser.",
    icon: (compact) => (
      <svg viewBox="0 0 48 48" className={compact ? "w-6 h-6" : "w-8 h-8"}>
        <path fill="#00832d" d="M34 24l7.2-7.2c.6-.6 1.8-.2 1.8.8v12.8c0 1-.9 1.4-1.8.8L34 24z"/>
        <path fill="#0066da" d="M12 15h16c1.7 0 3 1.3 3 3v12c0 1.7-1.3 3-3 3H12c-1.7 0-3-1.3-3-3V18c0-1.7 1.3-3 3-3z"/>
        <path fill="#e94235" d="M12 33h16l-16 6v-6z"/>
        <path fill="#2684fc" d="M28 15H12l16-6v6z"/>
        <path fill="#00ac47" d="M31 18v12l-3 3V15l3 3z"/>
        <path fill="#00ac47" d="M9 30v-6l3-3v12l-3-3z"/>
        <path fill="#ffba00" d="M12 15l-3 3v-3h3z"/>
        <path fill="#188038" d="M28 33l3-3v3h-3z"/>
      </svg>
    ),
  },
];

const LocationSelector = ({ 
  selected, 
  onChange, 
  compact = false,
  enabledPlatforms = { zoom: true, teams: true, googleMeet: true }
}: LocationSelectorProps) => {
  // Map LocationType to EnabledPlatforms keys
  const platformKeyMap: Record<LocationType, keyof EnabledPlatforms> = {
    zoom: "zoom",
    teams: "teams",
    "google-meet": "googleMeet",
  };
  
  // Filter locations based on enabled platforms
  const filteredLocations = locations.filter(loc => enabledPlatforms[platformKeyMap[loc.id]]);
  const selectedLocation = filteredLocations.find(loc => loc.id === selected);
  
  // Dynamic grid columns based on number of enabled platforms
  const gridCols = filteredLocations.length === 1 
    ? "grid-cols-1" 
    : filteredLocations.length === 2 
      ? "grid-cols-2" 
      : "grid-cols-3";

  return (
    <div className={cn("flex flex-col", compact ? "gap-3" : "gap-5")}>
      <div className={cn("grid", gridCols, compact ? "gap-2" : "gap-4")}>
        {filteredLocations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => onChange(loc.id)}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200",
              "hover:border-primary/50 hover:bg-secondary/50",
              compact ? "gap-1.5 w-full h-20 rounded-lg" : "gap-3 w-32 h-32",
              selected === loc.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border text-muted-foreground"
            )}
          >
            {/* Checkmark badge */}
            {selected === loc.id && (
              <div className={cn(
                "absolute rounded-full bg-primary flex items-center justify-center shadow-sm",
                compact ? "-top-1.5 -right-1.5 w-5 h-5" : "-top-2 -right-2 w-6 h-6"
              )}>
                <Check className={compact ? "w-3 h-3 text-primary-foreground" : "w-4 h-4 text-primary-foreground"} />
              </div>
            )}
            
            <div className="transition-transform duration-200 hover:scale-105">
              {loc.icon(compact)}
            </div>
            <span className={cn(
              "font-medium text-center leading-tight",
              compact ? "text-[10px]" : "text-xs",
              selected === loc.id ? "text-foreground" : "text-muted-foreground"
            )}>
              {compact ? loc.shortName : loc.name}
            </span>
          </button>
        ))}
      </div>
      
      {/* Description text */}
      {selectedLocation && (
        <div className={cn(
          "text-center bg-secondary/50 rounded-lg max-w-md mx-auto",
          compact ? "p-2" : "p-3"
        )}>
          <p className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
            {selectedLocation.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;

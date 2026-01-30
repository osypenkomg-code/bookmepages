import { cn } from "@/lib/utils";
import { Mail, Clock, Smartphone, Monitor, Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export type ViewMode = "organizer-classic" | "organizer-wizard" | "attendee" | "email-preview" | "too-late";
export type PlatformMode = "full" | "custom" | "disabled";

export interface EnabledPlatforms {
  zoom: boolean;
  teams: boolean;
  googleMeet: boolean;
}

interface ViewSwitcherProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
  isMobilePreview?: boolean;
  onMobilePreviewChange?: (enabled: boolean) => void;
  platformMode?: PlatformMode;
  onPlatformModeChange?: (mode: PlatformMode) => void;
  enabledPlatforms?: EnabledPlatforms;
  onEnabledPlatformsChange?: (platforms: EnabledPlatforms) => void;
}

const views: { id: ViewMode; label: string; description: string; icon?: React.ReactNode }[] = [
  { id: "organizer-classic", label: "Classic", description: "Side-by-side view" },
  { id: "organizer-wizard", label: "Wizard", description: "Step-by-step" },
  { id: "attendee", label: "Attendee", description: "Manage booking" },
  { id: "email-preview", label: "Email", description: "Confirmation email preview", icon: <Mail className="w-4 h-4" /> },
  { id: "too-late", label: "Too Late", description: "Cutoff time reached", icon: <Clock className="w-4 h-4" /> },
];

const platformModes: { id: PlatformMode; label: string; description: string }[] = [
  { id: "full", label: "Full", description: "Choose Zoom, Teams, or Google Meet" },
  { id: "custom", label: "Custom", description: "Enter custom meeting link" },
  { id: "disabled", label: "Off", description: "Skip platform step (default Teams)" },
];

const platformOptions: { key: keyof EnabledPlatforms; label: string }[] = [
  { key: "zoom", label: "Zoom" },
  { key: "teams", label: "Teams" },
  { key: "googleMeet", label: "Meet" },
];

const ViewSwitcher = ({ 
  currentView, 
  onChange, 
  isMobilePreview = false, 
  onMobilePreviewChange,
  platformMode = "full",
  onPlatformModeChange,
  enabledPlatforms = { zoom: true, teams: true, googleMeet: true },
  onEnabledPlatformsChange,
}: ViewSwitcherProps) => {
  const isOrganizerView = currentView === "organizer-classic" || currentView === "organizer-wizard";
  
  const handlePlatformToggle = (key: keyof EnabledPlatforms) => {
    if (!onEnabledPlatformsChange) return;
    const newPlatforms = { ...enabledPlatforms, [key]: !enabledPlatforms[key] };
    // Ensure at least one platform remains enabled
    const enabledCount = Object.values(newPlatforms).filter(Boolean).length;
    if (enabledCount === 0) return;
    onEnabledPlatformsChange(newPlatforms);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {/* View Tabs */}
      <div className="bg-card border border-border rounded-full p-1 shadow-lg flex gap-1">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onChange(view.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
              currentView === view.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            title={view.description}
          >
            {view.icon}
            {view.label}
          </button>
        ))}
      </div>

      {/* Settings Row: Mobile Preview + Platform Mode */}
      <div className="flex gap-2">
        {/* Mobile Preview Toggle */}
        {onMobilePreviewChange && (
          <div className="bg-card border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Monitor className={cn("w-4 h-4", !isMobilePreview && "text-primary")} />
              <span className={cn("text-xs font-medium", !isMobilePreview && "text-foreground")}>Desktop</span>
            </div>
            <Switch
              checked={isMobilePreview}
              onCheckedChange={onMobilePreviewChange}
              className="scale-90"
            />
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Smartphone className={cn("w-4 h-4", isMobilePreview && "text-primary")} />
              <span className={cn("text-xs font-medium", isMobilePreview && "text-foreground")}>Mobile</span>
            </div>
          </div>
        )}

        {/* Platform Mode Selector - Only show for organizer views */}
        {isOrganizerView && onPlatformModeChange && (
          <div className="bg-card border border-border rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Platform:</span>
            <div className="flex gap-1">
              {platformModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onPlatformModeChange(mode.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200",
                    platformMode === mode.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title={mode.description}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            
            {/* Platform enable/disable toggles - only show in Full mode */}
            {platformMode === "full" && onEnabledPlatformsChange && (
              <>
                <div className="w-px h-4 bg-border mx-1" />
                <div className="flex items-center gap-2">
                  {platformOptions.map((platform) => (
                    <label
                      key={platform.key}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <Checkbox
                        checked={enabledPlatforms[platform.key]}
                        onCheckedChange={() => handlePlatformToggle(platform.key)}
                        className="w-3.5 h-3.5"
                      />
                      <span className="text-xs text-muted-foreground">{platform.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSwitcher;

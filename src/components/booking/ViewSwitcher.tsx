import { cn } from "@/lib/utils";
import { Mail, Clock, Smartphone, Monitor } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export type ViewMode = "organizer-classic" | "organizer-wizard" | "attendee" | "email-preview" | "too-late";

interface ViewSwitcherProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
  isMobilePreview?: boolean;
  onMobilePreviewChange?: (enabled: boolean) => void;
}

const views: { id: ViewMode; label: string; description: string; icon?: React.ReactNode }[] = [
  { id: "organizer-classic", label: "Classic", description: "Side-by-side view" },
  { id: "organizer-wizard", label: "Wizard", description: "Step-by-step" },
  { id: "attendee", label: "Attendee", description: "Manage booking" },
  { id: "email-preview", label: "Email", description: "Confirmation email preview", icon: <Mail className="w-4 h-4" /> },
  { id: "too-late", label: "Too Late", description: "Cutoff time reached", icon: <Clock className="w-4 h-4" /> },
];

const ViewSwitcher = ({ currentView, onChange, isMobilePreview = false, onMobilePreviewChange }: ViewSwitcherProps) => {
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
    </div>
  );
};

export default ViewSwitcher;

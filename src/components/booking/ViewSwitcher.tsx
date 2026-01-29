import { cn } from "@/lib/utils";
import { Mail, Clock } from "lucide-react";

export type ViewMode = "organizer-classic" | "organizer-wizard" | "attendee" | "email-preview" | "too-late";

interface ViewSwitcherProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
}

const views: { id: ViewMode; label: string; description: string; icon?: React.ReactNode }[] = [
  { id: "organizer-classic", label: "Classic", description: "Side-by-side view" },
  { id: "organizer-wizard", label: "Wizard", description: "Step-by-step" },
  { id: "attendee", label: "Attendee", description: "Manage booking" },
  { id: "email-preview", label: "Email", description: "Confirmation email preview", icon: <Mail className="w-4 h-4" /> },
  { id: "too-late", label: "Too Late", description: "Cutoff time reached", icon: <Clock className="w-4 h-4" /> },
];

const ViewSwitcher = ({ currentView, onChange }: ViewSwitcherProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-full p-1 shadow-lg flex gap-1">
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
  );
};

export default ViewSwitcher;

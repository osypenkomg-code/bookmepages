import { cn } from "@/lib/utils";

interface MobileFrameProps {
  children: React.ReactNode;
  enabled: boolean;
}

const MobileFrame = ({ children, enabled }: MobileFrameProps) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted p-4">
      <div className="bg-gray-800 rounded-[40px] p-3 shadow-2xl max-w-[390px] w-full">
        {/* Phone Notch */}
        <div className="flex justify-center mb-2">
          <div className="w-24 h-6 bg-gray-900 rounded-full"></div>
        </div>
        {/* Phone Screen */}
        <div className="bg-white rounded-[28px] overflow-hidden h-[700px] overflow-y-auto">
          <div className="transform scale-[0.85] origin-top w-[118%] -ml-[9%]">
            {children}
          </div>
        </div>
        {/* Home Indicator */}
        <div className="flex justify-center mt-2">
          <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;

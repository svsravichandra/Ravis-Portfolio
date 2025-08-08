import { cn } from "@/lib/utils";

interface NavigationDotsProps {
  activeSection: number;
  totalSections: number;
  onSectionClick: (index: number) => void;
}

export default function NavigationDots({ activeSection, totalSections, onSectionClick }: NavigationDotsProps) {
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
      {Array.from({ length: totalSections }, (_, index) => (
        <div
          key={index}
          className={cn(
            "nav-dot w-3 h-3 rounded-full cursor-pointer transition-all duration-300",
            activeSection === index 
              ? "bg-primary shadow-[0_0_15px_rgba(0,212,255,0.6)]" 
              : "bg-gray-600 hover:bg-gray-500"
          )}
          onClick={() => onSectionClick(index)}
        />
      ))}
    </div>
  );
}

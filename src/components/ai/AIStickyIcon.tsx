import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIStickyIconProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AIStickyIcon({ onClick, isOpen }: AIStickyIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "w-16 h-16 rounded-full shadow-xl transition-transform duration-200 ease-out",
          "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600",
          "hover:shadow-2xl hover:scale-105",
          isOpen && "rotate-180"
        )}
        size="lg"
        style={{ position: 'fixed', bottom: '24px', left: '24px' }}
      >
        <Sparkles className={cn(
          "h-8 w-8 text-white transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </Button>
    </div>
  );
}
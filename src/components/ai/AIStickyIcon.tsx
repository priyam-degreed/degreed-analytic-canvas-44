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
    <div className="fixed bottom-6 right-6 z-40 transform-gpu translate-z-0" style={{ willChange: 'transform' }}>
      <Button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "w-16 h-16 rounded-full shadow-xl transition-all duration-300 ease-out",
          "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600",
          "hover:shadow-2xl hover:scale-110",
          isOpen && "rotate-180 scale-110"
        )}
        size="lg"
      >
        <Sparkles className="h-8 w-8 text-white" />
      </Button>
    </div>
  );
}
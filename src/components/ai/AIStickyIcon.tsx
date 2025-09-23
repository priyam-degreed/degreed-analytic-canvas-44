import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIStickyIconProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AIStickyIcon({ onClick, isOpen }: AIStickyIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-out",
          "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
          "hover:shadow-xl hover:scale-110",
          isOpen && "rotate-180"
        )}
        size="lg"
      >
        {isOpen ? (
          <MessageSquare className="h-6 w-6 text-white" />
        ) : (
          <Brain className="h-6 w-6 text-white" />
        )}
      </Button>
      
      {/* Tooltip */}
      {isHovered && !isOpen && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          AI Assistant
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Sparkles, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIStickyIconProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AIStickyIcon({ onClick, isOpen }: AIStickyIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "w-16 h-16 rounded-full shadow-xl transition-all duration-300 ease-out",
          "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600",
          "hover:shadow-2xl hover:scale-110 animate-pulse",
          isOpen && "rotate-180 scale-110",
          !isOpen && "animate-pulse"
        )}
        size="lg"
      >
        {isOpen ? (
          <MessageSquare className="h-8 w-8 text-white animate-pulse" />
        ) : (
          <div className="relative">
            <Brain className="h-8 w-8 text-white" />
            <Sparkles className="h-4 w-4 text-white absolute -top-1 -right-1 animate-bounce" />
          </div>
        )}
      </Button>
      
      {/* Tooltip */}
      {isHovered && !isOpen && (
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl whitespace-nowrap animate-fade-in">
          <div className="font-medium">AI Analytics Assistant</div>
          <div className="text-xs text-gray-300">Ask me about learning data</div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
      
      {/* Floating action hints */}
      {!isOpen && (
        <div className="absolute -top-12 -left-8 opacity-70 animate-bounce">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
            <Search className="h-3 w-3 inline mr-1" />
            Ask me anything
          </div>
        </div>
      )}
    </div>
  );
}
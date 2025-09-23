import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus,
  X,
  MessageCircle,
  Send
} from "lucide-react";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [query, setQuery] = useState("");

  const handleSendQuery = () => {
    if (!query.trim()) return;
    console.log("Sending query:", query);
    setQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendQuery();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl border z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-medium text-gray-900">AI Assistant</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Greeting */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Hi there,<br />How can I help you?
            </h3>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              size="sm"
            >
              <Search className="h-4 w-4 mr-2" />
              Search for a dashboard or visualization
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create a new visualization
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Answer a business question
            </Button>
          </div>

          {/* Input Field */}
          <div className="relative">
            <Input
              placeholder="What is the number of returns for product category?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={handleSendQuery}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center">
            AI assistants can make mistakes. Check before relying on these answers.
          </p>
        </div>
      </div>
    </>
  );
}
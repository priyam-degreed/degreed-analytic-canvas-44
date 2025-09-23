import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Send, 
  Plus,
  X,
  TrendingUp
} from "lucide-react";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickActions = [
  { icon: Search, label: "Search dashboards", query: "Show me learning engagement dashboards" },
  { icon: Plus, label: "Create visualization", query: "Create a chart showing course completion rates" },
  { icon: TrendingUp, label: "Answer a business question", query: "What is the learning completion rate by department?" }
];

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
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

  const handleQuickAction = (actionQuery: string) => {
    setQuery(actionQuery);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
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
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-xl text-gray-800">Hi there,</h3>
            <h3 className="font-semibold text-xl text-gray-800">How can I help you?</h3>
          </div>
          
          {/* Quick Actions */}
          <div className="grid gap-2">
            {quickActions.map((action, idx) => (
              <Button 
                key={idx}
                variant="outline" 
                className="h-12 w-full justify-start text-left"
                onClick={() => handleQuickAction(action.query)}
              >
                <action.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                {action.label}
              </Button>
            ))}
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
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TopNavigation } from "./TopNavigation";
import { AppSidebar } from "./AppSidebar";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation - Fixed at top */}
      <TopNavigation />
      
      {/* Content area with sidebar and main content */}
      <div className="flex-1 flex">
        {/* Sidebar - starts below navigation */}
        <AppSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 p-6 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}>
          <Outlet />
        </main>
      </div>

      {/* Create with AI Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setAiChatOpen(!aiChatOpen)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-4 py-3 rounded-lg text-sm font-medium"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Create with AI
        </Button>
      </div>
      
      {/* AI Assistant Modal */}
      <AIAssistant 
        isOpen={aiChatOpen} 
        onClose={() => setAiChatOpen(false)} 
      />
    </div>
  );
}
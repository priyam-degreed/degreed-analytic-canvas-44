import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TopNavigation } from "./TopNavigation";
import { AppSidebar } from "./AppSidebar";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { AIStickyIcon } from "@/components/ai/AIStickyIcon";
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
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* AI Assistant */}
      <AIStickyIcon 
        onClick={() => setAiChatOpen(!aiChatOpen)} 
        isOpen={aiChatOpen}
      />
      <AIAssistant 
        isOpen={aiChatOpen} 
        onClose={() => setAiChatOpen(false)} 
      />
    </div>
  );
}
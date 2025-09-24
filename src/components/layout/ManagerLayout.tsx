import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TopNavigation } from "./TopNavigation";
import { ManagerSidebar } from "./ManagerSidebar";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { AIStickyIcon } from "@/components/ai/AIStickyIcon";
import { cn } from "@/lib/utils";

export function ManagerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation - Fixed at top */}
      <TopNavigation />
      
      {/* Content area with sidebar and main content */}
      <div className="flex-1 flex">
        {/* Manager Sidebar - starts below navigation */}
        <ManagerSidebar 
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
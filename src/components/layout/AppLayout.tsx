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
      {/* Top Navigation */}
      <TopNavigation />
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <AppSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}>
          <div className="p-6">
            <Outlet />
          </div>
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
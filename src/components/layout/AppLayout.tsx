import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Menu, Bell, Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { AIStickyIcon } from "@/components/ai/AIStickyIcon";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { value: "guidebook", label: "Guidebook", path: "/" }
  ];

  // Determine active tab based on current path
  const getActiveTab = () => {
    // Only guidebook tab exists now
    return "guidebook";
  };

  const handleTabChange = (value: string) => {
    const tab = tabs.find(t => t.value === value);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/50">
      <div className="flex">
        {/* Sidebar - only show for Guidebook tab */}
        {getActiveTab() === "guidebook" && (
          <AppSidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "min-h-screen", // Account for no header
          getActiveTab() === "guidebook" ? (sidebarCollapsed ? "ml-16" : "ml-64") : "ml-0"
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
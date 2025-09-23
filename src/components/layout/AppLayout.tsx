import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Menu, Bell, Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { value: "guidebook", label: "Guidebook", path: "/" },
    { value: "explore", label: "Explore", path: "/explore" },
    { value: "captures", label: "Captures", path: "/captures" },
    { value: "analyses", label: "Analyses", path: "/analyses" },
    { value: "search", label: "Search", path: "/search" }
  ];

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    
    // Check specific paths first (more specific matches)
    if (path === "/explore") return "explore";
    if (path === "/captures") return "captures";
    if (path === "/analyses") return "analyses";
    if (path === "/search") return "search";
    
    // Default to guidebook for root path and all dashboard-related paths
    if (path === "/" || path.startsWith("/overview") || path.startsWith("/learning") || path.startsWith("/skills") || path.startsWith("/ai") || path.startsWith("/analysis") || path.startsWith("/settings")) {
      return "guidebook";
    }
    
    return "guidebook"; // fallback
  };

  const handleTabChange = (value: string) => {
    const tab = tabs.find(t => t.value === value);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="gradient-primary w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline">Degreed Advanced Analytics</span>
          </div>

          <div className="flex-1 flex items-center gap-4 justify-end">
            <div className="hidden md:flex items-center gap-2 max-w-sm w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search analytics..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-fast"
                />
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-6">
          <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-full">
            <TabsList className="h-12 w-full justify-start bg-transparent p-0 border-b-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-6 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none",
                    getActiveTab() === tab.value && "border-primary text-foreground"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

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
          "min-h-[calc(100vh-8rem)]", // Account for header and tab height
          getActiveTab() === "guidebook" ? (sidebarCollapsed ? "ml-16" : "ml-64") : "ml-0"
        )}>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
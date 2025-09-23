import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

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

      <div className="flex">
        {/* Sidebar */}
        <AppSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "min-h-[calc(100vh-4rem)]", // Account for header height
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
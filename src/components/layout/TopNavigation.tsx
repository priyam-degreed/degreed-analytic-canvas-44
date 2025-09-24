import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Search, Bell, User, Settings, HelpCircle, LogOut, BarChart3, Database, TrendingUp, Activity, Shield, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SearchDropdown } from "@/components/ai/SearchDropdown";
import { useViewMode } from "@/contexts/ViewModeContext";
export function TopNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { viewMode, setViewMode, isManagerView } = useViewMode();
  
  // Handle Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        // Focus the search input
        const input = searchRef.current?.querySelector('input');
        if (input) input.focus();
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const navigationItems = [{
    id: "dashboards",
    label: "Dashboards",
    icon: BarChart3,
    path: "/",
    active: location.pathname === "/" || location.pathname.startsWith("/dashboards")
  }, {
    id: "analyze",
    label: "Analyze",
    icon: TrendingUp,
    path: "/analyses",
    active: location.pathname.startsWith("/analyses")
  }, {
    id: "metrics",
    label: "Metrics",
    icon: Activity,
    path: "/metrics",
    active: location.pathname.startsWith("/metrics")
  }];
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearchOpen(true);
  };

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  const handleSuggestedQuery = (query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(true);
  };
  return <nav className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 text-lg">
                Degreed Advanced Analytics
              </h1>
            </div>
          </div>

          {/* Navigation Menu */}
          
        </div>

        {/* Right Section - View Mode Switch, Search and User Actions */}
        <div className="flex items-center space-x-4">
          {/* View Mode Switch */}
          <div className="flex items-center space-x-3 border-r border-border pr-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Admin</span>
            </div>
            <Switch
              checked={isManagerView}
              onCheckedChange={(checked) => setViewMode(checked ? 'manager' : 'admin')}
              className="data-[state=checked]:bg-accent"
            />
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Manager</span>
            </div>
            {isManagerView && (
              <Badge variant="secondary" className="text-xs">
                Scope: Direct Reports
              </Badge>
            )}
          </div>
          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input 
                type="text" 
                placeholder="Search dashboards, metrics..." 
                value={searchQuery} 
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className="pl-10 pr-16 py-2 w-80 bg-muted/50 border-border focus:bg-background focus:ring-2 focus:ring-ring focus:border-transparent" 
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                Ctrl K
              </kbd>
            </div>
            
            {/* Search Dropdown */}
            <SearchDropdown
              query={searchQuery}
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onSuggestedQuery={handleSuggestedQuery}
            />
          </div>

          {/* Notifications */}
          

          {/* Help */}
          

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Priyam Ja...</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>;
}
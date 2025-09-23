import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  Target,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Brain,
  ChevronLeft,
  ChevronRight,
  Home,
  PieChart,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    title: "Overview",
    items: [
      { name: "Strategic Overview", path: "/overview/strategic", icon: TrendingUp },
      { name: "Operational Review", path: "/overview/operational", icon: Activity },
    ]
  },
  {
    title: "Learning Analytics",
    items: [
      { name: "Executive Overview", path: "/learning/executive", icon: BarChart3 },
      { name: "Engagement Overview", path: "/learning/engagement", icon: Users },
      { name: "Impact Overview", path: "/learning/impact", icon: Target },
      { name: "Assignment Deep Dive", path: "/learning/assignments", icon: BookOpen },
      { name: "Operations Deep Dive", path: "/learning/operations", icon: FileText },
    ]
  },
  {
    title: "Guided Analysis",
    items: [
      { name: "Skills Adoption", path: "/skills/adoption", icon: Target },
      { name: "Skills Planning", path: "/skills/planning", icon: Calendar },
    ]
  },
  {
    title: "AI Assistant",
    items: [
      { name: "AI Insights", path: "/ai/insights", icon: Brain },
      { name: "Smart Search", path: "/ai/search", icon: MessageSquare },
    ]
  }
];

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 ease-in-out z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="hidden md:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "absolute -right-3 top-4 z-50 h-6 w-6 rounded-full border bg-background shadow-md transition-fast",
            "hover:bg-accent"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Navigation Content */}
      <div className="flex flex-col h-full p-3 gap-2">
        {/* Home/Dashboard Link */}
        <NavLink
          to="/"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-fast",
            "hover:bg-accent/50",
            isActive ? "bg-primary text-primary-foreground shadow-primary" : "text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <div className="h-px bg-border my-2" />

        {/* Navigation Groups */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {navigationItems.map((group) => (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h4>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-fast",
                      "hover:bg-accent/50",
                      isActive ? "bg-primary text-primary-foreground shadow-primary" : "text-foreground",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </NavLink>
                ))}
              </div>
              {!collapsed && group !== navigationItems[navigationItems.length - 1] && (
                <div className="h-px bg-border/50 my-3" />
              )}
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="border-t pt-3">
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-fast",
              "hover:bg-accent/50",
              isActive ? "bg-primary text-primary-foreground shadow-primary" : "text-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </div>
    </div>
  );
}
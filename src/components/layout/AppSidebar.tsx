import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
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
  ChevronDown,
  Home,
  PieChart,
  Activity,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
    title: "Learning Overview Dashboard",
    items: [
      { name: "Executive Overview", path: "/learning/executive", icon: BarChart3 },
      { name: "Engagement Overview", path: "/learning/engagement", icon: Users },
      { name: "Impact Overview", path: "/learning/impact", icon: Target },
    ]
  },
  {
    title: "Learning Guided Insights",
    items: [
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
    title: "Analysis Template",
    items: [
      { name: "Skill Tracker", path: "/analysis/skill-tracker", icon: PieChart },
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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Overview": false,
    "Learning Overview Dashboard": false,
    "Learning Guided Insights": false,
    "Guided Analysis": false,
    "Analysis Template": false,
    "AI Assistant": false,
  });

  const isActive = (path: string) => location.pathname === path;
  
  const toggleGroup = (groupTitle: string) => {
    if (!collapsed) {
      setOpenGroups(prev => ({
        ...prev,
        [groupTitle]: !prev[groupTitle]
      }));
    }
  };

  const isGroupActive = (group: typeof navigationItems[0]) => {
    return group.items.some(item => isActive(item.path));
  };

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
        {/* Create Dashboard Button */}
        <div className="mb-4">
          <Button 
            className={cn(
              "w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Create Dashboard" : undefined}
          >
            {collapsed ? (
              <Plus className="h-4 w-4" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Dashboard
              </>
            )}
          </Button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {navigationItems.map((group) => (
            <Collapsible 
              key={group.title}
              open={collapsed ? true : openGroups[group.title]}
              onOpenChange={() => toggleGroup(group.title)}
            >
              <div className="space-y-1">
                {!collapsed ? (
                  <CollapsibleTrigger asChild>
                    <button className={cn(
                      "flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors text-left",
                      isGroupActive(group) && "text-primary"
                    )}>
                      <ChevronDown className={cn(
                        "h-3 w-3 transition-transform shrink-0",
                        openGroups[group.title] ? "rotate-180" : ""
                      )} />
                      <span>{group.title}</span>
                    </button>
                  </CollapsibleTrigger>
                ) : (
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                          "flex items-center justify-center px-2 py-2 rounded-lg text-sm font-medium transition-fast",
                          "hover:bg-accent/50",
                          isActive ? "bg-primary text-primary-foreground shadow-primary" : "text-foreground"
                        )}
                        title={item.name}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                      </NavLink>
                    ))}
                  </div>
                )}
                
                {!collapsed && (
                  <CollapsibleContent className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-3 py-2 ml-2 rounded-lg text-sm font-medium transition-fast",
                          "hover:bg-accent/50",
                          isActive ? "bg-primary text-primary-foreground shadow-primary" : "text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.name}</span>
                      </NavLink>
                    ))}
                  </CollapsibleContent>
                )}
              </div>
              {!collapsed && group !== navigationItems[navigationItems.length - 1] && (
                <div className="h-px bg-border/50 my-3" />
              )}
            </Collapsible>
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
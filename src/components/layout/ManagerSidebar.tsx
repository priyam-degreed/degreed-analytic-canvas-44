import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ShareDashboardDialog } from "@/components/dashboard/ShareDashboardDialog";
import {
  BarChart3,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Activity,
  Plus,
  MoreVertical,
  Share,
  Download,
  Copy,
  PieChart,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface ManagerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface Dashboard {
  id: string;
  name: string;
  path: string;
  scope: "direct-reports" | "self";
}

// Manager-specific dashboards with limited scope
const managerDashboards: Dashboard[] = [
  { id: "M01", name: "Team Learning Overview", path: "/manager/team-learning", scope: "direct-reports" },
  { id: "M02", name: "Skills Development", path: "/manager/skills-development", scope: "direct-reports" },
  { id: "M03", name: "Individual Progress", path: "/manager/individual-progress", scope: "direct-reports" },
  { id: "M04", name: "Team Performance", path: "/manager/team-performance", scope: "direct-reports" },
  { id: "M05", name: "My Learning", path: "/manager/my-learning", scope: "self" }
];

// Manager-specific navigation with limited scope
const managerNavigationItems = [
  {
    title: "Team Overview",
    items: [
      { name: "Team Dashboard", path: "/manager/dashboard", icon: BarChart3 },
      { name: "Team Metrics", path: "/manager/team-metrics", icon: Activity },
    ]
  },
  {
    title: "Learning Management",
    items: [
      { name: "Team Progress", path: "/manager/team-progress", icon: TrendingUp },
      { name: "Individual Reports", path: "/manager/individual-reports", icon: Users },
      { name: "Skills Matrix", path: "/manager/skills-matrix", icon: Target },
    ]
  },
  {
    title: "Development Planning", 
    items: [
      { name: "Learning Paths", path: "/manager/learning-paths", icon: BookOpen },
      { name: "Goal Setting", path: "/manager/goal-setting", icon: Calendar },
    ]
  },
  {
    title: "Personal Development",
    items: [
      { name: "My Progress", path: "/manager/my-progress", icon: PieChart },
    ]
  }
];

export function ManagerSidebar({ collapsed, onToggle }: ManagerSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Team Overview": true,
    "Learning Management": false,
    "Development Planning": false,
    "Personal Development": false,
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const isActive = (path: string) => location.pathname === path;
  
  const toggleGroup = (groupTitle: string) => {
    if (!collapsed) {
      setOpenGroups(prev => ({
        ...prev,
        [groupTitle]: !prev[groupTitle]
      }));
    }
  };

  const isGroupActive = (group: typeof managerNavigationItems[0]) => {
    return group.items.some(item => isActive(item.path));
  };

  const handleMenuToggle = (dashboardId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenuId(openMenuId === dashboardId ? null : dashboardId);
  };

  const handleMenuAction = (action: string, dashboard: Dashboard) => {
    console.log(`${action} dashboard:`, dashboard.name);
    setOpenMenuId(null);
    switch (action) {
      case 'share':
        setSelectedDashboard(dashboard);
        setShareDialogOpen(true);
        break;
      case 'export-pdf':
        // Export as PDF with manager scope
        console.log('Exporting as PDF with scope:', dashboard.scope);
        break;
      case 'export-ppt':
        // Export as PPT with manager scope
        console.log('Exporting as PPT with scope:', dashboard.scope);
        break;
      case 'save-as-new':
        console.log('Creating copy of dashboard:', dashboard.name);
        break;
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !Object.values(menuRefs.current).some(ref => ref?.contains(event.target as Node))) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out z-30",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className={cn(
          "absolute -right-4 top-20 z-50 h-8 w-8 rounded-full bg-white shadow-lg transition-all duration-200",
          "hover:bg-gray-50 hover:shadow-xl border-2 border-gray-300 hover:border-primary",
          "flex items-center justify-center"
        )}
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-700" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        )}
      </Button>

      {/* Navigation Content */}
      <div className="flex flex-col h-full pt-24 p-3 gap-2">
        {/* Manager Role Indicator */}
        {!collapsed && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Manager View</span>
            </div>
            <p className="text-xs text-blue-700">
              Limited to direct reports & personal data
            </p>
          </div>
        )}

        {/* Manager Dashboard List */}
        {!collapsed && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 px-4 py-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                MANAGER DASHBOARDS
              </h3>
            </div>
            <div className="space-y-1">
              {managerDashboards.map((dashboard) => (
                <div key={dashboard.id} className="relative">
                  <NavLink
                    to={dashboard.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-fast group",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-primary font-medium" 
                        : "text-foreground hover:bg-accent/50"
                    )}
                  >
                    <BarChart3 className="h-4 w-4 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">{dashboard.id} {dashboard.name}</div>
                      <div className="text-xs opacity-70">
                        {dashboard.scope === 'direct-reports' ? 'Team Scope' : 'Personal Scope'}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20",
                        isActive(dashboard.path) && "text-primary-foreground hover:bg-white/20"
                      )}
                      onClick={(e) => handleMenuToggle(dashboard.id, e)}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </NavLink>
                  
                  {/* Dropdown Menu - Only Share and Export options */}
                  {openMenuId === dashboard.id && (
                    <div
                      ref={(el) => menuRefs.current[dashboard.id] = el}
                      className="absolute right-3 top-full mt-1 w-40 bg-popover border border-border rounded-md shadow-lg z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleMenuAction('share', dashboard)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <Share className="h-3 w-3" />
                          Share
                        </button>
                        <button
                          onClick={() => handleMenuAction('export-pdf', dashboard)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <Download className="h-3 w-3" />
                          Export PDF
                        </button>
                        <button
                          onClick={() => handleMenuAction('export-ppt', dashboard)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <FileText className="h-3 w-3" />
                          Export PPT
                        </button>
                        <button
                          onClick={() => handleMenuAction('save-as-new', dashboard)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <Copy className="h-3 w-3" />
                          Save As New
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manager Navigation Groups */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {managerNavigationItems.map((group) => (
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
              {!collapsed && group !== managerNavigationItems[managerNavigationItems.length - 1] && (
                <div className="h-px bg-border/50 my-3" />
              )}
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Share Dashboard Dialog */}
      <ShareDashboardDialog
        isOpen={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
          setSelectedDashboard(null);
        }}
        dashboardName={selectedDashboard?.name || "Dashboard"}
      />
    </div>
  );
}
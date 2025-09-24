import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ShareDashboardDialog } from "@/components/dashboard/ShareDashboardDialog";
import { useViewMode } from "@/contexts/ViewModeContext";
import {
  BarChart3,
  BookOpen,
  Target,
  MessageSquare,
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
  Plus,
  MoreVertical,
  Edit,
  Share,
  Download,
  Trash2,
  Copy,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface Dashboard {
  id: string;
  name: string;
  path: string;
}

// Admin dashboards (full access)
const adminDashboards: Dashboard[] = [
  { id: "01", name: "Learning Dashboard", path: "/dashboards/learning-engagement" },
  { id: "02", name: "Skills Dashboard", path: "/dashboards/skill-insights" },
  { id: "03", name: "Drill Down Paths", path: "/dashboards/drill-down" },
  { id: "04", name: "Performance Dashboard", path: "/dashboards/content-performance" },
  { id: "05", name: "Engagement Overview", path: "/dashboards/engagement-overview" }
];

// Manager dashboards (limited scope with realistic data)
const managerDashboards: Dashboard[] = [
  { id: "M1", name: "Team Learning Progress", path: "/dashboards/learning-engagement" },
  { id: "M2", name: "Direct Reports Skills", path: "/dashboards/skill-insights" },
  { id: "M3", name: "Individual Development Plans", path: "/dashboards/career-development" },
  { id: "M4", name: "Team Engagement Overview", path: "/dashboards/engagement-overview" },
  { id: "M5", name: "Content Performance (Team)", path: "/dashboards/content-performance" }
];

// Admin navigation items (full access)
const adminNavigationItems = [
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
  }
];

// Manager navigation items (limited scope) - No additional navigation sections
const managerNavigationItems: typeof adminNavigationItems = [];

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isManagerView } = useViewMode();
  
  // Dynamic navigation and dashboard items based on view mode
  const navigationItems = isManagerView ? managerNavigationItems : adminNavigationItems;
  const dashboards = isManagerView ? managerDashboards : adminDashboards;
  
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Overview": false,
    "Learning Overview Dashboard": false,
    "Learning Guided Insights": false,
    "Guided Analysis": false,
    "Analysis Template": false,
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

  const isGroupActive = (group: typeof navigationItems[0]) => {
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
      case 'edit':
        // Navigate to edit mode (admin only)
        navigate(`/dashboard-builder/${dashboard.id}/edit`);
        break;
      case 'share':
        // Open share dialog
        setSelectedDashboard(dashboard);
        setShareDialogOpen(true);
        break;
      case 'export':
        // Trigger PDF export functionality
        console.log(`Exporting ${dashboard.name} as PDF`);
        break;
      case 'export-ppt':
        // Trigger PPT export functionality
        console.log(`Exporting ${dashboard.name} as PowerPoint`);
        break;
      case 'save-as-new':
        // Create a copy of the dashboard (admin only)
        break;
      case 'delete':
        // Show confirmation dialog and delete (admin only)
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
      {/* Toggle Button - Enhanced visibility and positioning */}
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

      {/* Navigation Content - positioned below navbar with better spacing */}
      <div className="flex flex-col h-full pt-24 p-3 gap-2">
        {/* Dashboard List */}
        {!collapsed && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 px-4 py-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {isManagerView ? 'TEAM DASHBOARDS' : 'DASHBOARDS'}
              </h3>
              {!isManagerView && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                  title="Create Dashboard"
                  onClick={() => navigate('/dashboard-builder')}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="space-y-1">
              {dashboards.map((dashboard) => (
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
                    <span className="flex-1 font-medium">{dashboard.id} {dashboard.name}</span>
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
                  
                  {/* Dropdown Menu - Different options for admin vs manager */}
                  {openMenuId === dashboard.id && (
                    <div
                      ref={(el) => menuRefs.current[dashboard.id] = el}
                      className="absolute right-3 top-full mt-1 w-40 bg-popover border border-border rounded-md shadow-lg z-50"
                    >
                      <div className="py-1">
                        {/* Available for both admin and manager */}
                        <button
                          onClick={() => handleMenuAction('share', dashboard)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <Share className="h-3 w-3" />
                          Share
                        </button>
                        <button
                          onClick={() => handleMenuAction('export', dashboard)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <Download className="h-3 w-3" />
                          Export (PDF)
                        </button>
                        <button
                          onClick={() => handleMenuAction('export-ppt', dashboard)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <Download className="h-3 w-3" />
                          Export (PPT)
                        </button>
                        
                        {/* Admin-only actions */}
                        {!isManagerView && (
                          <>
                            <hr className="my-1 border-border" />
                            <button
                              onClick={() => handleMenuAction('edit', dashboard)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleMenuAction('save-as-new', dashboard)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                            >
                              <Copy className="h-3 w-3" />
                              Save As New
                            </button>
                            <button
                              onClick={() => handleMenuAction('delete', dashboard)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
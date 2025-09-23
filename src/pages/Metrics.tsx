import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, MoreHorizontal, Edit, Copy, Trash2, HelpCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Metrics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMetricName, setNewMetricName] = useState("");
  const [newMetricId, setNewMetricId] = useState("");
  const [newMetricDescription, setNewMetricDescription] = useState("");
  const [newMetricQuery, setNewMetricQuery] = useState("");

  const [metrics, setMetrics] = useState([
    { 
      name: "Completions", 
      id: "completions",
      description: "Track completion rates across all learning activities",
      query: "SELECT COUNT(*) FROM completions WHERE status = 'completed'"
    },
    { 
      name: "Learning Duration", 
      id: "learning_duration",
      description: "Average time spent on learning activities",
      query: "SELECT AVG(duration_minutes) FROM learning_sessions"
    },
    { 
      name: "Learning Duration in Hours", 
      id: "learning_duration_in_hours",
      description: "Total learning time converted to hours",
      query: "SELECT SUM(duration_minutes)/60 FROM learning_sessions"
    },
    { 
      name: "Learning Duration in Hours (Difference - skills from PP)", 
      id: "learning_duration_in_hours_difference_-_skills_from_pp",
      description: "Comparison of learning hours between current and previous period for skills from PP",
      query: "SELECT AVG(current.hours - previous.hours) FROM skills_learning current JOIN skills_learning previous"
    },
    { 
      name: "Learning Duration in Hours (Difference)", 
      id: "learning_duration_in_hours_difference",
      description: "Period-over-period difference in learning hours",
      query: "SELECT current_period.hours - previous_period.hours FROM learning_stats"
    },
    { 
      name: "Learning Duration in Hours (Previous Period - skills from PP)", 
      id: "learning_duration_in_hours_previous_period_-_skills_from_pp",
      description: "Previous period learning hours for skills from Performance Platform",
      query: "SELECT SUM(duration_hours) FROM previous_period WHERE source = 'performance_platform'"
    },
    { 
      name: "Learning Duration in Hours (Previous Period)", 
      id: "learning_duration_in_hours_previous_period",
      description: "Total learning hours from the previous reporting period",
      query: "SELECT SUM(duration_hours) FROM learning_sessions WHERE period = 'previous'"
    },
    { 
      name: "Learning Duration in Hours (skills from PP)", 
      id: "learning_duration_in_hours_skills_from_pp",
      description: "Learning hours specifically for skills tracked in Performance Platform",
      query: "SELECT SUM(duration_hours) FROM skills_learning WHERE source = 'performance_platform'"
    },
    { 
      name: "Median Peer-Rating", 
      id: "median_peer-rating",
      description: "Median rating given by peers in skill assessments",
      query: "SELECT MEDIAN(rating) FROM peer_ratings WHERE assessment_type = 'skill'"
    },
    { 
      name: "Median Self-Rating", 
      id: "median_self-rating",
      description: "Median self-assessment rating across all skills",
      query: "SELECT MEDIAN(rating) FROM self_ratings WHERE assessment_type = 'skill'"
    },
    { 
      name: "Peer vs Self-Rating (Difference)", 
      id: "peer_vs_self-rating_difference",
      description: "Difference between peer ratings and self-ratings",
      query: "SELECT AVG(peer.rating - self.rating) FROM peer_ratings peer JOIN self_ratings self"
    },
    { 
      name: "Skill Progression", 
      id: "skill_progression",
      description: "Overall skill development progress over time",
      query: "SELECT AVG(current_level - initial_level) FROM skill_progression"
    },
    { 
      name: "Skill Progression (for each month)", 
      id: "skill_progression_for_each_month",
      description: "Monthly skill progression tracking",
      query: "SELECT MONTH(date), AVG(progression_score) FROM monthly_skill_progress GROUP BY MONTH(date)"
    },
    { 
      name: "Test Metric", 
      id: "test_metrics",
      description: "This is the test description with rich text",
      query: "SELECT AVG(Internal Skill Reviews) BY User Skills Details OR PREVIOUS(Completion Completed Date - Day of Week)"
    },
  ]);

  const filteredMetrics = metrics.filter(metric => 
    metric.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateMetric = () => {
    if (!newMetricName.trim() || !newMetricId.trim()) {
      toast.error("Please fill in both name and ID fields");
      return;
    }

    const newMetric = {
      name: newMetricName,
      id: newMetricId,
      description: newMetricDescription,
      query: newMetricQuery
    };

    setMetrics([...metrics, newMetric]);
    setNewMetricName("");
    setNewMetricId("");
    setNewMetricDescription("");
    setNewMetricQuery("");
    setIsCreateModalOpen(false);
    toast.success("Metric created successfully");
  };

  const handleDeleteMetric = (id: string) => {
    setMetrics(metrics.filter(metric => metric.id !== id));
    toast.success("Metric deleted successfully");
  };

  const handleCopyMetric = (metric: { name: string; id: string; description: string; query: string }) => {
    const copiedMetric = {
      name: `${metric.name} (Copy)`,
      id: `${metric.id}_copy`,
      description: metric.description,
      query: metric.query
    };
    setMetrics([...metrics, copiedMetric]);
    toast.success("Metric copied successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Metrics</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for name or ID"
              className="pl-10 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create metric
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Metric</DialogTitle>
                <DialogDescription>
                  Add a new predefined metric that can be reused in dashboards.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter metric name"
                    value={newMetricName}
                    onChange={(e) => setNewMetricName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="id">ID</Label>
                  <Input
                    id="id"
                    placeholder="Enter metric ID"
                    value={newMetricId}
                    onChange={(e) => setNewMetricId(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter metric description"
                    value={newMetricDescription}
                    onChange={(e) => setNewMetricDescription(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="query">Query</Label>
                  <Textarea
                    id="query"
                    placeholder="Enter metric query (e.g., SELECT AVG(field) FROM table)"
                    value={newMetricQuery}
                    onChange={(e) => setNewMetricQuery(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMetric}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="border rounded-lg">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMetrics.map((metric) => (
                <TableRow key={metric.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{metric.name}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-3" side="right">
                          <div className="space-y-2">
                            <div>
                              <p className="font-medium text-sm">{metric.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                            </div>
                            {metric.query && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">DEFINED AS</p>
                                <code className="text-xs bg-muted p-1 rounded block font-mono whitespace-pre-wrap">
                                  {metric.query}
                                </code>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{metric.id}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyMetric(metric)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Make a copy
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteMetric(metric.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </div>
  );
}
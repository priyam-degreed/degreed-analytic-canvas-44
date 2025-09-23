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
import { Label } from "@/components/ui/label";
import { Plus, Search, MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Metrics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMetricName, setNewMetricName] = useState("");
  const [newMetricId, setNewMetricId] = useState("");

  const [metrics, setMetrics] = useState([
    { name: "Completions", id: "completions" },
    { name: "Learning Duration", id: "learning_duration" },
    { name: "Learning Duration in Hours", id: "learning_duration_in_hours" },
    { name: "Learning Duration in Hours (Difference - skills from PP)", id: "learning_duration_in_hours_difference_-_skills_from_pp" },
    { name: "Learning Duration in Hours (Difference)", id: "learning_duration_in_hours_difference" },
    { name: "Learning Duration in Hours (Previous Period - skills from PP)", id: "learning_duration_in_hours_previous_period_-_skills_from_pp" },
    { name: "Learning Duration in Hours (Previous Period)", id: "learning_duration_in_hours_previous_period" },
    { name: "Learning Duration in Hours (skills from PP)", id: "learning_duration_in_hours_skills_from_pp" },
    { name: "Median Peer-Rating", id: "median_peer-rating" },
    { name: "Median Self-Rating", id: "median_self-rating" },
    { name: "Peer vs Self-Rating (Difference)", id: "peer_vs_self-rating_difference" },
    { name: "Skill Progression", id: "skill_progression" },
    { name: "Skill Progression (for each month)", id: "skill_progression_for_each_month" },
    { name: "Test metrics", id: "test_metrics" },
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
      id: newMetricId
    };

    setMetrics([...metrics, newMetric]);
    setNewMetricName("");
    setNewMetricId("");
    setIsCreateModalOpen(false);
    toast.success("Metric created successfully");
  };

  const handleDeleteMetric = (id: string) => {
    setMetrics(metrics.filter(metric => metric.id !== id));
    toast.success("Metric deleted successfully");
  };

  const handleCopyMetric = (metric: { name: string; id: string }) => {
    const copiedMetric = {
      name: `${metric.name} (Copy)`,
      id: `${metric.id}_copy`
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
                <TableCell className="font-medium">{metric.name}</TableCell>
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
      </div>
    </div>
  );
}
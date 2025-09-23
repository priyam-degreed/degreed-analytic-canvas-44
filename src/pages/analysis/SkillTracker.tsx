import { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter, Download, TrendingUp, Users, Target, Eye } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data based on the Skill Tracker PDF
const skillTrackerData = {
  selectedSkill: "Python Programming",
  totalUsers: 1310,
  focusUsers: 302,
  skillsAcquired: {
    starting: 3780,
    ending: 3840,
    change: 60
  },
  followingOverTime: [
    { month: "Nov 2024", users: 800 },
    { month: "Jan 2025", users: 920 },
    { month: "Mar 2025", users: 1050 },
    { month: "May 2025", users: 1180 },
    { month: "Jul 2025", users: 1250 },
    { month: "Sep 2025", users: 1310 }
  ],
  businessUnits: [
    { name: "Unknown", users: 400, focusUsers: 180 },
    { name: "Central City", users: 350, focusUsers: 65 },
    { name: "Gotham City", users: 280, focusUsers: 35 },
    { name: "Metropolis", users: 180, focusUsers: 15 },
    { name: "Technology", users: 100, focusUsers: 7 }
  ],
  focusSkillTrend: [
    { month: "Nov 2024", users: 150 },
    { month: "Jan 2025", users: 180 },
    { month: "Mar 2025", users: 210 },
    { month: "May 2025", users: 250 },
    { month: "Jul 2025", users: 275 },
    { month: "Sep 2025", users: 302 }
  ]
};

const availableSkills = [
  "Python Programming",
  "Data Analytics", 
  "Leadership",
  "Project Management",
  "Cloud Computing",
  "Machine Learning",
  "Digital Marketing"
];

const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function SkillTracker() {
  const [selectedSkill, setSelectedSkill] = useState("Python Programming");

  const trackerMetrics = [
    {
      title: "Total Users Following Skill",
      value: skillTrackerData.totalUsers.toLocaleString(),
      change: {
        value: "+87",
        type: "positive" as const,
        period: "vs last period"
      },
      subtitle: "Currently tracking this skill"
    },
    {
      title: "Users with Focus Skill",
      value: skillTrackerData.focusUsers,
      subtitle: "Actively developing this skill",
      change: {
        value: "+27",
        type: "positive" as const,
        period: "this month"
      }
    },
    {
      title: "Skills Acquired Count",
      value: skillTrackerData.skillsAcquired.ending.toLocaleString(),
      change: {
        value: `+${skillTrackerData.skillsAcquired.change}`,
        type: "positive" as const,
        period: "net change"
      },
      subtitle: `From ${skillTrackerData.skillsAcquired.starting.toLocaleString()} starting`
    },
    {
      title: "Top Business Unit",
      value: skillTrackerData.businessUnits[0].name,
      subtitle: `${skillTrackerData.businessUnits[0].users} users following`
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Skill Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Monitor acquisition, progression & rating of a specific skill within the organization
          </p>
        </div>
        
        {/* Skill Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Select a skill to analyze:</label>
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-3 ml-auto">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Sep 2025
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              All Units
            </Button>
            <Button variant="default" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trackerMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            subtitle={metric.subtitle}
          />
        ))}
      </div>

      {/* Main Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Following Skill Over Time */}
        <ChartCard
          title="How many people are following this skill over time?"
          subtitle={`Users following ${selectedSkill} by month`}
        >
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={skillTrackerData.followingOverTime}>
              <defs>
                <linearGradient id="followingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [value, 'Users Following']}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#followingGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Focus Skill Development */}
        <ChartCard
          title="Are users focusing on developing this skill?"
          subtitle="Users with focus skill trend over time"
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={skillTrackerData.focusSkillTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [value, 'Focus Users']}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Business Unit Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Unit Distribution */}
        <ChartCard
          title="Users Following Skill by Business Unit"
          subtitle="Distribution across organizational units"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={skillTrackerData.businessUnits}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} name="Total Users" />
              <Bar dataKey="focusUsers" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Focus Users" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Skill Movement Analysis */}
        <ChartCard
          title="How is this skill moving within the organization?"
          subtitle="Skill acquisition and progression metrics"
        >
          <div className="space-y-6">
            {/* Acquisition Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground mb-1">
                  {skillTrackerData.skillsAcquired.starting.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Starting Count</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success mb-1">
                  +{skillTrackerData.skillsAcquired.change}
                </div>
                <div className="text-sm text-muted-foreground">Net Change</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {skillTrackerData.skillsAcquired.ending.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Ending Count</div>
              </div>
            </div>

            {/* Business Unit Focus Breakdown */}
            <div>
              <h4 className="font-semibold mb-3">Focus Skill Distribution by Business Unit</h4>
              <div className="space-y-2">
                {skillTrackerData.businessUnits.map((unit, index) => (
                  <div key={unit.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20">
                    <span className="font-medium">{unit.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{unit.users}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium">{unit.focusUsers}</span>
                      </div>
                      <div className="w-16 bg-border rounded-full h-2">
                        <div 
                          className="h-2 bg-accent rounded-full"
                          style={{ width: `${(unit.focusUsers / unit.users) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Detailed Analysis Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Unit Details */}
        <ChartCard
          title="Business Unit Analysis"
          subtitle="Detailed breakdown of skill engagement by unit"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Business Unit</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Total Users</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Focus Users</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Focus Rate</th>
                </tr>
              </thead>
              <tbody>
                {skillTrackerData.businessUnits.map((unit) => (
                  <tr key={unit.name} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3 font-medium">{unit.name}</td>
                    <td className="p-3 text-right">{unit.users}</td>
                    <td className="p-3 text-right font-semibold text-accent">{unit.focusUsers}</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-1 bg-success/10 text-success rounded-md text-xs">
                        {Math.round((unit.focusUsers / unit.users) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Skill Progression Summary */}
        <ChartCard
          title="Skill Progression Summary"
          subtitle="Key insights and recommendations"
        >
          <div className="space-y-4">
            <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-success mt-1" />
                <div>
                  <h4 className="font-medium text-success mb-1">Growing Engagement</h4>
                  <p className="text-sm text-muted-foreground">
                    Skill following increased by 64% over the tracking period, with consistent monthly growth.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-accent mt-1" />
                <div>
                  <h4 className="font-medium text-accent mb-1">Focus Development</h4>
                  <p className="text-sm text-muted-foreground">
                    23% of users following the skill have it as a focus area, indicating strong commitment.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-primary mb-1">Unit Distribution</h4>
                  <p className="text-sm text-muted-foreground">
                    Unknown and Central City units show highest engagement. Consider targeted programs for other units.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Analysis Summary */}
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">{selectedSkill} - Tracking Summary (Sep 2025)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {skillTrackerData.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Following</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {skillTrackerData.focusUsers}
            </div>
            <div className="text-sm text-muted-foreground">Focus Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              +{skillTrackerData.skillsAcquired.change}
            </div>
            <div className="text-sm text-muted-foreground">Skills Acquired</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {skillTrackerData.businessUnits.length}
            </div>
            <div className="text-sm text-muted-foreground">Business Units</div>
          </div>
        </div>
      </div>
    </div>
  );
}
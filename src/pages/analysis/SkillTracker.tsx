import { useState } from "react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter, Download } from "lucide-react";
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

// Exact data from the Skill Tracker PDF
const skillTrackerData = {
  selectedSkill: "Python Programming",
  
  // Page 3: Users Following Skill by Business Unit
  usersFollowingByUnit: [
    { unit: "Unknown", users: 1400, color: "#3b82f6" },
    { unit: "Central City", users: 1000, color: "#06b6d4" },
    { unit: "Gotham City", users: 600, color: "#10b981" },
    { unit: "Metropolis", users: 400, color: "#f59e0b" },
    { unit: "Technology", users: 300, color: "#ef4444" }
  ],
  
  // Timeline data (NOV 2024 to SEP 2025)
  followingOverTime: [
    { period: "NOV 2024", users: 800 },
    { period: "JAN 2025", users: 950 },
    { period: "MAR 2025", users: 1100 },
    { period: "MAY 2025", users: 1200 },
    { period: "JUL 2025", users: 1250 },
    { period: "SEP 2025", users: 1310 }
  ],
  
  totalUsersFollowing: 1310, // 1.31K
  
  // Page 4: Skills Movement
  skillsMovement: {
    startingCount: 3780, // 3.78K
    endingCount: 3840,   // 3.84K
    netChange: 51        // +51
  },
  
  // Page 6: Focus Skills
  focusSkillsByUnit: [
    { unit: "Unknown", focusUsers: 300 },
    { unit: "Hotel One", focusUsers: 2 }
  ],
  
  focusSkillTrend: [
    { period: "NOV 2024", users: 150 },
    { period: "JAN 2025", users: 180 },
    { period: "MAR 2025", users: 220 },
    { period: "MAY 2025", users: 260 },
    { period: "JUL 2025", users: 280 },
    { period: "SEP 2025", users: 302 }
  ],
  
  totalFocusUsers: 302,
  
  // Page 8: Rating Analysis
  ratingAnalysis: {
    medianSelfRating: 4,
    medianPeerRating: 4,
    ratingsByUnit: [
      { unit: "Unknown", selfRating: 4, peerRating: 4 },
      { unit: "Hotel One", selfRating: 1, peerRating: 5 }
    ]
  },
  
  // Page 10: Skill Progression
  skillProgression: 3
};

const availableSkills = [
  "Python Programming",
  "Data Analytics", 
  "Leadership",
  "Project Management",
  "Cloud Computing"
];

export default function SkillTracker() {
  const [selectedSkill, setSelectedSkill] = useState("Python Programming");

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header - Exact match to PDF */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Skill Tracker</h1>
          <p className="text-lg text-muted-foreground mb-4">
            This analysis is designed to help users monitor acquisition, progression & rating of a specific skill within the organization.
          </p>
          <p className="text-base text-muted-foreground mb-6">
            Please select a skill you want to analyze in the global filter down below.
          </p>
        </div>
        
        {/* Time Period and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">Sep 2025</span>
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
          
          <div className="flex items-center gap-3">
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
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Section 1: How many people are following this skill over time? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How many people are following this skill over time?</h2>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Sep 2025</h3>
            <h4 className="text-base font-medium text-muted-foreground mb-4">Users Following this Skill</h4>
            <p className="text-sm text-muted-foreground mb-6">Number of Users in Each Business Unit who are Following this Skill</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Business Unit Chart */}
            <div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={skillTrackerData.usersFollowingByUnit} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis 
                    dataKey="unit" 
                    type="category" 
                    stroke="#6b7280" 
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [value, 'Users Following']}
                  />
                  <Bar dataKey="users" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Timeline Chart */}
            <div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={skillTrackerData.followingOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="period" 
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
                    formatter={(value) => [value, 'Users']}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Total Users Display */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-lg">
              <span className="text-muted-foreground">User:</span>
              <span className="text-2xl font-bold text-primary">{(skillTrackerData.totalUsersFollowing / 1000).toFixed(2)}K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: How is this Skill Moving Within the Organization? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">How is this Skill Moving Within the Organization?</h2>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-6">Sep 2025</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-muted/20 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Acquired Skills Count change</div>
              <div className="text-3xl font-bold text-success">+{skillTrackerData.skillsMovement.netChange}</div>
            </div>
            <div className="text-center p-6 bg-muted/20 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Starting Acquired Skills Count</div>
              <div className="text-3xl font-bold text-muted-foreground">{(skillTrackerData.skillsMovement.startingCount / 1000).toFixed(2)}K</div>
            </div>
            <div className="text-center p-6 bg-muted/20 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Ending Acquired Skills Count</div>
              <div className="text-3xl font-bold text-primary">{(skillTrackerData.skillsMovement.endingCount / 1000).toFixed(2)}K</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Are my users focusing on developing this skill? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Are my users focusing on developing this skill?</h2>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Sep 2025</h3>
            <h4 className="text-base font-medium text-muted-foreground mb-6">Users with Focus Skill</h4>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Focus Users by Business Unit */}
            <div>
              <div className="space-y-4">
                <h5 className="font-medium">Users with Focus Skill by Business Unit</h5>
                <div className="space-y-3">
                  {skillTrackerData.focusSkillsByUnit.map((item) => (
                    <div key={item.unit} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="font-medium">{item.unit}</span>
                      <span className="text-xl font-bold text-accent">{item.focusUsers}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Focus Skill Trend */}
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={skillTrackerData.focusSkillTrend}>
                  <defs>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="period" 
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
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#focusGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Total Focus Users */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-lg">
              <span className="text-muted-foreground">User:</span>
              <span className="text-2xl font-bold text-accent">{skillTrackerData.totalFocusUsers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: What does the median rating look like for this skill? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">What does the median rating look like for this skill?</h2>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Sep 2025</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Median Self Rating */}
            <div className="text-center p-6 bg-muted/20 rounded-lg">
              <h4 className="text-base font-medium text-muted-foreground mb-4">Median Self Rating by Business Unit</h4>
              <div className="space-y-3 mb-4">
                {skillTrackerData.ratingAnalysis.ratingsByUnit.map((item) => (
                  <div key={item.unit} className="flex justify-between">
                    <span>{item.unit}</span>
                    <span className="font-bold">{item.selfRating}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Median Self Rating</div>
                <div className="text-4xl font-bold text-primary">{skillTrackerData.ratingAnalysis.medianSelfRating}</div>
              </div>
            </div>

            {/* Median Peer Rating */}
            <div className="text-center p-6 bg-muted/20 rounded-lg">
              <h4 className="text-base font-medium text-muted-foreground mb-4">Median Peer Rating by Business Unit</h4>
              <div className="space-y-3 mb-4">
                {skillTrackerData.ratingAnalysis.ratingsByUnit.map((item) => (
                  <div key={item.unit} className="flex justify-between">
                    <span>{item.unit}</span>
                    <span className="font-bold">{item.peerRating}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Median Peer Rating</div>
                <div className="text-4xl font-bold text-accent">{skillTrackerData.ratingAnalysis.medianPeerRating}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Are users making progress on this skill? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Are users making progress on this skill?</h2>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">Sep 2025</h3>
            <h4 className="text-base font-medium text-muted-foreground mb-4">Skill Progression by Business Unit</h4>
          </div>
          
          <div className="text-center p-8 bg-muted/20 rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Skill Progression</div>
            <div className="text-6xl font-bold text-success">{skillTrackerData.skillProgression}</div>
          </div>
        </div>
      </div>

      {/* Summary Footer - Match PDF Style */}
      <div className="mt-12 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-border">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Skill Tracker Summary - Sep 2025</h3>
          <p className="text-muted-foreground">Tracking {selectedSkill} across the organization</p>
        </div>
      </div>
    </div>
  );
}
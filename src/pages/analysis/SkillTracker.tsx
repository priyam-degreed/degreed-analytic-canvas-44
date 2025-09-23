import { useState } from "react";
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
  ComposedChart
} from "recharts";

// Exact data matching the PDF visualizations
const skillTrackerData = {
  // Page 3: Users Following Skill - Exact PDF data
  businessUnitsFollowing: [
    { name: "Unknown", value: 1400, displayValue: "1.4K" },
    { name: "Central City", value: 1000, displayValue: "1K" },
    { name: "Gotham City", value: 600, displayValue: "600" },
    { name: "Metropolis", value: 400, displayValue: "400" },
    { name: "Technology", value: 300, displayValue: "300" }
  ],
  
  // Timeline for following (NOV 2024 - SEP 2025)
  followingTimeline: [
    { period: "NOV\n2024", shortPeriod: "NOV", users: 800 },
    { period: "JAN\n2025", shortPeriod: "JAN", users: 950 },
    { period: "MAR\n2025", shortPeriod: "MAR", users: 1100 },
    { period: "MAY\n2025", shortPeriod: "MAY", users: 1200 },
    { period: "JUL\n2025", shortPeriod: "JUL", users: 1250 },
    { period: "SEP\n2025", shortPeriod: "SEP", users: 1310 }
  ],
  
  totalFollowing: "1.31K",
  
  // Page 4: Skills Movement - Exact PDF values
  skillsMovement: {
    acquiredSkillsChange: 51,
    startingCount: "3.78K",
    endingCount: "3.84K"
  },
  
  // Page 6: Focus Skills - Exact PDF data
  focusSkillsUnits: [
    { name: "Unknown", value: 300 },
    { name: "Hotel One", value: 2 }
  ],
  
  // Focus skills timeline
  focusTimeline: [
    { period: "NOV\n2024", users: 150 },
    { period: "JAN\n2025", users: 180 },
    { period: "MAR\n2025", users: 220 },
    { period: "MAY\n2025", users: 260 },
    { period: "JUL\n2025", users: 280 },
    { period: "SEP\n2025", users: 302 }
  ],
  
  totalFocusUsers: 302,
  
  // Page 8: Rating data - Exact PDF values
  ratings: {
    selfRatingByUnit: [
      { unit: "Unknown", rating: 4 },
      { unit: "Hotel One", rating: 1 }
    ],
    peerRatingByUnit: [
      { unit: "Unknown", rating: 4 },
      { unit: "Hotel One", rating: 5 }
    ],
    medianSelfRating: 4,
    medianPeerRating: 4
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
    <div className="space-y-12 max-w-7xl mx-auto p-6">
      {/* Header Section - Exact PDF Layout */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-foreground">Skill Tracker</h1>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
          This analysis is designed to help users monitor acquisition, progression & rating of a specific skill within the organization.
        </p>
        <p className="text-base text-muted-foreground">
          Please select a skill you want to analyze in the global filter down below.
        </p>
        <div className="text-xl font-semibold mt-6">Sep 2025</div>
        
        <div className="flex justify-center mt-6">
          <Select value={selectedSkill} onValueChange={setSelectedSkill}>
            <SelectTrigger className="w-80">
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
      </div>

      {/* Page 3: How many people are following this skill over time? */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-foreground text-center">
          How many people are following this skill over time?
        </h2>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Sep 2025</h3>
          <h4 className="text-lg font-medium text-primary mb-4">Users Following this Skill</h4>
          <p className="text-sm text-muted-foreground mb-8">
            Number of Users in Each Business Unit who are Following this Skill
          </p>
        </div>

        {/* Main Chart Section - Two charts side by side like PDF */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Left: Horizontal Bar Chart - Business Units */}
          <div className="bg-white border rounded-lg p-6">
            <div className="mb-6">
              <div className="text-sm font-medium text-muted-foreground mb-4">Sep 2025</div>
              <div className="text-xs text-muted-foreground mb-4">Number of Skills Being Followed: 1</div>
            </div>
            
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={skillTrackerData.businessUnitsFollowing}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  domain={[0, 1600]}
                  ticks={[0, 200, 400, 600, 800, 1000, 1200, 1400]}
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  stroke="#666"
                  fontSize={12}
                  width={90}
                />
                <Tooltip 
                  formatter={(value, name) => [value, 'Users']}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#4285f4"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Timeline labels like PDF */}
            <div className="text-xs text-muted-foreground text-center mt-4">
              <div>NOV JAN MAR MAY JUL SEP NOV JAN MAR MAY JUL SEP</div>
              <div className="mt-1">2024 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2025 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2025</div>
            </div>
          </div>

          {/* Right: Timeline Chart */}
          <div className="bg-white border rounded-lg p-6">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart 
                data={skillTrackerData.followingTimeline}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="shortPeriod"
                  stroke="#666"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  domain={[0, 1600]}
                  ticks={[0, 200, 400, 600, 800, 1000, 1200, 1400]}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Users Following']}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#4285f4"
                  strokeWidth={3}
                  dot={{ fill: '#4285f4', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#4285f4', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Users Display - Matching PDF */}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">User</div>
            <div className="text-3xl font-bold text-primary">{skillTrackerData.totalFollowing}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">User</div>
            <div className="text-3xl font-bold text-primary">{skillTrackerData.totalFollowing}</div>
          </div>
        </div>
      </div>

      {/* Page 4: How is this Skill Moving Within the Organization? */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-foreground text-center">
          How is this Skill Moving Within the Organization?
        </h2>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold">Sep 2025</h3>
        </div>

        {/* Skills Movement Table - Exact PDF Layout */}
        <div className="bg-white border rounded-lg p-8">
          <div className="max-w-4xl mx-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="p-4 text-sm font-medium text-muted-foreground">Acquired Skills Count change</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Starting Acquired Skills Count</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Ending Acquired Skills Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-6">
                    <div className="text-4xl font-bold text-success">+{skillTrackerData.skillsMovement.acquiredSkillsChange}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-4xl font-bold text-muted-foreground">{skillTrackerData.skillsMovement.startingCount}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-4xl font-bold text-primary">{skillTrackerData.skillsMovement.endingCount}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Page 6: Are my users focusing on developing this skill? */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-foreground text-center">
          Are my users focusing on developing this skill?
        </h2>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Sep 2025</h3>
          <h4 className="text-lg font-medium text-primary">Users with Focus Skill</h4>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Left: Focus Skills by Business Unit */}
          <div className="bg-white border rounded-lg p-6">
            <h5 className="text-base font-medium mb-6">Users with Focus Skill by Business Unit</h5>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={skillTrackerData.focusSkillsUnits}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name"
                  stroke="#666"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  domain={[0, 350]}
                  ticks={[0, 50, 100, 150, 200, 250, 300, 350]}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Focus Users']}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="text-xs text-muted-foreground text-center mt-4">
              <div>NOV JAN MAR MAY JUL SEP</div>
              <div>2024 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2025</div>
              <div className="mt-2">0 &nbsp;&nbsp; 50 &nbsp;&nbsp; 100 &nbsp;&nbsp; 150 &nbsp;&nbsp; 200 &nbsp;&nbsp; 250 &nbsp;&nbsp; 300</div>
            </div>
          </div>

          {/* Right: Focus Skill Timeline */}
          <div className="bg-white border rounded-lg p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart 
                data={skillTrackerData.focusTimeline}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <defs>
                  <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period"
                  stroke="#666"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  domain={[0, 350]}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Focus Users']}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}
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

        {/* Total Focus Users Display */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground">User</div>
          <div className="text-3xl font-bold text-accent">{skillTrackerData.totalFocusUsers}</div>
        </div>
      </div>

      {/* Page 8: What does the median rating look like for this skill? */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-foreground text-center">
          What does the median rating look like for this skill?
        </h2>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold">Sep 2025</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Self Rating Chart */}
          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-base font-medium text-center mb-6">Median Self Rating by Business Unit</h4>
            <div className="space-y-4 mb-6">
              {skillTrackerData.ratings.selfRatingByUnit.map((item) => (
                <div key={item.unit} className="flex justify-between items-center">
                  <span className="text-sm">{item.unit}</span>
                  <span className="text-lg font-bold">{item.rating}</span>
                </div>
              ))}
            </div>
            
            {/* Rating Scale Visual */}
            <div className="text-center mb-4">
              <div className="flex justify-center items-center space-x-2 text-xs text-muted-foreground mb-2">
                <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full mb-4"></div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Median Self Rating</div>
              <div className="text-5xl font-bold text-primary">{skillTrackerData.ratings.medianSelfRating}</div>
            </div>
          </div>

          {/* Peer Rating Chart */}
          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-base font-medium text-center mb-6">Median Peer Rating by Business Unit</h4>
            <div className="space-y-4 mb-6">
              {skillTrackerData.ratings.peerRatingByUnit.map((item) => (
                <div key={item.unit} className="flex justify-between items-center">
                  <span className="text-sm">{item.unit}</span>
                  <span className="text-lg font-bold">{item.rating}</span>
                </div>
              ))}
            </div>
            
            {/* Rating Scale Visual */}
            <div className="text-center mb-4">
              <div className="flex justify-center items-center space-x-2 text-xs text-muted-foreground mb-2">
                <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full mb-4"></div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Median Peer Rating</div>
              <div className="text-5xl font-bold text-accent">{skillTrackerData.ratings.medianPeerRating}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 10: Are users making progress on this skill? */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-foreground text-center">
          Are users making progress on this skill?
        </h2>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Sep 2025</h3>
          <h4 className="text-lg font-medium text-primary mb-8">Skill Progression by Business Unit</h4>
        </div>

        <div className="bg-white border rounded-lg p-12">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-4">Skill Progression</div>
            <div className="text-8xl font-bold text-success">{skillTrackerData.skillProgression}</div>
          </div>
        </div>
      </div>

      {/* Export Controls */}
      <div className="flex justify-center gap-4 pt-8">
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
  );
}
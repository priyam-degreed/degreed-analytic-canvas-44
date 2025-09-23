import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Filter, Calendar, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Data matching the Word document exactly
const skillFollowingBusinessUnits = [
  { name: 'Unknown', users: 1400 },
  { name: 'Central City', users: 1200 },
  { name: 'Gotham City', users: 1000 },
  { name: 'Metropolis', users: 800 },
  { name: 'Technology', users: 600 }
];

const skillFollowingTimeline = [
  { month: 'Nov 2024', users: 1100 },
  { month: 'Dec 2024', users: 1150 },
  { month: 'Jan 2025', users: 1200 },
  { month: 'Feb 2025', users: 1250 },
  { month: 'Mar 2025', users: 1300 },
  { month: 'Apr 2025', users: 1320 },
  { month: 'May 2025', users: 1350 },
  { month: 'Jun 2025', users: 1370 },
  { month: 'Jul 2025', users: 1380 },
  { month: 'Aug 2025', users: 1390 },
  { month: 'Sep 2025', users: 1310 }
];

const skillMovementData = [
  { category: 'Incoming skills', value: 18 },
  { category: 'Discrepancies', value: 51 },
  { category: 'Net change', value: 50 }
];

const focusSkillBusinessUnits = [
  { name: 'Unknown', users: 300 },
  { name: 'Hotel One', users: 2 }
];

const focusSkillTimeline = [
  { month: 'Nov 2024', users: 250 },
  { month: 'Dec 2024', users: 260 },
  { month: 'Jan 2025', users: 270 },
  { month: 'Feb 2025', users: 280 },
  { month: 'Mar 2025', users: 290 },
  { month: 'Apr 2025', users: 295 },
  { month: 'May 2025', users: 298 },
  { month: 'Jun 2025', users: 300 },
  { month: 'Jul 2025', users: 301 },
  { month: 'Aug 2025', users: 302 },
  { month: 'Sep 2025', users: 302 }
];

const medianRatingsBusinessUnits = [
  { name: 'Unknown', selfRating: 4, peerRating: 4 },
  { name: 'ExperienceUpdated', selfRating: null, peerRating: 5 },
  { name: 'Hotel One', selfRating: null, peerRating: null }
];

const availableSkills = [
  'Python Programming',
  'Data Analysis', 
  'Machine Learning',
  'Web Development',
  'Project Management',
  'Digital Marketing',
  'Cloud Computing',
  'Cybersecurity'
];

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--chart-1))',
  },
  rating: {
    label: 'Rating', 
    color: 'hsl(var(--chart-2))',
  },
};

export default function SkillTracker() {
  const [selectedSkill, setSelectedSkill] = useState('Python Programming');

  return (
    <div className="space-y-12 max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Skill Tracker</h1>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
          This analysis is designed to help users monitor acquisition, progression & rating of a specific skill within the organization.
        </p>
        <p className="text-base text-muted-foreground">
          Please select a skill you want to analyze in the global filter down below.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="text-lg font-semibold">Sep 2025</div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add a filter
          </Button>
        </div>
        
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

      {/* Section 1: How many people are following this skill over time? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How many people are following this skill over time?
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Users Following this Skill */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Users Following this Skill</CardTitle>
              <p className="text-sm text-muted-foreground">Sep 2025</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold">1.31k</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillFollowingBusinessUnits} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Right: Number of Users in Each Business Unit */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Number of Users in Each Business Unit who are Following this Skill</CardTitle>
              <p className="text-sm text-muted-foreground">Sep 2025 Number of Skills Being Followed: ≥1</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={skillFollowingTimeline} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 2: How is this Skill Moving Within the Organization? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          How is this Skill Moving Within the Organization?
        </h2>
        <p className="text-lg font-semibold">Sep 2025</p>
        
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Incoming skills</TableHead>
                  <TableHead className="text-center">Discrepancies</TableHead>
                  <TableHead className="text-center">Net change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-center font-bold">+18</TableCell>
                  <TableCell className="text-center font-bold">+51</TableCell>
                  <TableCell className="text-center font-bold">+50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center font-bold">+40</TableCell>
                  <TableCell className="text-center font-bold">+33</TableCell>
                  <TableCell className="text-center font-bold">+30</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center font-bold">+20</TableCell>
                  <TableCell className="text-center font-bold">+10</TableCell>
                  <TableCell className="text-center font-bold">0</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Acquired Skills Count change</h3>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center"></TableHead>
                    <TableHead className="text-center">Starting Acquired Skills Count</TableHead>
                    <TableHead className="text-center">Ending Acquired Skills Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-center font-bold text-2xl text-green-600">+51</TableCell>
                    <TableCell className="text-center font-bold text-2xl">3.78k</TableCell>
                    <TableCell className="text-center font-bold text-2xl">3.84k</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 3: Are my users focusing on developing this skill? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Are my users focusing on developing this skill?
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Users with Focus Skill */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Users with Focus Skill</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={focusSkillBusinessUnits} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Right: Users with Focus Skill by Business Unit */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Users with Focus Skill by Business Unit</CardTitle>
              <div className="text-sm text-muted-foreground">
                <div>Sep 2025 Focus Skill | Sep 2025 | Focus Skill</div>
                <div className="mt-2">
                  <div>Unknown: 300</div>
                  <div>Hotel One: 2</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={focusSkillTimeline} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 4: What does the median rating look like for this skill? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          What does the median rating look like for this skill?
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Median Self Rating by Business Unit */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Median Self Rating by Business Unit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Sep 2025</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Unknown</span>
                    <span className="font-bold">4</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="text-sm text-muted-foreground">Median Self Rating</div>
                  <div className="text-3xl font-bold">4</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Median Peer Rating by Business Unit */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Median Peer Rating by Business Unit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Sep 2025</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>ExperienceUpdated</span>
                    <span className="font-bold">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unknown</span>
                    <span className="font-bold">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hotel One</span>
                    <span className="font-bold">-</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="text-sm text-muted-foreground">Median Peer Rating</div>
                  <div className="text-3xl font-bold">4</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 5: Are users making progress on this skill? */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Are users making progress on this skill?
        </h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill Progression by Business Unit</CardTitle>
            <p className="text-sm text-muted-foreground">Sep 2025</p>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">25</div>
              <p className="text-sm text-muted-foreground mt-2">Users making progress</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
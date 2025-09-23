import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from 'recharts';

// Data matching the Word document exactly
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

const skillFollowingBusinessUnits = [
  { name: 'Technology', users: 600 },
  { name: 'Metropolis', users: 800 },
  { name: 'Gotham City', users: 1000 },
  { name: 'Central City', users: 1200 },
  { name: 'Unknown', users: 1400 }
];

// Skill Movement Data - Updated to match document
const skillMovementData = [
  { 
    category: 'Incoming skills', 
    values: [18, 40, 20],
    colors: ['#4F46E5', '#4F46E5', '#4F46E5']
  },
  { 
    category: 'Discrepancies', 
    values: [51, 33, 10],
    colors: ['#9CA3AF', '#9CA3AF', '#9CA3AF'] 
  },
  { 
    category: 'Net change', 
    values: [50, 30, 0],
    colors: ['#10B981', '#10B981', '#10B981']
  }
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

const focusSkillBusinessUnits = [
  { name: 'Hotel One', users: 2 },
  { name: 'ExperienceUpdated', users: 1 },
  { name: 'Unknown', users: 300 }
];

// Self Ratings Data
const selfRatingsData = [
  { name: 'Technology', rating: 4.2 },
  { name: 'Metropolis', rating: 3.8 },
  { name: 'Gotham City', rating: 4.1 },
  { name: 'Central City', rating: 3.9 },
  { name: 'Star City', rating: 4.3 },
  { name: 'Coast City', rating: 3.7 },
  { name: 'Midway City', rating: 4.0 },
  { name: 'Hotel One', rating: 1.0 },
  { name: 'Unknown', rating: 4.0 },
  { name: 'ExperienceUpdated', rating: 5.0 }
];

// Peer Ratings Data  
const peerRatingsData = [
  { name: 'Unknown', rating: 4 }
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

export default function SkillTracker() {
  const [selectedSkill, setSelectedSkill] = useState('Python Programming');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8 space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold mb-4">Skill Tracker</h1>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-2">
            This analysis is designed to help users monitor acquisition, progression & rating of a specific skill within the organization.
          </p>
          <p className="text-base text-muted-foreground mb-6">
            Please select a skill you want to analyze in the global filter down below.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-base font-medium">Sep 2025</span>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add a filter
            </Button>
          </div>
          
          <div className="flex justify-center">
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
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            How many people are following this skill over time?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Line Chart - Users Following this Skill Over Time */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Users Following this Skill</CardTitle>
                <p className="text-xs text-muted-foreground">Sep 2025 | Number of Skills Being Followed: ≥1</p>
              </CardHeader>
              <CardContent className="pb-4">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={skillFollowingTimeline} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={10} 
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <div className="text-xs text-muted-foreground">Users</div>
                  <div className="text-2xl font-bold text-blue-600">1.31k</div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Horizontal Bar Chart - Business Units */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Number of Users in Each Business Unit who are Following this Skill</CardTitle>
                <p className="text-xs text-muted-foreground">Sep 2025 | Number of Skills Being Followed: ≥1</p>
              </CardHeader>
              <CardContent className="pb-4">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart 
                    data={skillFollowingBusinessUnits} 
                    layout="horizontal"
                    margin={{ top: 10, right: 20, left: 80, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      type="number" 
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      width={75}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="users" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <div className="text-xs text-muted-foreground">Users</div>
                  <div className="text-2xl font-bold text-blue-600">1.31k</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 2: How is this Skill Moving Within the Organization? */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            How is this Skill Moving Within the Organization?
          </h2>
          <p className="text-base font-medium">Sep 2025</p>
          
          {/* Skill Movement Table */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-8 mb-8">
                {skillMovementData.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="text-center">
                    <h4 className="text-sm font-medium mb-4">{category.category}</h4>
                    <div className="flex justify-center items-end h-32 space-x-2">
                      {category.values.map((value, valueIndex) => (
                        <div key={valueIndex} className="flex flex-col items-center">
                          <div 
                            className="w-8 flex items-center justify-center text-white text-xs font-bold"
                            style={{ 
                              height: `${Math.max((value / 60) * 100, 15)}%`, 
                              backgroundColor: category.colors[valueIndex],
                              minHeight: '20px'
                            }}
                          >
                            {value > 0 ? `+${value}` : value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Acquired Skills Count change</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Acquired Skills Count change</div>
                <div className="text-4xl font-bold text-green-600">+51</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Starting Acquired Skills Count</div>
                <div className="text-4xl font-bold">3.78k</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Ending Acquired Skills Count</div>
                <div className="text-4xl font-bold">3.84k</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Are my users focusing on developing this skill? */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Are my users focusing on developing this skill?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Line Chart - Focus Skill Timeline */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Users with Focus Skill</CardTitle>
                <p className="text-xs text-muted-foreground">Sep 2025 | Focus Skill</p>
              </CardHeader>
              <CardContent className="pb-4">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={focusSkillTimeline} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <div className="text-xs text-muted-foreground">Users</div>
                  <div className="text-2xl font-bold text-blue-600">302</div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Horizontal Bar Chart - Focus Skill by Business Unit */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Users with Focus Skill by Business Unit</CardTitle>
                <p className="text-xs text-muted-foreground">Sep 2025 | Focus Skill</p>
              </CardHeader>
              <CardContent className="pb-4">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart 
                    data={focusSkillBusinessUnits} 
                    layout="horizontal"
                    margin={{ top: 10, right: 20, left: 100, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      type="number"
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      width={95}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="users" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <div className="text-xs text-muted-foreground">Users</div>
                  <div className="text-2xl font-bold text-blue-600">302</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 4: What does the median rating look like for this skill? */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            What does the median rating look like for this skill?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Median Self Rating by Business Unit */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Median Self Rating by Business Unit</CardTitle>
                <p className="text-xs text-muted-foreground">Sep 2025</p>
              </CardHeader>
              <CardContent className="pb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart 
                    data={selfRatingsData} 
                    layout="horizontal"
                    margin={{ top: 10, right: 20, left: 100, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      type="number" 
                      domain={[0, 5]}
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      width={95}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="rating" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-center mt-6">
                  <div className="text-xs text-muted-foreground">Median Self Rating</div>
                  <div className="text-3xl font-bold text-blue-600">4</div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Median Peer Rating by Business Unit */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">Median Peer Rating by Business Unit</CardTitle>
                <p className="text-xs text-muted-foreground">Sep 2025</p>
              </CardHeader>
              <CardContent className="pb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart 
                    data={peerRatingsData} 
                    layout="horizontal"
                    margin={{ top: 10, right: 20, left: 100, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      type="number" 
                      domain={[0, 5]}
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      fontSize={10}
                      tick={{ fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      width={95}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="rating" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-center mt-6">
                  <div className="text-xs text-muted-foreground">Median Peer Rating</div>
                  <div className="text-3xl font-bold text-blue-600">4</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 5: Are users making progress on this skill? */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Are users making progress on this skill?
          </h2>
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Skill Progression by Business Unit</CardTitle>
              <p className="text-xs text-muted-foreground">Sep 2025</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-8xl font-bold text-blue-600 mb-2">25</div>
                <p className="text-base text-muted-foreground">Users making progress</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Target, Brain, Award, Users, ArrowUp, ArrowDown, Share, Edit, Download } from "lucide-react";
import { skillGrowthData, strategicOverviewData } from "@/data/mockData";
import { SkillInsightsFilterBar } from "@/components/filters/SkillInsightsFilterBar";
import { useFilters } from "@/contexts/FilterContext";
import { useFilteredData } from "@/hooks/useFilteredData";
import { 
  comprehensiveLearningData, 
  comprehensiveSkillRatings, 
  comprehensiveTrendingTopics
} from '@/data/comprehensiveMockData';
import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8'];

export default function SkillInsights() {
  const { filters } = useFilters();
  
  // Use comprehensive filtered data
  const filteredLearningData = useFilteredData(comprehensiveLearningData, filters);
  const filteredSkillRatings = useFilteredData(comprehensiveSkillRatings, filters);
  
  // Calculate metrics from filtered data
  const skillMetrics = useMemo(() => {
    const uniqueSkills = new Set([
      ...filteredLearningData.flatMap(item => item.skills),
      ...filteredSkillRatings.map(item => item.skill)
    ]);
    
    const expertRatings = filteredSkillRatings.filter(rating => rating.currentRating >= 4.0);
    const skillDecayAlerts = filteredSkillRatings.filter(rating => 
      (rating.targetRating - rating.currentRating) > 1.0
    );
    
    return {
      totalSkills: uniqueSkills.size || strategicOverviewData.totalSkills,
      expertSkills: expertRatings.length || 205,
      activeSkillPlans: Math.floor(filteredLearningData.length * 1.2) || strategicOverviewData.activeSkillPlans,
      skillsInDecay: skillDecayAlerts.length || 3
    };
  }, [filteredLearningData, filteredSkillRatings]);

  // Generate filtered skill gaps
  const filteredSkillGaps = useMemo(() => {
    const skillGaps = filteredSkillRatings.reduce((acc: any, rating) => {
      const skill = rating.skill;
      const gap = Math.max(0, rating.targetRating - rating.currentRating);
      
      if (gap > 0.5) { // Only significant gaps
        const role = rating.roles[0] || "General";
        const key = `${skill}-${role}`;
        
        if (!acc[key]) {
          acc[key] = {
            jobRole: role,
            skill: skill,
            current: Math.round(rating.currentRating * 20), // Convert to percentage
            required: Math.round(rating.targetRating * 20),
            gap: Math.round(gap * 20)
          };
        }
      }
      
      return acc;
    }, {});
    
    return Object.values(skillGaps).slice(0, 8); // Top 8 gaps
  }, [filteredSkillRatings]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Skill Insights</h1>
        <p className="text-muted-foreground mt-1">
          Analyze skill development, gaps, and market alignment across your workforce
        </p>
      </div>

      {/* Filter Bar */}
      <SkillInsightsFilterBar />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Skills Tracked"
          value={skillMetrics.totalSkills.toString()}
          change={{ value: 8.3, type: "positive" }}
          icon={<Brain className="h-5 w-5" />}
        />
        <MetricCard
          title="Expert-Level Skills"
          value={skillMetrics.expertSkills.toString()}
          change={{ value: 15.7, type: "positive" }}
          icon={<Award className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Skill Plans"
          value={skillMetrics.activeSkillPlans.toString()}
          change={{ value: 23.1, type: "positive" }}
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Skills in Decay"
          value={skillMetrics.skillsInDecay.toString()}
          change={{ value: -12.4, type: "negative" }}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {/* Critical Skill Gaps */}
      <ChartCard
        title="Critical Skill Gaps by Job Role"
        subtitle={`Skills with highest demand vs current capability (${filteredSkillGaps.length} gaps identified)`}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredSkillGaps.length > 0 ? filteredSkillGaps : skillGrowthData.skillGaps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="skill" angle={-45} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="current" fill="hsl(var(--secondary))" name="Current Level" />
            <Bar dataKey="required" fill="hsl(var(--primary))" name="Required Level" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Top Growing Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Top Skills Gained This Quarter"
            subtitle="Skills with highest learning activity and growth"
          >
            <div className="space-y-4">
              {skillGrowthData.topSkillsGained.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{skill.skill}</h4>
                      <p className="text-sm text-muted-foreground">{skill.learners} learners</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">+{skill.averageGrowth}</span>
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Market:</span>
                      <Badge variant={skill.marketDemand > 85 ? "default" : "secondary"}>
                        {skill.marketDemand}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Skill Decay Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillGrowthData.skillDecayAlerts.map((alert, index) => (
                <div key={index} className="p-3 border rounded-md space-y-2">
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-sm">{alert.skill}</h5>
                    <Badge variant={alert.urgency === 'high' ? 'destructive' : 'secondary'}>
                      {alert.urgency}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.affectedUsers} users</p>
                  <p className="text-xs">Last activity: {alert.lastActivity}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skill Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillGrowthData.skillAssessments.map((assessment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{assessment.month}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{assessment.avgScore}%</div>
                    <div className="text-xs text-muted-foreground">{assessment.totalAssessments} assessments</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skill Progression Matrix */}
      <ChartCard
        title="Skill Progression Matrix"
        subtitle="Current skill distribution across proficiency levels"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {strategicOverviewData.expertSkills.slice(0, 4).map((skill, index) => (
            <div key={index} className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium">{skill.name}</h4>
                <p className="text-sm text-muted-foreground">+{skill.growthRate}% growth</p>
              </div>
              
              <div className="space-y-2">
                {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map((level, levelIndex) => {
                  const values = [skill.expertRatings, Math.floor(skill.expertRatings * 1.5), Math.floor(skill.expertRatings * 2), Math.floor(skill.expertRatings * 0.8)];
                  const value = values[levelIndex];
                  const maxValue = Math.max(...values);
                  const percentage = (value / maxValue) * 100;
                  
                  return (
                    <div key={level} className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground w-20">{level}</span>
                      <div className="flex-1 mx-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Market Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Skills vs Market Demand"
          subtitle="How well our skills align with market needs"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={strategicOverviewData.topSkills.slice(0, 8)}>
              <CartesianGrid />
              <XAxis dataKey="users" name="Internal Users" />
              <YAxis dataKey="marketDemand" name="Market Demand" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">Users: {data.users}</p>
                        <p className="text-sm text-muted-foreground">Market Demand: {data.marketDemand || 'N/A'}%</p>
                        <p className="text-sm text-muted-foreground">Rating: {data.selfRating}/5</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="marketDemand" fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skill Investment Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-sm text-red-600">Critical Gaps</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">7</div>
                  <div className="text-sm text-orange-600">High Priority</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-sm mb-2">Immediate Action Required</h5>
                  <div className="space-y-2">
                    {['Kubernetes', 'MLOps', 'Cloud Security'].map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Strategic Investments</h5>
                  <div className="space-y-2">
                    {['AI/ML', 'DevOps', 'Data Science'].map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
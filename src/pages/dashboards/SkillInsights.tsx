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
import { 
  skillOpportunitiesData, 
  getMostNeededSkillsData, 
  getSkillTrendData, 
  getTotalOpportunities,
  getSkillsInRolesData,
  getTotalRoleSkillsCount
} from '@/data/skillOpportunitiesData';
import { useMemo } from 'react';
import { useSkillMetrics, useTopSkillsGained } from "@/hooks/useSkillMetrics";
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
  Cell,
  LineChart,
  Line
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8'];

export default function SkillInsights() {
  const { filters } = useFilters();
  
  // Use enhanced hooks for better filter responsiveness
  const skillMetrics = useSkillMetrics(comprehensiveLearningData, comprehensiveSkillRatings, filters);
  const filteredTopSkillsGained = useTopSkillsGained(comprehensiveLearningData, filters);
  
  // Use comprehensive filtered data for remaining calculations
  const filteredLearningData = useFilteredData(comprehensiveLearningData, filters);
  const filteredSkillRatings = useFilteredData(comprehensiveSkillRatings, filters);
  const filteredOpportunitiesData = useFilteredData(skillOpportunitiesData, filters);
  
  // Generate filtered skill gaps
  const filteredSkillGaps = useMemo(() => {
    console.log('Generating skill gaps from:', filteredSkillRatings.length, 'ratings');
    
    // Group ratings by role and find the biggest gaps for each role
    const roleSkillGaps = filteredSkillRatings.reduce((acc: any, rating) => {
      const role = rating.roles[0] || "General";
      const skill = rating.skill;
      const gap = Math.max(0, rating.targetRating - rating.currentRating);
      
      if (gap > 0.3) { // Lower threshold for more variety
        if (!acc[role]) {
          acc[role] = [];
        }
        
        acc[role].push({
          jobRole: role,
          skill: skill,
          current: Math.round(rating.currentRating * 20), // Convert to percentage
          required: Math.round(rating.targetRating * 20),
          gap: Math.round(gap * 20),
          gapValue: gap // Keep original gap for sorting
        });
      }
      
      return acc;
    }, {});
    
    // Get the top skill gap for each role, ensuring diversity
    const topGapsPerRole: any[] = [];
    Object.entries(roleSkillGaps).forEach(([role, gaps]: [string, any]) => {
      // Sort by gap size and pick the biggest one for this role
      const sortedGaps = (gaps as any[]).sort((a, b) => b.gapValue - a.gapValue);
      if (sortedGaps.length > 0) {
        topGapsPerRole.push(sortedGaps[0]);
      }
    });
    
    // Sort all role gaps by gap size and take top 8
    const result = topGapsPerRole
      .sort((a, b) => b.gapValue - a.gapValue)
      .slice(0, 8)
      .map(item => {
        // Remove the helper gapValue property
        const { gapValue, ...cleanItem } = item;
        return cleanItem;
      });
    
    console.log('Generated diverse skill gaps by role:', result);
    return result;
  }, [filteredSkillRatings]);

  // Generate filtered skill decay alerts
  const filteredSkillDecayAlerts = useMemo(() => {
    return filteredSkillRatings
      .filter(rating => (rating.targetRating - rating.currentRating) > 0.8)
      .map(rating => ({
        skill: rating.skill,
        urgency: (rating.targetRating - rating.currentRating) > 1.5 ? 'high' : 'medium',
        affectedUsers: `${Math.floor(Math.random() * 50) + 10} users`,
        lastActivity: `${Math.floor(Math.random() * 30) + 1} days ago`
      }))
      .slice(0, 4);
  }, [filteredSkillRatings]);

  // Generate filtered skill assessments
  const filteredSkillAssessments = useMemo(() => {
    const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr'].map(month => {
      const relevantRatings = filteredSkillRatings.slice(0, Math.floor(Math.random() * 20) + 10);
      const avgScore = relevantRatings.length > 0 
        ? Math.round(relevantRatings.reduce((sum, r) => sum + r.currentRating * 20, 0) / relevantRatings.length)
        : Math.floor(Math.random() * 20) + 75;
      
      return {
        month,
        avgScore,
        totalAssessments: relevantRatings.length || Math.floor(Math.random() * 50) + 20
      };
    });
    
    return monthlyData;
  }, [filteredSkillRatings]);

  // Generate filtered expert skills for progression matrix
  const filteredExpertSkills = useMemo(() => {
    const skillCounts = filteredSkillRatings.reduce((acc: any, rating) => {
      if (!acc[rating.skill]) {
        acc[rating.skill] = {
          name: rating.skill,
          ratings: [],
          growthRate: Math.random() * 15 + 5
        };
      }
      acc[rating.skill].ratings.push(rating.currentRating);
      return acc;
    }, {});

    return Object.values(skillCounts)
      .map((skill: any) => ({
        ...skill,
        expertRatings: skill.ratings.filter((r: number) => r >= 4.0).length,
        avgRating: skill.ratings.reduce((sum: number, r: number) => sum + r, 0) / skill.ratings.length
      }))
      .sort((a: any, b: any) => b.expertRatings - a.expertRatings)
      .slice(0, 4);
  }, [filteredSkillRatings]);

  // Generate opportunities chart data
  const mostNeededSkillsData = useMemo(() => {
    const data = getMostNeededSkillsData(filteredOpportunitiesData);
    console.log('📊 Most needed skills data:', data);
    return data;
  }, [filteredOpportunitiesData]);

  const skillTrendData = useMemo(() => {
    const data = getSkillTrendData(filteredOpportunitiesData);
    console.log('📈 Skill trend data:', data);
    return data;
  }, [filteredOpportunitiesData]);

  const totalOpportunities = useMemo(() => {
    const total = getTotalOpportunities(filteredOpportunitiesData);
    console.log('🎯 Total opportunities:', total);
    return total;
  }, [filteredOpportunitiesData]);

  // Skills in roles chart data
  const skillsInRolesData = useMemo(() => {
    const data = getSkillsInRolesData(filteredOpportunitiesData);
    console.log('👥 Skills in roles data:', data);
    return data;
  }, [filteredOpportunitiesData]);

  const totalRoleSkillsCount = useMemo(() => {
    const total = getTotalRoleSkillsCount(filteredOpportunitiesData);
    console.log('📊 Total role skills count:', total);
    return total;
  }, [filteredOpportunitiesData]);

  // Generate filtered market alignment data
  const filteredMarketAlignment = useMemo(() => {
    const skillUsage = filteredLearningData.reduce((acc: any, item) => {
      item.skills.forEach(skill => {
        if (!acc[skill]) {
          acc[skill] = {
            name: skill,
            users: 0,
            selfRating: 0,
            ratingCount: 0
          };
        }
        acc[skill].users += item.learners;
      });
      return acc;
    }, {});

    // Add ratings data
    filteredSkillRatings.forEach(rating => {
      if (skillUsage[rating.skill]) {
        skillUsage[rating.skill].selfRating += rating.currentRating;
        skillUsage[rating.skill].ratingCount += 1;
      }
    });

    return Object.values(skillUsage)
      .map((skill: any) => ({
        ...skill,
        selfRating: skill.ratingCount > 0 ? (skill.selfRating / skill.ratingCount).toFixed(1) : 3.5,
        marketDemand: Math.floor(Math.random() * 30) + 70
      }))
      .filter((skill: any) => skill.users > 0)
      .slice(0, 8);
  }, [filteredLearningData, filteredSkillRatings]);

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

      {/* Skills Opportunities Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Most Needed Skills in Open Opportunities"
          subtitle="Sep 2025"
        >
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={mostNeededSkillsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="skill"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                  interval={0}
                />
                <YAxis 
                  fontSize={12}
                  label={{ value: 'Number of Opportunities', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any) => [value, 'Opportunities']}
                  labelFormatter={(label: any) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="opportunities" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm font-medium">Number of Opportunities</span>
              </div>
              <span className="text-2xl font-bold text-primary">{totalOpportunities}</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Trend of Most Needed Skills"
          subtitle="Sep 2025"
        >
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={skillTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  fontSize={12}
                />
                <YAxis 
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                  fontSize={12}
                  tickFormatter={(value) => `${value}K`}
                />
                <Tooltip 
                  formatter={(value: any, name: string, props: any) => [
                    props.payload.displayValue || `${value}K`, 
                    'Opportunities'
                  ]}
                  labelFormatter={(label: any) => `Month: ${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="opportunities" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm font-medium">Overall</span>
              <span className="text-sm text-muted-foreground ml-4">Number of Opportunities</span>
              <span className="text-2xl font-bold text-primary ml-4">{totalOpportunities}</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Skills in Roles Chart */}
      <ChartCard
        title="Skills that Appear in the Most Roles"
        subtitle="Sep 2025"
      >
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={skillsInRolesData}
              margin={{ top: 20, right: 80, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                domain={[0, 'dataMax + 50']}
                fontSize={12}
              />
              <YAxis 
                dataKey="skill" 
                type="category" 
                width={150}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: any) => [value, 'Role Count']}
                labelFormatter={(label: any) => `${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="roleCount" 
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm font-medium">Role Skills Count</span>
            </div>
            <span className="text-2xl font-bold text-primary">{totalRoleSkillsCount}</span>
          </div>
        </div>
      </ChartCard>

      {/* Critical Skill Gaps */}
      <ChartCard
        title="Critical Skill Gaps by Job Role"
        subtitle={`Skills with highest demand vs current capability (${filteredSkillGaps.length} gaps identified)`}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredSkillGaps.length > 0 ? filteredSkillGaps : skillGrowthData.skillGaps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="jobRole" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
            />
            <YAxis label={{ value: 'Skill Level (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{data.jobRole}</p>
                      <p className="text-sm text-muted-foreground mb-2">{data.skill}</p>
                      <p className="text-sm">Current: {data.current}%</p>
                      <p className="text-sm">Required: {data.required}%</p>
                      <p className="text-sm font-medium text-red-500">Gap: {data.gap}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
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
            subtitle={`Skills with highest learning activity and growth (${filteredTopSkillsGained.length} skills shown)`}
          >
            <div className="space-y-4">
              {filteredTopSkillsGained.map((skill: any, index) => (
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
              {filteredSkillDecayAlerts.length > 0 ? filteredSkillDecayAlerts.map((alert: any, index) => (
                <div key={index} className="p-3 border rounded-md space-y-2">
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-sm">{alert.skill}</h5>
                    <Badge variant={alert.urgency === 'high' ? 'destructive' : 'secondary'}>
                      {alert.urgency}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.affectedUsers}</p>
                  <p className="text-xs">Last activity: {alert.lastActivity}</p>
                </div>
              )) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No skill decay alerts for current filters</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skill Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredSkillAssessments.map((assessment: any, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{assessment.period}</span>
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
          {filteredExpertSkills.length > 0 ? filteredExpertSkills.map((skill: any, index) => (
            <div key={index} className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium">{skill.name}</h4>
                <p className="text-sm text-muted-foreground">+{skill.growthRate.toFixed(1)}% growth</p>
              </div>
              
              <div className="space-y-2">
                {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map((level, levelIndex) => {
                  const values = [skill.expertRatings, Math.floor(skill.expertRatings * 1.5), Math.floor(skill.expertRatings * 2), Math.floor(skill.expertRatings * 0.8)];
                  const value = values[levelIndex];
                  const maxValue = Math.max(...values);
                  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  
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
          )) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <p>No skill data available for current filters</p>
            </div>
          )}
        </div>
      </ChartCard>

      {/* Market Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Skills vs Market Demand"
          subtitle="How well our skills align with market needs"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={filteredMarketAlignment}>
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
                        <p className="text-sm text-muted-foreground">Market Demand: {data.marketDemand}%</p>
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
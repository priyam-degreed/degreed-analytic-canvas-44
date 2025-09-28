import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Clock, BookOpen, Play, Award, Target, Share, Edit, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { FilterBar } from "@/components/filters/FilterBar";
import { useFilters } from "@/contexts/FilterContext";
import { useFilteredData, useFilteredMetrics } from "@/hooks/useFilteredData";
import { useState, useMemo } from "react";
import { DrillDownDialog } from "@/components/dashboard/DrillDownDialog";
import { getLearningDrillDownData } from "@/data/learningDrillDownData";
import { 
  comprehensiveLearningData, 
  comprehensiveSkillRatings, 
  comprehensiveTrendingTopics,
  aggregateDataByPeriod 
} from '@/data/comprehensiveMockData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8'];

export default function LearningEngagement() {
  console.log("LearningEngagement component rendering"); // Debug log
  const { filters } = useFilters();
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);

  const handleCardClick = (cardType: string) => {
    const data = getLearningDrillDownData(cardType);
    setDrillDownData({ additionalData: data });
    setIsDrillDownOpen(true);
  };
  
  // Use comprehensive filtered data
  const filteredLearningData = useFilteredData(comprehensiveLearningData, filters);
  const filteredSkillRatings = useFilteredData(comprehensiveSkillRatings, filters);
  const filteredTrendingTopics = useFilteredData(comprehensiveTrendingTopics, filters);

  // Calculate aggregated metrics from filtered data
  const aggregatedMetrics = useMemo(() => {
    const totalLearners = filteredLearningData.reduce((sum, item) => sum + item.learners, 0);
    const totalCompletions = filteredLearningData.reduce((sum, item) => sum + item.completions, 0);
    const totalHours = filteredLearningData.reduce((sum, item) => sum + item.hours, 0);
    const totalActiveUsers = filteredLearningData.reduce((sum, item) => sum + item.activeUsers, 0);
    const avgEngagement = filteredLearningData.length > 0 
      ? filteredLearningData.reduce((sum, item) => sum + item.engagementRate, 0) / filteredLearningData.length 
      : 0;

    // Engagement trends from filtered data grouped by date
    const trendsByDate = filteredLearningData.reduce((acc: any, item) => {
      const key = item.date.substring(0, 7); // YYYY-MM format
      if (!acc[key]) {
        acc[key] = { date: key, completions: 0, activeUsers: 0, hours: 0 };
      }
      acc[key].completions += item.completions;
      acc[key].activeUsers += item.activeUsers;
      acc[key].hours += item.hours;
      return acc;
    }, {});

    const engagementTrends = Object.values(trendsByDate).sort((a: any, b: any) => 
      a.date.localeCompare(b.date)
    );

    return {
      totalLearners: Math.max(totalLearners, 0),
      totalCompletions: Math.max(totalCompletions, 0),
      totalHours: Math.max(totalHours, 0),
      totalActiveUsers: Math.max(totalActiveUsers, 0),
      avgEngagement: Math.max(avgEngagement, 0),
      engagementTrends
    };
  }, [filteredLearningData]);
  
  // Calculate current vs previous period comparison
  const currentVsPrevComparison = useMemo(() => {
    // Sort filtered data by date to get chronological order
    const sortedData = [...filteredLearningData].sort((a, b) => a.date.localeCompare(b.date));
    
    if (sortedData.length === 0) {
      return {
        current: { completions: 0, hours: 0, activeUsers: 0 },
        previous: { completions: 0, hours: 0, activeUsers: 0 },
        comparison: []
      };
    }

    // Split data into two halves (current vs previous period)
    const midPoint = Math.floor(sortedData.length / 2);
    const previousPeriod = sortedData.slice(0, midPoint);
    const currentPeriod = sortedData.slice(midPoint);

    // Aggregate totals for each period
    const currentTotals = currentPeriod.reduce((acc, item) => ({
      completions: acc.completions + item.completions,
      hours: acc.hours + item.hours,
      activeUsers: acc.activeUsers + item.activeUsers
    }), { completions: 0, hours: 0, activeUsers: 0 });

    const previousTotals = previousPeriod.reduce((acc, item) => ({
      completions: acc.completions + item.completions,
      hours: acc.hours + item.hours,
      activeUsers: acc.activeUsers + item.activeUsers
    }), { completions: 0, hours: 0, activeUsers: 0 });

    // Create comparison data for chart
    const comparison = [
      {
        metric: 'Completions',
        current: currentTotals.completions,
        previous: previousTotals.completions
      },
      {
        metric: 'Learning Hours',
        current: currentTotals.hours,
        previous: previousTotals.hours
      },
      {
        metric: 'Active Users',
        current: currentTotals.activeUsers,
        previous: previousTotals.activeUsers
      }
    ];

    return {
      current: currentTotals,
      previous: previousTotals,
      comparison
    };
  }, [filteredLearningData]);
  
  // Calculate filtered metrics from aggregated data (no longer need separate filtering)
  const metrics = {
    totalLearners: aggregatedMetrics.totalLearners || 15420,
    activeUsersThisWeek: aggregatedMetrics.totalActiveUsers || 8934,
    courseCompletions: aggregatedMetrics.totalCompletions || 3847,
    learningHours: aggregatedMetrics.totalHours || 12847,
    avgCompletionRate: Math.round(aggregatedMetrics.avgEngagement) || 75
  };

  // Enhanced job role data structure from filtered learning data
  const roleComparisonData = useMemo(() => {
    console.log('🔄 Learning Engagement Component Loading:', {
      filteredDataLength: filteredLearningData.length,
      totalDataLength: comprehensiveLearningData.length
    });
    
    // Add test data to verify chart works
    const testData = [
      {
        role: "Software Engineer",
        currentPeriod: { completions: 45, hours: 180, learners: 12, engagementRate: 85, count: 4, avgEngagementRate: 85 },
        previousPeriod: { completions: 32, hours: 128, learners: 8, engagementRate: 75, count: 3, avgEngagementRate: 75 },
        change: 13
      },
      {
        role: "Data Scientist",
        currentPeriod: { completions: 38, hours: 152, learners: 10, engagementRate: 90, count: 3, avgEngagementRate: 90 },
        previousPeriod: { completions: 28, hours: 112, learners: 7, engagementRate: 80, count: 2, avgEngagementRate: 80 },
        change: 10
      },
      {
        role: "Product Manager",
        currentPeriod: { completions: 42, hours: 168, learners: 11, engagementRate: 88, count: 4, avgEngagementRate: 88 },
        previousPeriod: { completions: 35, hours: 140, learners: 9, engagementRate: 82, count: 3, avgEngagementRate: 82 },
        change: 7
      }
    ];
    
    const roleAggregation = filteredLearningData.reduce((acc: any, item) => {
      if (!item.roles || item.roles.length === 0) return acc;
      
      item.roles.forEach(role => {
        if (!acc[role]) {
          acc[role] = {
            role,
            currentPeriod: { completions: 0, hours: 0, learners: 0, engagementRate: 0, count: 0 },
            previousPeriod: { completions: 0, hours: 0, learners: 0, engagementRate: 0, count: 0 }
          };
        }
        
        // Determine period based on date (split data into current vs previous)
        const itemDate = new Date(item.date);
        const sortedData = [...filteredLearningData].sort((a, b) => a.date.localeCompare(b.date));
        const midPoint = Math.floor(sortedData.length / 2);
        const midDate = sortedData[midPoint]?.date;
        
        const period = item.date >= midDate ? 'currentPeriod' : 'previousPeriod';
        
        acc[role][period].completions += item.completions;
        acc[role][period].hours += item.hours;
        acc[role][period].learners += item.learners;
        acc[role][period].engagementRate += item.engagementRate;
        acc[role][period].count += 1;
      });
      
      return acc;
    }, {});

    const result = Object.values(roleAggregation).map((roleData: any) => ({
      ...roleData,
      currentPeriod: {
        ...roleData.currentPeriod,
        avgEngagementRate: roleData.currentPeriod.count > 0 
          ? roleData.currentPeriod.engagementRate / roleData.currentPeriod.count 
          : 0
      },
      previousPeriod: {
        ...roleData.previousPeriod,
        avgEngagementRate: roleData.previousPeriod.count > 0 
          ? roleData.previousPeriod.engagementRate / roleData.previousPeriod.count 
          : 0
      },
      change: roleData.currentPeriod.completions - roleData.previousPeriod.completions
    }))
    .filter(roleData => {
      // Apply role filter if specified - show all roles if no filter selected
      if (filters.roles.length === 0) return true;
      return filters.roles.some(selectedRole => 
        roleData.role.toLowerCase().includes(selectedRole.toLowerCase()) ||
        selectedRole.toLowerCase().includes(roleData.role.toLowerCase())
      );
    })
    .sort((a, b) => b.currentPeriod.completions - a.currentPeriod.completions) // Sort by current completions
    .slice(0, 10); // Limit to top 10 roles for better visibility
    
    console.log('📊 Final Role Comparison Data:', result.length, result.slice(0, 3));
    
    // Return test data if no real data is available
    return result.length > 0 ? result : testData;
  }, [filteredLearningData, filters.roles]);

  // Generate multi-line trend data for activities vs ratings
  const activityRatingTrends = useMemo(() => {
    const monthlyData = [];
    const months = [
      'SEP 2023', 'OCT', 'NOV', 'DEC', 'JAN 2024', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN 2025', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'
    ];
    
    months.forEach((month, index) => {
      const baseActivity = 200 + Math.random() * 100;
      // Create spike at the end (Aug 2025)
      const learningActivities = index === months.length - 1 ? 5440 : baseActivity;
      
      const peerRating = 3.3 + (Math.random() * 1.5) + (index < 6 ? 0.5 : 0);
      const managerRating = 5.04 + (Math.random() * 0.08);
      const selfRating = 3.9 + (Math.random() * 0.25);
      
      monthlyData.push({
        month: month,
        learningActivities: Math.round(learningActivities),
        peerRating: Number(peerRating.toFixed(2)),
        managerRating: Number(managerRating.toFixed(3)),
        selfRating: Number(selfRating.toFixed(2))
      });
    });
    
    return monthlyData;
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Learning Engagement</h1>
        <p className="text-muted-foreground mt-1">
          Track learning activity, participation, and engagement across your organization
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar showRoles={true} showCustomAttribute={true} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Total Active Learners"
          value={metrics.totalLearners.toLocaleString()}
          change={{ value: 15.3, type: "positive" }}
          icon={<Users className="h-5 w-5" />}
          onClick={() => handleCardClick("Total Active Learners")}
        />
        <MetricCard
          title="Learning Completions"
          value={metrics.courseCompletions.toLocaleString()}
          change={{ value: 28.9, type: "positive" }}
          icon={<Award className="h-5 w-5" />}
          onClick={() => handleCardClick("Learning Completions")}
        />
        <MetricCard
          title="Learning Hours"
          value={`${metrics.learningHours.toLocaleString()}h`}
          change={{ value: 12.4, type: "positive" }}
          icon={<Clock className="h-5 w-5" />}
          onClick={() => handleCardClick("Total Learning Hours")}
        />
        <MetricCard
          title="Learning Satisfaction"
          value="89%"
          change={{ value: 4.2, type: "positive" }}
          icon={<Target className="h-5 w-5" />}
          onClick={() => handleCardClick("Learning Satisfaction")}
        />
        <MetricCard
          title="Assignments Created"
          value={(metrics.courseCompletions * 1.3).toLocaleString()}
          change={{ value: 18.7, type: "positive" }}
          icon={<BookOpen className="h-5 w-5" />}
          onClick={() => handleCardClick("Assignments Created")}
        />
        <MetricCard
          title="Most Active Skill"
          value="JavaScript"
          change={{ value: 23.4, type: "positive" }}
          icon={<Play className="h-5 w-5" />}
          onClick={() => handleCardClick("Most Active Skill")}
        />
      </div>

      {/* Learning Completions (In Period) vs. Previous Period */}
      <ChartCard
        title="Learning Completions (In Period) vs. Previous Period"
        subtitle="Aug 2025"
      >
        <div className="space-y-6">
          {/* Summary Row */}
          <div className="grid grid-cols-3 gap-8 p-6 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Aug 31 2025</div>
              <div className="text-4xl font-bold">{currentVsPrevComparison.current.completions}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Jul 31 2025</div>
              <div className="text-4xl font-bold">{currentVsPrevComparison.previous.completions}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Change</div>
              <div className="text-4xl font-bold text-green-600">
                +{currentVsPrevComparison.current.completions - currentVsPrevComparison.previous.completions}
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Completions by H1 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Learning Completions (In Period) vs. Previous Period by H1</h4>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={[
                      { category: 'Aug 31 2025', current: currentVsPrevComparison.current.completions, previous: 0 },
                      { category: 'Jul 31 2025', current: 0, previous: currentVsPrevComparison.previous.completions }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name, props) => {
                        const isCurrentPeriod = props.payload.category === 'Aug 31 2025';
                        return [
                          value, 
                          isCurrentPeriod ? 'Learning Completions (in Period)' : 'Previous Period'
                        ];
                      }}
                      labelFormatter={(label) => label}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="current" fill="#60A5FA" name="Aug 31 2025" />
                    <Bar dataKey="previous" fill="#A78BFA" name="Previous Period" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="flex justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#60A5FA]"></div>
                    <span className="text-sm">Aug 31 2025</span>
                    <span className="font-semibold">{currentVsPrevComparison.current.completions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#A78BFA]"></div>
                    <span className="text-sm">Jul 31 2025</span>
                    <span className="font-semibold">{currentVsPrevComparison.previous.completions}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Completions by Job Role */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Learning Completions (In Period) vs. Previous Period by Job Role</h4>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={roleComparisonData.map(role => ({
                      role: role.role,
                      current: role.currentPeriod.completions,
                      previous: role.previousPeriod.completions,
                      change: role.change
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="current" fill="hsl(var(--primary))" name="Current Period" />
                    <Bar dataKey="previous" fill="hsl(var(--accent))" name="Previous Period" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="flex justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm">Current Period (Aug 31 2025)</span>
                    <span className="font-semibold">{currentVsPrevComparison.current.completions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span className="text-sm">Previous Period (Jul 31 2025)</span>
                    <span className="font-semibold">{currentVsPrevComparison.previous.completions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Learning Completions by Provider & Provider Usage Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Learning Completions (In Period) by Item & Provider"
          subtitle="Q3 2025"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Pie Chart */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      filteredLearningData.reduce((acc: Record<string, number>, item) => {
                        const provider = item.provider || 'Unknown';
                        if (!acc[provider]) {
                          acc[provider] = 0;
                        }
                        acc[provider] += item.completions;
                        return acc;
                      }, {})
                    ).map(([provider, completions], index) => ({
                      name: provider,
                      value: completions as number,
                      fill: COLORS[index % COLORS.length]
                    })).sort((a, b) => b.value - a.value)}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(
                      filteredLearningData.reduce((acc: Record<string, number>, item) => {
                        const provider = item.provider || 'Unknown';
                        if (!acc[provider]) {
                          acc[provider] = 0;
                        }
                        acc[provider] += item.completions;
                        return acc;
                      }, {})
                    ).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} completions`, name]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Total Count */}
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground">Learning Completions (in Period)</div>
                <div className="text-3xl font-bold">
                  {filteredLearningData.reduce((sum, item) => sum + item.completions, 0)}
                </div>
              </div>
            </div>

            {/* Legend on the right side */}
            <div className="lg:w-64 space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Providers</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {Object.entries(
                  filteredLearningData.reduce((acc: Record<string, number>, item) => {
                    const provider = item.provider || 'Unknown';
                    if (!acc[provider]) {
                      acc[provider] = 0;
                    }
                    acc[provider] += item.completions;
                    return acc;
                  }, {})
                )
                .map(([provider, completions], index) => ({ provider, completions: completions as number, index }))
                .sort((a, b) => b.completions - a.completions)
                .map(({ provider, completions, index }) => (
                  <div key={provider} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium flex-1 truncate">{provider}</span>
                    <span className="text-sm text-muted-foreground">{completions}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Learning Provider Usage Trends" subtitle="Which providers are gaining momentum">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(() => {
              // Calculate provider usage trends from filtered data
              const currentPeriodData: Record<string, number> = {};
              const previousPeriodData: Record<string, number> = {};
              
              // Current period data from filtered results
              filteredLearningData.forEach(item => {
                const provider = item.provider || 'Unknown';
                if (!currentPeriodData[provider]) {
                  currentPeriodData[provider] = 0;
                }
                currentPeriodData[provider] += item.completions;
              });
              
              // Previous period data (simulate previous period by using different date range)
              comprehensiveLearningData
                .filter(item => {
                  const itemDate = new Date(item.date);
                  const sixMonthsAgo = new Date();
                  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 12);
                  const twelveMonthsAgo = new Date();
                  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 18);
                  return itemDate >= twelveMonthsAgo && itemDate < sixMonthsAgo;
                })
                .forEach(item => {
                  const provider = item.provider || 'Unknown';
                  if (!previousPeriodData[provider]) {
                    previousPeriodData[provider] = 0;
                  }
                  previousPeriodData[provider] += item.completions;
                });
              
              // Combine and calculate growth
              const allProviders = new Set([...Object.keys(currentPeriodData), ...Object.keys(previousPeriodData)]);
              
              return Array.from(allProviders)
                .map(provider => {
                  const current = currentPeriodData[provider] || 0;
                  const previous = previousPeriodData[provider] || 0;
                  const growth = previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;
                  
                  return {
                    provider,
                    currentPeriod: current,
                    previousPeriod: previous,
                    growth
                  };
                })
                .filter(item => item.currentPeriod > 0 || item.previousPeriod > 0)
                .sort((a, b) => b.currentPeriod - a.currentPeriod)
                .slice(0, 10); // Show top 10 providers
            })()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="provider" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === 'Current Period' || name === 'Previous Period') {
                    return [`${value} completions`, name];
                  }
                  return [value, name];
                }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }} 
              />
              <Bar dataKey="currentPeriod" fill="hsl(var(--primary))" name="Current Period" />
              <Bar dataKey="previousPeriod" fill="hsl(var(--muted))" name="Previous Period" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Trend of Learning Activities vs Average Ratings */}
      <ChartCard
        title="Trend of Learning Activities (In Period) vs. Average Peer Rating vs. Average Manager Rating vs. Average Self Rating"
        subtitle="Aug 2025"
      >
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart
              data={activityRatingTrends}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
                interval={0}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                domain={[0, 6000]}
                label={{ value: 'Learning Activities', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                domain={[3, 5.5]}
                label={{ value: 'Rating (1-5)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === 'learningActivities') {
                    return [value?.toLocaleString(), 'Learning Activities (In Period)'];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              
              {/* Learning Activities Line */}
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="learningActivities" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Learning Activities (In Period)"
              />
              
              {/* Rating Areas */}
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="peerRating" 
                stroke="#84CC16" 
                fill="#84CC16" 
                fillOpacity={0.3}
                strokeWidth={2}
                name="Average Peer Rating"
              />
              
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="managerRating" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3}
                strokeWidth={2}
                name="Average Manager Rating"
              />
              
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="selfRating" 
                stroke="#EC4899" 
                fill="#EC4899" 
                fillOpacity={0.3}
                strokeWidth={2}
                name="Average Self Rating"
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Legend and Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
                <span className="text-sm font-medium">Learning Activities (In Period)</span>
              </div>
              <div className="text-3xl font-bold text-[#3B82F6]">5.44k</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#84CC16]"></div>
                <span className="text-sm font-medium">Average Peer Rating</span>
              </div>
              <div className="text-3xl font-bold text-[#84CC16]">3.83</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
                <span className="text-sm font-medium">Average Manager Rating</span>
              </div>
              <div className="text-3xl font-bold text-[#8B5CF6]">5.06</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#EC4899]"></div>
                <span className="text-sm font-medium">Average Self Rating</span>
              </div>
              <div className="text-3xl font-bold text-[#EC4899]">3.93</div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Engagement Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Learning Engagement Trends"
          subtitle={`Showing data for ${aggregatedMetrics.engagementTrends.length} periods`}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart 
              data={aggregatedMetrics.engagementTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Area type="monotone" dataKey="completions" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" />
              <Area type="monotone" dataKey="activeUsers" stackId="2" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Content Modality Performance"
          subtitle={`Showing filtered content performance`}
        >
          <div className="space-y-4">
            {/* Show content type performance from filtered data */}
            {Object.entries(
              filteredLearningData.reduce((acc: any, item) => {
                const key = item.contentType;
                if (!acc[key]) {
                  acc[key] = { type: key, usage: 0, completionRate: 0, avgRating: 0, count: 0 };
                }
                acc[key].usage += item.learners;
                acc[key].completionRate += item.engagementRate;
                acc[key].avgRating += item.avgRating;
                acc[key].count += 1;
                return acc;
              }, {})
            ).map(([key, modality]: [string, any], index) => {
              const avgCompletionRate = modality.completionRate / modality.count;
              const avgRating = modality.avgRating / modality.count;
              
              return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-medium">{modality.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{modality.usage.toLocaleString()} users</span>
                    <span>{Math.round(avgCompletionRate)}% completion</span>
                    <span>⭐ {avgRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, avgCompletionRate)}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Trending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Trending Learning Topics"
            subtitle={`${filteredTrendingTopics.length} topics filtered`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={filteredTrendingTopics}
                margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="topic" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="learners" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Engagement Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-foreground">Monthly Active Learners</span>
                  <span className="text-sm font-semibold">81%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full transition-all duration-300" style={{ width: '81%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-foreground">Course Completion Rate</span>
                  <span className="text-sm font-semibold">63%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{ width: '63%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-foreground">Learning Hours Goal</span>
                  <span className="text-sm font-semibold">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-500 h-3 rounded-full transition-all duration-300" style={{ width: '65%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Learning Time</span>
                <span className="font-medium">4.2h/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Most Popular Format</span>
                <span className="font-medium">
                  Course (78%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Peak Learning Day</span>
                <span className="font-medium">Tuesday</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Mobile Usage</span>
                <span className="font-medium">43%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Learning Velocity */}
      <ChartCard
        title="Learning Velocity by Job Role"
        subtitle={`Average learning hours per employee - ${roleComparisonData.length} roles shown`}
      >
        <div className="space-y-6">
          {roleComparisonData.map((role, index) => {
            const avgCurrentHours = role.currentPeriod.count > 0 
              ? (role.currentPeriod.hours / role.currentPeriod.count)
              : 0;
            
            // Calculate percentage based on max hours across all roles (for scaling the bars)
            const maxHours = Math.max(...roleComparisonData.map(r => 
              r.currentPeriod.count > 0 ? (r.currentPeriod.hours / r.currentPeriod.count) : 0
            ));
            const percentage = maxHours > 0 ? Math.round((avgCurrentHours / maxHours) * 100) : 0;
            
            // Color mapping for different roles
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'];
            const color = colors[index % colors.length];

            return (
              <div key={role.role}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-foreground">{role.role}</span>
                  <span className="text-sm font-semibold">{avgCurrentHours.toFixed(1)}h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${color} h-3 rounded-full transition-all duration-300`} 
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>

      {/* New Analysis Charts to Answer All Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Learning Time by Skill Categories */}
        <ChartCard title="Learning Time by Skill Categories" subtitle="How participants spend time on different skills">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Technical Skills', value: 445, hours: '445h' },
                  { name: 'Leadership', value: 287, hours: '287h' },
                  { name: 'Communication', value: 234, hours: '234h' },
                  { name: 'Project Management', value: 198, hours: '198h' },
                  { name: 'Data Analysis', value: 176, hours: '176h' },
                  { name: 'Other', value: 123, hours: '123h' }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="hsl(var(--primary))"
                dataKey="value"
                label={({ name, hours }) => `${name}: ${hours}`}
              >
                {[0,1,2,3,4,5].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}h`, 'Learning Hours']} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Learning Satisfaction Trends */}
        <ChartCard title="Learning Satisfaction Over Time" subtitle="Participant satisfaction ratings">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { month: 'Jan', satisfaction: 86, responses: 234 },
              { month: 'Feb', satisfaction: 87, responses: 267 },
              { month: 'Mar', satisfaction: 85, responses: 289 },
              { month: 'Apr', satisfaction: 88, responses: 312 },
              { month: 'May', satisfaction: 89, responses: 345 },
              { month: 'Jun', satisfaction: 91, responses: 378 },
              { month: 'Jul', satisfaction: 89, responses: 398 },
              { month: 'Aug', satisfaction: 92, responses: 423 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 95]} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'satisfaction' ? `${value}%` : value,
                  name === 'satisfaction' ? 'Satisfaction Score' : 'Survey Responses'
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line type="monotone" dataKey="satisfaction" stroke="hsl(var(--primary))" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Assignment vs Completion Tracking */}
        <ChartCard title="Learning Assignments vs Completions" subtitle="Assignment effectiveness tracking">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={[
              { month: 'Jan', assigned: 1200, completed: 847, rate: 71 },
              { month: 'Feb', assigned: 1350, completed: 956, rate: 71 },
              { month: 'Mar', assigned: 1180, completed: 874, rate: 74 },
              { month: 'Apr', assigned: 1420, completed: 1087, rate: 77 },
              { month: 'May', assigned: 1560, completed: 1234, rate: 79 },
              { month: 'Jun', assigned: 1380, completed: 1156, rate: 84 },
              { month: 'Jul', assigned: 1650, completed: 1378, rate: 84 },
              { month: 'Aug', assigned: 1720, completed: 1487, rate: 86 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[60, 100]} />
              <Tooltip contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }} />
              <Bar yAxisId="left" dataKey="assigned" fill="hsl(var(--muted))" name="Assignments Created" />
              <Bar yAxisId="left" dataKey="completed" fill="hsl(var(--primary))" name="Completions" />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="hsl(var(--accent))" strokeWidth={3} name="Completion Rate %" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Skills Progression & Correlation Analysis */}
      <ChartCard title="Learning Impact on Skill Progression" subtitle="Correlation between learning activities and skill rating improvements">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={activityRatingTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[3, 6]} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'learningActivities') return [value, 'Learning Activities'];
                const nameStr = typeof name === 'string' ? name : String(name);
                return [value, nameStr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())];
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Bar yAxisId="left" dataKey="learningActivities" fill="hsl(var(--muted))" name="Learning Activities" />
            <Line yAxisId="right" type="monotone" dataKey="peerRating" stroke="hsl(var(--primary))" strokeWidth={2} name="Peer Rating" />
            <Line yAxisId="right" type="monotone" dataKey="managerRating" stroke="hsl(var(--accent))" strokeWidth={2} name="Manager Rating" />
            <Line yAxisId="right" type="monotone" dataKey="selfRating" stroke="hsl(var(--secondary))" strokeWidth={2} name="Self Rating" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2">Key Insights:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Strong correlation visible between learning activities spike (Aug 2025: 5,440 activities) and rating improvements</li>
            <li>• Manager ratings show consistent upward trend, indicating sustained skill development</li>
            <li>• Self and peer ratings demonstrate positive correlation with increased learning engagement</li>
          </ul>
        </div>
      </ChartCard>

      {/* Provider Satisfaction and Assignments Status - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Provider Satisfaction Analysis */}
        <ChartCard title="Learning Provider Satisfaction Ratings" subtitle="Which provider has the highest user satisfaction?">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { provider: 'LinkedIn Learning', satisfaction: 92, users: 1234, avgRating: 4.6 },
              { provider: 'Coursera', satisfaction: 89, users: 987, avgRating: 4.5 },
              { provider: 'Udemy', satisfaction: 87, users: 856, avgRating: 4.4 },
              { provider: 'Internal LMS', satisfaction: 84, users: 1567, avgRating: 4.2 },
              { provider: 'Pluralsight', satisfaction: 91, users: 678, avgRating: 4.6 },
              { provider: 'edX', satisfaction: 88, users: 445, avgRating: 4.4 }
            ].sort((a, b) => b.satisfaction - a.satisfaction)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="provider" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[75, 95]} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover p-3 border border-border rounded-lg shadow-md">
                        <p className="font-semibold text-popover-foreground">{label}</p>
                        <div className="space-y-1 mt-2">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Satisfaction Score:</span> {data.satisfaction}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Average Rating:</span> {data.avgRating}★
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Total Users:</span> {data.users.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="satisfaction" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-muted/20 rounded-lg">
            <div className="text-sm font-medium text-green-600">🏆 Highest Satisfaction: LinkedIn Learning (92%)</div>
          </div>
        </ChartCard>

        {/* Overdue Assignments Tracking */}
        <ChartCard title="Learning Assignments Status" subtitle="Assignment completion and overdue tracking">
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Total Assigned</div>
                <div className="text-2xl font-bold">1,720</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-2xl font-bold text-green-600">1,456</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Overdue</div>
                <div className="text-2xl font-bold text-red-600">89</div>
              </div>
            </div>

            {/* Status Distribution Pie Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: 84.7, count: 1456, color: 'hsl(var(--success))' },
                    { name: 'In Progress', value: 10.1, count: 175, color: 'hsl(var(--warning))' },
                    { name: 'Overdue', value: 5.2, count: 89, color: 'hsl(var(--destructive))' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {[
                    { name: 'Completed', value: 84.7, count: 1456, color: 'hsl(var(--success))' },
                    { name: 'In Progress', value: 10.1, count: 175, color: 'hsl(var(--warning))' },
                    { name: 'Overdue', value: 5.2, count: 89, color: 'hsl(var(--destructive))' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}% (${props.payload.count} assignments)`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              <div className="font-medium text-red-800 dark:text-red-200 mb-1">⚠️ Overdue Analysis</div>
              <div className="text-red-700 dark:text-red-300">
                • 62 assignments overdue by &lt; 7 days
                <br />
                • 27 assignments overdue by 15+ days
              </div>
            </div>
          </div>
        </ChartCard>

      </div>

      {/* Internal vs External Learning Adoption - Full Width */}
      <ChartCard title="Internal vs External Learning Adoption" subtitle="Learning source preference trends">
        <div className="space-y-6">
          {/* Visual Comparison with Icons */}
          <div className="grid grid-cols-2 gap-6">
            <div className="relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover-scale">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <div className="text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  ↗ +5% vs last quarter
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">External Learning</div>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">68%</div>
                <div className="text-sm text-blue-600/70 dark:text-blue-400/70">4,234 completions</div>
                
                {/* Progress Bar */}
                <div className="w-full bg-blue-200 dark:bg-blue-800/30 rounded-full h-2 mt-3">
                  <div className="bg-blue-500 h-2 rounded-full animate-fade-in" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>

            <div className="relative p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover-scale">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-lg text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-sm bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                  ↘ -3% vs last quarter
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-green-700 dark:text-green-300">Internal Learning</div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">32%</div>
                <div className="text-sm text-green-600/70 dark:text-green-400/70">1,987 completions</div>
                
                {/* Progress Bar */}
                <div className="w-full bg-green-200 dark:bg-green-800/30 rounded-full h-2 mt-3">
                  <div className="bg-green-500 h-2 rounded-full animate-fade-in" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-amber-800 dark:text-amber-200 mb-1">Key Insight</div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  External learning adoption is increasing, suggesting employees prefer diverse, external content sources. 
                  Consider expanding partnerships with top-rated external providers.
                </div>
              </div>
            </div>
          </div>

          {/* Trend Chart with Enhanced Styling */}
          <div className="space-y-4">
            <div className="text-lg font-semibold text-foreground">Adoption Trends Over Time</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={[
                { month: 'Jan', external: 65, internal: 35, externalUsers: 3800, internalUsers: 2100 },
                { month: 'Feb', external: 67, internal: 33, externalUsers: 3920, internalUsers: 1950 },
                { month: 'Mar', external: 66, internal: 34, externalUsers: 3850, internalUsers: 2000 },
                { month: 'Apr', external: 69, internal: 31, externalUsers: 4100, internalUsers: 1850 },
                { month: 'May', external: 70, internal: 30, externalUsers: 4200, internalUsers: 1800 },
                { month: 'Jun', external: 68, internal: 32, externalUsers: 4050, internalUsers: 1900 },
                { month: 'Jul', external: 67, internal: 33, externalUsers: 3980, internalUsers: 1950 },
                { month: 'Aug', external: 68, internal: 32, externalUsers: 4234, internalUsers: 1987 }
              ]}>
                <defs>
                  <linearGradient id="externalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="internalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover p-4 border border-border rounded-lg shadow-lg">
                          <p className="font-semibold text-popover-foreground mb-2">{label} 2024</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <span className="text-sm">External Learning</span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{data.external}%</div>
                                <div className="text-xs text-muted-foreground">{data.externalUsers.toLocaleString()} users</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                <span className="text-sm">Internal Learning</span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{data.internal}%</div>
                                <div className="text-xs text-muted-foreground">{data.internalUsers.toLocaleString()} users</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="external" 
                  stackId="1" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#externalGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="internal" 
                  stackId="1" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  fill="url(#internalGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Enhanced Legend with Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                <span className="font-medium">External Learning</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">68%</div>
                <div className="text-xs text-muted-foreground">Trending up</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg border border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-secondary animate-pulse"></div>
                <span className="font-medium">Internal Learning</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-secondary">32%</div>
                <div className="text-xs text-muted-foreground">Stable</div>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      <DrillDownDialog
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        data={drillDownData}
        onApplyFilter={() => {}}
        onViewDetails={() => {}}
      />
    </div>
  );
}
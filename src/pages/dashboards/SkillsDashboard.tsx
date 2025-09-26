import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { MultiSelectFilter } from '@/components/filters/MultiSelectFilter';
import { DateRangeFilter } from '@/components/filters/DateRangeFilter';
import { formatNumber, formatPercentage, formatRating, formatChange } from '@/lib/formatters';
import { useFilteredData } from '@/hooks/useFilteredData';
import { FilterState } from '@/contexts/FilterContext';
import {
  SKILLS_DASHBOARD_OPTIONS,
  skillEngagementData,
  skillRatingData,
  skillsDashboardMetrics,
  SkillEngagementData,
  SkillRatingData
} from '@/data/skillsDashboardData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  Tooltip,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, TrendingDown, Users, Award, Target, BarChart3 } from 'lucide-react';
import { DateRange } from 'react-day-picker';

// Custom filter state for this dashboard - matches FilterState interface
interface SkillsDashboardFilters {
  dateRange: DateRange;
  contentType: string[];
  provider: string[];
  skills: string[];
  groups: string[];
  roles: string[];
  customAttribute: string[];
  ratings: number[];
  region: string[];
  period: 'month' | 'quarter' | 'year';
}

const defaultFilters: SkillsDashboardFilters = {
  dateRange: {
    from: new Date('2024-04-01'),
    to: new Date('2025-03-31')
  },
  contentType: [],
  provider: [],
  skills: [],
  groups: [],
  roles: [],
  customAttribute: [],
  ratings: [],
  region: [],
  period: 'month'
};

const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  warning: '#f97316',
  success: '#22c55e',
  info: '#06b6d4',
  purple: '#8b5cf6'
};

export default function SkillsDashboard() {
  const [filters, setFilters] = useState<SkillsDashboardFilters>(defaultFilters);

  const updateFilter = (key: keyof SkillsDashboardFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Filter data based on current filters
  const filteredEngagementData = useFilteredData(skillEngagementData, filters);
  const filteredRatingData = useFilteredData(skillRatingData, filters);

  // Calculate metrics based on filtered data
  const calculatedMetrics = useMemo(() => {
    const totalUsers = new Set(filteredEngagementData.map(d => d.userId)).size || skillsDashboardMetrics.totalUsers;
    const usersWithPlans = filteredEngagementData.filter(d => d.hasSkillPlan).length;
    const usersWithFocus = filteredEngagementData.filter(d => d.hasFocusSkills).length;
    
    const endorsedRatings = filteredRatingData.filter(d => d.isEndorsedSkill);
    const focusRatings = filteredRatingData.filter(d => d.isFocusSkill);
    
    return {
      totalUsers,
      usersWithSkillPlans: usersWithPlans,
      skillPlanPercentage: totalUsers > 0 ? (usersWithPlans / totalUsers) * 100 : 37.0,
      usersWithFocusSkills: usersWithFocus,
      endorsedSkills: endorsedRatings.length,
      totalSkills: filteredRatingData.length,
      focusSkills: focusRatings.length,
      endorsedFocusSkills: focusRatings.filter(d => d.isEndorsedSkill).length,
      avgSelfRatingEndorsed: endorsedRatings.length > 0 
        ? endorsedRatings.reduce((sum, d) => sum + d.selfRating, 0) / endorsedRatings.length
        : skillsDashboardMetrics.avgSelfRatingEndorsed,
      avgSelfRatingFocus: focusRatings.length > 0
        ? focusRatings.reduce((sum, d) => sum + d.selfRating, 0) / focusRatings.length
        : skillsDashboardMetrics.avgSelfRatingFocus,
      avgSelfRating: filteredRatingData.length > 0
        ? filteredRatingData.reduce((sum, d) => sum + d.selfRating, 0) / filteredRatingData.length
        : skillsDashboardMetrics.avgSelfRating,
      avgPeerRating: filteredRatingData.length > 0
        ? filteredRatingData.reduce((sum, d) => sum + d.peerRating, 0) / filteredRatingData.length
        : skillsDashboardMetrics.avgPeerRating,
      avgManagerRating: filteredRatingData.length > 0
        ? filteredRatingData.reduce((sum, d) => sum + d.managerRating, 0) / filteredRatingData.length
        : skillsDashboardMetrics.avgManagerRating
    };
  }, [filteredEngagementData, filteredRatingData]);

  // Chart data calculations
  const skillPlanDonutData = [
    { name: 'Following Skills', value: calculatedMetrics.usersWithSkillPlans, color: CHART_COLORS.primary },
    { name: 'Not Following', value: calculatedMetrics.totalUsers - calculatedMetrics.usersWithSkillPlans, color: '#e5e7eb' }
  ];

  const focusSkillsDonutData = [
    { name: 'With Focus Skills', value: calculatedMetrics.usersWithFocusSkills, color: CHART_COLORS.secondary },
    { name: 'Without Focus', value: calculatedMetrics.totalUsers - calculatedMetrics.usersWithFocusSkills, color: '#e5e7eb' }
  ];

  const endorsedSkillsBarData = [
    { name: 'Endorsed Skills', value: calculatedMetrics.endorsedSkills, color: CHART_COLORS.success },
    { name: 'Total Followed Skills', value: calculatedMetrics.totalSkills, color: CHART_COLORS.info }
  ];

  const endorsedFocusBarData = [
    { name: 'Endorsed Focus', value: calculatedMetrics.endorsedFocusSkills, color: CHART_COLORS.success },
    { name: 'Total Focus Skills', value: calculatedMetrics.focusSkills, color: CHART_COLORS.info }
  ];

  // Quadrant data for scatter plots
  const quadrantDataSelfPeer = useMemo(() => {
    const roleGroups: Record<string, { self: number[]; peer: number[]; count: number }> = {};
    
    filteredRatingData.forEach(d => {
      if (!roleGroups[d.roles[0]]) {
        roleGroups[d.roles[0]] = { self: [], peer: [], count: 0 };
      }
      roleGroups[d.roles[0]].self.push(d.selfRating);
      roleGroups[d.roles[0]].peer.push(d.peerRating);
      roleGroups[d.roles[0]].count++;
    });

    return Object.entries(roleGroups).map(([role, data]) => ({
      role,
      self: data.self.reduce((a, b) => a + b, 0) / data.self.length,
      peer: data.peer.reduce((a, b) => a + b, 0) / data.peer.length,
      count: data.count
    }));
  }, [filteredRatingData]);

  const quadrantDataSelfManager = useMemo(() => {
    const roleGroups: Record<string, { self: number[]; manager: number[]; count: number }> = {};
    
    filteredRatingData.forEach(d => {
      if (!roleGroups[d.roles[0]]) {
        roleGroups[d.roles[0]] = { self: [], manager: [], count: 0 };
      }
      roleGroups[d.roles[0]].self.push(d.selfRating);
      roleGroups[d.roles[0]].manager.push(d.managerRating);
      roleGroups[d.roles[0]].count++;
    });

    return Object.entries(roleGroups).map(([role, data]) => ({
      role,
      self: data.self.reduce((a, b) => a + b, 0) / data.self.length,
      manager: data.manager.reduce((a, b) => a + b, 0) / data.manager.length,
      count: data.count
    }));
  }, [filteredRatingData]);

  // Top skills driving high ratings
  const topSkillsData = useMemo(() => {
    const skillGroups: Record<string, { ratings: number[]; count: number }> = {};
    
    filteredRatingData.forEach(d => {
      if (!skillGroups[d.skill]) {
        skillGroups[d.skill] = { ratings: [], count: 0 };
      }
      skillGroups[d.skill].ratings.push(d.selfRating);
      skillGroups[d.skill].count++;
    });

    return Object.entries(skillGroups)
      .map(([skill, data]) => ({
        skill,
        avgRating: data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length,
        count: data.count
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 8);
  }, [filteredRatingData]);

  // Rating discrepancy data
  const discrepancyData = useMemo(() => {
    const roleGroups: Record<string, { differences: number[] }> = {};
    
    filteredRatingData.forEach(d => {
      if (!roleGroups[d.roles[0]]) {
        roleGroups[d.roles[0]] = { differences: [] };
      }
      roleGroups[d.roles[0]].differences.push(d.peerRating - d.selfRating);
    });

    return Object.entries(roleGroups).map(([role, data]) => ({
      role,
      avgDifference: data.differences.reduce((a, b) => a + b, 0) / data.differences.length,
      medianDifference: data.differences.sort((a, b) => a - b)[Math.floor(data.differences.length / 2)]
    }));
  }, [filteredRatingData]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Skills Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive skills analysis, ratings, and development tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export PDF</Button>
          <Button variant="outline" size="sm">Export PPT</Button>
          <Button size="sm">Share Dashboard</Button>
        </div>
      </div>

      {/* Global Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Global Filters</span>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            <DateRangeFilter
              value={filters.dateRange}
              onChange={(range) => updateFilter('dateRange', range)}
            />
            <MultiSelectFilter
              label="Role"
              options={SKILLS_DASHBOARD_OPTIONS.roles}
              selected={filters.roles}
              onChange={(value) => updateFilter('roles', value)}
            />
            <MultiSelectFilter
              label="Groups/Teams"
              options={SKILLS_DASHBOARD_OPTIONS.groups}
              selected={filters.groups}
              onChange={(value) => updateFilter('groups', value)}
            />
            <MultiSelectFilter
              label="Provider"
              options={SKILLS_DASHBOARD_OPTIONS.providers}
              selected={filters.provider}
              onChange={(value) => updateFilter('provider', value)}
            />
            <MultiSelectFilter
              label="Content Type"
              options={SKILLS_DASHBOARD_OPTIONS.contentTypes}
              selected={filters.contentType}
              onChange={(value) => updateFilter('contentType', value)}
            />
            <MultiSelectFilter
              label="Skills"
              options={SKILLS_DASHBOARD_OPTIONS.skills}
              selected={filters.skills}
              onChange={(value) => updateFilter('skills', value)}
            />
            <MultiSelectFilter
              label="Ratings"
              options={SKILLS_DASHBOARD_OPTIONS.ratings.map(r => r.toString())}
              selected={filters.ratings.map(r => r.toString())}
              onChange={(value) => updateFilter('ratings', value.map(v => parseInt(v)))}
            />
            <MultiSelectFilter
              label="Region"
              options={SKILLS_DASHBOARD_OPTIONS.regions}
              selected={filters.region}
              onChange={(value) => updateFilter('region', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 1: User Engagement with Skills */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">1. Are users engaged with skill development?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="% Users Following Skills"
            value={calculatedMetrics.skillPlanPercentage}
            valueType="percentage"
            change={{
              value: skillsDashboardMetrics.skillPlanTrend,
              type: 'positive',
              period: 'vs last year'
            }}
            icon={<TrendingUp className="h-5 w-5" />}
            className="col-span-1"
          />
          
          <MetricCard
            title="Avg Skills Per User"
            value={skillsDashboardMetrics.averageSkillsPerUser}
            change={{
              value: Math.abs(skillsDashboardMetrics.skillsPerUserTrend),
              type: 'negative',
              period: 'YoY'
            }}
            icon={<Target className="h-5 w-5" />}
            className="col-span-1"
          />

          <div className="col-span-1 md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Users Following vs Not Following Skills" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillPlanDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {skillPlanDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.[0]) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatNumber(payload[0].value)} users
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Users With vs Without Focus Skills" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={focusSkillsDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {focusSkillsDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.[0]) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatNumber(payload[0].value)} users
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>

      {/* Section 2: Critical Skills Development */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">2. Are users developing critical skills?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Endorsed vs All Followed Skills" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={endorsedSkillsBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatNumber(value)} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.[0]) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(payload[0].value)} skills
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" fill={CHART_COLORS.success} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Endorsed vs All Focus Skills" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={endorsedFocusBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatNumber(value)} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.[0]) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(payload[0].value)} skills
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" fill={CHART_COLORS.success} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Section 3: Self Ratings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">3. How are users rating themselves?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title="Avg Self Rating - Endorsed Skills"
            value={calculatedMetrics.avgSelfRatingEndorsed}
            valueType="rating"
            icon={<Award className="h-5 w-5" />}
            className="col-span-1"
          />
          
          <MetricCard
            title="Avg Self Rating - Focus Skills"
            value={calculatedMetrics.avgSelfRatingFocus}
            valueType="rating"
            icon={<Target className="h-5 w-5" />}
            className="col-span-1"
          />
        </div>
      </div>

      {/* Section 4: Rating Relationships */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">4. Relationships between different rating types</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Self vs Peer Ratings by Role" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="self" 
                  name="Self Rating"
                  domain={[1, 5]}
                  tickFormatter={(value) => formatRating(value)}
                />
                <YAxis 
                  type="number" 
                  dataKey="peer" 
                  name="Peer Rating"
                  domain={[1, 5]}
                  tickFormatter={(value) => formatRating(value)}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{data.role}</p>
                          <p className="text-sm text-muted-foreground">
                            Self: {formatRating(data.self)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Peer: {formatRating(data.peer)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Count: {formatNumber(data.count)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={quadrantDataSelfPeer} fill={CHART_COLORS.primary} />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Self vs Manager Ratings by Role" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="self" 
                  name="Self Rating"
                  domain={[1, 5]}
                  tickFormatter={(value) => formatRating(value)}
                />
                <YAxis 
                  type="number" 
                  dataKey="manager" 
                  name="Manager Rating"
                  domain={[1, 5]}
                  tickFormatter={(value) => formatRating(value)}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{data.role}</p>
                          <p className="text-sm text-muted-foreground">
                            Self: {formatRating(data.self)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Manager: {formatRating(data.manager)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Count: {formatNumber(data.count)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={quadrantDataSelfManager} fill={CHART_COLORS.secondary} />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Section 5: Drivers of High Ratings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">5. Drivers of High Self Ratings</h2>
        
        <ChartCard title="Top Skills by Average Self Rating" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSkillsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatRating(value)} />
              <YAxis dataKey="skill" type="category" width={120} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload?.[0]) {
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">
                          Avg Rating: {formatRating(payload[0].value)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Count: {formatNumber(payload[0].payload.count)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="avgRating" fill={CHART_COLORS.accent} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Section 6: Discrepancy Analysis */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">6. Discrepancy Analysis</h2>
        
        <ChartCard title="Peer vs Self Rating Differences by Role" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={discrepancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis tickFormatter={(value) => formatRating(value)} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload?.[0]) {
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">
                          Avg Difference: {formatRating(payload[0].value)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Median: {formatRating(payload[0].payload.medianDifference)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="avgDifference" fill={CHART_COLORS.purple} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={calculatedMetrics.totalUsers}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Self Rating"
          value={calculatedMetrics.avgSelfRating}
          valueType="rating"
          icon={<Award className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Peer Rating"
          value={calculatedMetrics.avgPeerRating}
          valueType="rating"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Manager Rating"
          value={calculatedMetrics.avgManagerRating}
          valueType="rating"
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}
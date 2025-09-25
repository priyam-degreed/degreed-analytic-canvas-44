// Comprehensive Learning Dashboard Data

export interface LearningActivity {
  id: string;
  title: string;
  contentType: 'Course' | 'Article' | 'Assessment' | 'Event';
  provider: string;
  role: string;
  skill: string[];
  rating: number;
  completions: number;
  enrollments: number;
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timePeriod: string;
  fiscalYear: string;
  quarter: string;
  month: string;
  avgRating: number;
  completionRate: number;
  learningHours: number;
  activeUsers: number;
}

// Content types
export const contentTypes = ['Course', 'Article', 'Assessment', 'Event'] as const;

// Providers with their specialties
export const providers = [
  'Coursera', 'Udemy', 'LinkedIn Learning', 'Pluralsight', 
  'edX', 'Skillsoft', 'CloudGuru', 'Codecademy',
  'Internal Training', 'Conference', 'Workshop', 'Webinar'
];

// Roles mapped to skills
export const roleSkillMapping = {
  "Data Scientist": ["Python", "Machine Learning", "SQL", "Statistics", "Data Visualization", "R", "TensorFlow"],
  "Backend Engineer": ["Java", "Python", "Node.js", "AWS", "Docker", "Kubernetes", "System Design", "API Design"],
  "Frontend Engineer": ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Vue.js", "Angular", "Web Performance"],
  "Product Manager": ["Product Strategy", "Analytics", "Leadership", "Communication", "Market Research", "Agile", "Roadmapping"],
  "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "CI/CD", "Infrastructure", "Monitoring", "Security", "Terraform"],
  "ML Engineer": ["Python", "Machine Learning", "MLOps", "Deep Learning", "TensorFlow", "PyTorch", "Data Pipeline", "Model Deployment"],
  "UX Designer": ["Design Systems", "User Research", "Prototyping", "Figma", "Adobe Creative", "Information Architecture", "Usability Testing"],
  "Engineering Manager": ["Leadership", "People Management", "Strategic Planning", "Performance Management", "Team Building", "Communication"],
  "Technical Lead": ["Leadership", "Code Review", "Mentoring", "System Design", "Architecture", "Technical Strategy"],
  "Business Analyst": ["Business Intelligence", "Data Analytics", "Requirements Analysis", "Process Improvement", "Stakeholder Management"]
};

// Fiscal periods structure
export interface FiscalPeriod {
  fiscalYear: string;
  quarter: string;
  month: string;
  value: string;
  label: string;
}

export const fiscalPeriods: FiscalPeriod[] = [
  // FY24
  { fiscalYear: "FY24", quarter: "Q1", month: "Jan", value: "FY24-Q1-Jan", label: "FY24 Q1 Jan" },
  { fiscalYear: "FY24", quarter: "Q1", month: "Feb", value: "FY24-Q1-Feb", label: "FY24 Q1 Feb" },
  { fiscalYear: "FY24", quarter: "Q1", month: "Mar", value: "FY24-Q1-Mar", label: "FY24 Q1 Mar" },
  { fiscalYear: "FY24", quarter: "Q2", month: "Apr", value: "FY24-Q2-Apr", label: "FY24 Q2 Apr" },
  { fiscalYear: "FY24", quarter: "Q2", month: "May", value: "FY24-Q2-May", label: "FY24 Q2 May" },
  { fiscalYear: "FY24", quarter: "Q2", month: "Jun", value: "FY24-Q2-Jun", label: "FY24 Q2 Jun" },
  { fiscalYear: "FY24", quarter: "Q3", month: "Jul", value: "FY24-Q3-Jul", label: "FY24 Q3 Jul" },
  { fiscalYear: "FY24", quarter: "Q3", month: "Aug", value: "FY24-Q3-Aug", label: "FY24 Q3 Aug" },
  { fiscalYear: "FY24", quarter: "Q3", month: "Sep", value: "FY24-Q3-Sep", label: "FY24 Q3 Sep" },
  { fiscalYear: "FY24", quarter: "Q4", month: "Oct", value: "FY24-Q4-Oct", label: "FY24 Q4 Oct" },
  { fiscalYear: "FY24", quarter: "Q4", month: "Nov", value: "FY24-Q4-Nov", label: "FY24 Q4 Nov" },
  { fiscalYear: "FY24", quarter: "Q4", month: "Dec", value: "FY24-Q4-Dec", label: "FY24 Q4 Dec" },
  
  // FY25
  { fiscalYear: "FY25", quarter: "Q1", month: "Jan", value: "FY25-Q1-Jan", label: "FY25 Q1 Jan" },
  { fiscalYear: "FY25", quarter: "Q1", month: "Feb", value: "FY25-Q1-Feb", label: "FY25 Q1 Feb" },
  { fiscalYear: "FY25", quarter: "Q1", month: "Mar", value: "FY25-Q1-Mar", label: "FY25 Q1 Mar" },
  { fiscalYear: "FY25", quarter: "Q2", month: "Apr", value: "FY25-Q2-Apr", label: "FY25 Q2 Apr" },
  { fiscalYear: "FY25", quarter: "Q2", month: "May", value: "FY25-Q2-May", label: "FY25 Q2 May" },
  { fiscalYear: "FY25", quarter: "Q2", month: "Jun", value: "FY25-Q2-Jun", label: "FY25 Q2 Jun" },
];

// Learning activities with comprehensive data
const learningActivities: LearningActivity[] = [];

// Generate comprehensive learning data
function generateLearningData(): LearningActivity[] {
  const activities: LearningActivity[] = [];
  let idCounter = 1;

  Object.entries(roleSkillMapping).forEach(([role, skills]) => {
    skills.forEach(skill => {
      fiscalPeriods.forEach(period => {
        // Generate multiple content types per skill per period
        contentTypes.forEach(contentType => {
          const numActivities = Math.floor(Math.random() * 3) + 1; // 1-3 activities per type
          
          for (let i = 0; i < numActivities; i++) {
            const provider = providers[Math.floor(Math.random() * providers.length)];
            const enrollments = Math.floor(Math.random() * 500) + 50;
            const completionRate = Math.random() * 40 + 60; // 60-100%
            const completions = Math.floor(enrollments * (completionRate / 100));
            const avgRating = Math.random() * 2 + 3; // 3-5 rating
            const duration = contentType === 'Course' ? Math.floor(Math.random() * 120) + 30 :
                            contentType === 'Article' ? Math.floor(Math.random() * 30) + 5 :
                            contentType === 'Assessment' ? Math.floor(Math.random() * 60) + 15 :
                            Math.floor(Math.random() * 180) + 60; // Event
            
            const activity: LearningActivity = {
              id: `activity-${idCounter++}`,
              title: generateActivityTitle(skill, contentType),
              contentType,
              provider,
              role,
              skill: [skill],
              rating: Math.floor(avgRating),
              completions,
              enrollments,
              duration,
              difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)] as any,
              timePeriod: period.value,
              fiscalYear: period.fiscalYear,
              quarter: period.quarter,
              month: period.month,
              avgRating: Number(avgRating.toFixed(1)),
              completionRate: Number(completionRate.toFixed(1)),
              learningHours: (completions * duration) / 60,
              activeUsers: Math.floor(enrollments * 0.8) // 80% of enrolled are active
            };
            
            activities.push(activity);
          }
        });
      });
    });
  });

  return activities;
}

function generateActivityTitle(skill: string, contentType: string): string {
  const courseTemplates = {
    'Course': [
      `Advanced ${skill} Mastery`,
      `Complete ${skill} Bootcamp`,
      `${skill} for Professionals`,
      `Mastering ${skill} Fundamentals`
    ],
    'Article': [
      `${skill} Best Practices Guide`,
      `Latest Trends in ${skill}`,
      `${skill} Quick Reference`,
      `Getting Started with ${skill}`
    ],
    'Assessment': [
      `${skill} Competency Test`,
      `${skill} Skills Assessment`,
      `${skill} Certification Exam`,
      `${skill} Knowledge Check`
    ],
    'Event': [
      `${skill} Workshop`,
      `${skill} Conference`,
      `${skill} Masterclass`,
      `${skill} Expert Panel`
    ]
  };

  const templates = courseTemplates[contentType];
  return templates[Math.floor(Math.random() * templates.length)];
}

export const learningData = generateLearningData();

// Aggregated metrics for dashboard
export const learningMetrics = {
  totalLearners: learningData.reduce((sum, activity) => sum + activity.activeUsers, 0) / learningData.length,
  totalActivities: learningData.length,
  totalCompletions: learningData.reduce((sum, activity) => sum + activity.completions, 0),
  totalLearningHours: learningData.reduce((sum, activity) => sum + activity.learningHours, 0),
  avgCompletionRate: learningData.reduce((sum, activity) => sum + activity.completionRate, 0) / learningData.length,
  avgRating: learningData.reduce((sum, activity) => sum + activity.avgRating, 0) / learningData.length
};

// Filter data by various criteria  
export function filterLearningData(
  data: LearningActivity[],
  filters: {
    roles?: string[];
    contentTypes?: string[];
    providers?: string[];
    ratings?: number[];
    periods?: string[];
    skills?: string[];
  }
): LearningActivity[] {
  return data.filter(activity => {
    // Role filter
    if (filters.roles && filters.roles.length > 0) {
      if (!filters.roles.includes(activity.role)) return false;
    }
    
    // Content type filter
    if (filters.contentTypes && filters.contentTypes.length > 0) {
      if (!filters.contentTypes.includes(activity.contentType)) return false;
    }
    
    // Provider filter
    if (filters.providers && filters.providers.length > 0) {
      if (!filters.providers.includes(activity.provider)) return false;
    }
    
    // Rating filter
    if (filters.ratings && filters.ratings.length > 0) {
      if (!filters.ratings.includes(activity.rating)) return false;
    }
    
    // Period filter
    if (filters.periods && filters.periods.length > 0) {
      const matchesPeriod = filters.periods.some(period => {
        // Support fiscal year, quarter, and specific month matching
        if (period === activity.fiscalYear) return true;
        if (period === `${activity.fiscalYear}-${activity.quarter}`) return true;
        if (period === activity.timePeriod) return true;
        return false;
      });
      if (!matchesPeriod) return false;
    }
    
    // Skills filter
    if (filters.skills && filters.skills.length > 0) {
      if (!activity.skill.some(skill => filters.skills?.includes(skill))) return false;
    }
    
    return true;
  });
}

// Generate engagement trends data
export function generateEngagementTrends(filteredData: LearningActivity[]) {
  const periodGroups = new Map<string, {
    completions: number;
    learningHours: number;
    activeUsers: number;
  }>();

  filteredData.forEach(activity => {
    const key = activity.timePeriod;
    if (!periodGroups.has(key)) {
      periodGroups.set(key, { completions: 0, learningHours: 0, activeUsers: 0 });
    }
    const group = periodGroups.get(key)!;
    group.completions += activity.completions;
    group.learningHours += activity.learningHours;
    group.activeUsers += activity.activeUsers;
  });

  return Array.from(periodGroups.entries()).map(([period, data]) => ({
    period,
    ...data
  })).sort((a, b) => a.period.localeCompare(b.period));
}

// Generate content performance data
export function generateContentPerformance(filteredData: LearningActivity[]) {
  const contentGroups = new Map<string, {
    enrollments: number;
    completions: number;
    totalRating: number;
    count: number;
  }>();

  filteredData.forEach(activity => {
    const key = activity.contentType;
    if (!contentGroups.has(key)) {
      contentGroups.set(key, { enrollments: 0, completions: 0, totalRating: 0, count: 0 });
    }
    const group = contentGroups.get(key)!;
    group.enrollments += activity.enrollments;
    group.completions += activity.completions;
    group.totalRating += activity.avgRating;
    group.count += 1;
  });

  return Array.from(contentGroups.entries()).map(([contentType, data]) => ({
    contentType,
    enrollments: data.enrollments,
    completions: data.completions,
    completionRate: Number(((data.completions / data.enrollments) * 100).toFixed(1)),
    avgRating: Number((data.totalRating / data.count).toFixed(1))
  }));
}

// Generate popular skills data
export function generatePopularSkills(filteredData: LearningActivity[]) {
  const skillGroups = new Map<string, {
    learners: number;
    completions: number;
    avgRating: number;
    totalRating: number;
    count: number;
  }>();

  filteredData.forEach(activity => {
    activity.skill.forEach(skill => {
      if (!skillGroups.has(skill)) {
        skillGroups.set(skill, { learners: 0, completions: 0, avgRating: 0, totalRating: 0, count: 0 });
      }
      const group = skillGroups.get(skill)!;
      group.learners += activity.activeUsers;
      group.completions += activity.completions;
      group.totalRating += activity.avgRating;
      group.count += 1;
    });
  });

  return Array.from(skillGroups.entries())
    .map(([skill, data]) => ({
      skill,
      learners: data.learners,
      completions: data.completions,
      avgRating: Number((data.totalRating / data.count).toFixed(1))
    }))
    .sort((a, b) => b.learners - a.learners)
    .slice(0, 10); // Top 10 skills
}
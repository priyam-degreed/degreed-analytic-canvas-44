// Comprehensive Mock Data Generator with Full Filter Coverage - Updated with realistic role baselines
import { FilterableDataItem } from '@/hooks/useFilteredData';
import { addDays, subDays, format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns';

// Enhanced filter options (matching FilterBar components exactly)
export const FILTER_OPTIONS = {
  contentTypes: [
    "Academy", "Article", "Assessment", "Book", "Course", "Event", "Podcast", "Task"
  ],
  providers: [
    "Codecademy", "Cloud Academy", "Udemy", "Coursera", "Pluralsight", 
    "LinkedIn Learning", "edX", "Skillsoft"
  ],
  skills: [
    "Leadership", "Data Visualization", "Project Management", "Business Intelligence",
    "Python Programming", "Machine Learning", "Cloud Computing", "Data Analytics",
    "Innovation", "Java", "Business Analysis", "Big Data Analysis"
  ],
  groups: [
    "Engineering Team", "Product Team", "Marketing Team", "Sales Team",
    "Data Science Team", "Design Team", "Operations Team", "HR Team",
    "Finance Team", "Executive Team", "Customer Success Team", "Quality Assurance Team"
  ],
  roles: [
    "Software Engineer", "Senior Software Engineer", "Tech Lead", "Engineering Manager",
    "Product Manager", "Senior Product Manager", "Data Scientist", "Senior Data Scientist",
    "Data Analyst", "UX Designer", "Senior UX Designer", "Marketing Manager",
    "Sales Manager", "DevOps Engineer", "QA Engineer", "Business Analyst",
    "Project Manager", "Scrum Master", "Director", "VP Engineering", "CTO"
  ],
  customAttributes: [
    "Budget", "Completion Status", "Compliance", "Learning Hours", "Onboarding", "Skill Proficiency"
  ]
};

// Date hierarchy for FY25 (April 2024 - March 2025)
export const DATE_HIERARCHY = {
  FY25: {
    Q1: {
      months: ["2024-04", "2024-05", "2024-06"],
      dates: generateDateRange("2024-04-01", "2024-06-30")
    },
    Q2: {
      months: ["2024-07", "2024-08", "2024-09"],
      dates: generateDateRange("2024-07-01", "2024-09-30")
    },
    Q3: {
      months: ["2024-10", "2024-11", "2024-12"],
      dates: generateDateRange("2024-10-01", "2024-12-31")
    },
    Q4: {
      months: ["2025-01", "2025-02", "2025-03"],
      dates: generateDateRange("2025-01-01", "2025-03-31")
    }
  }
};

function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(format(d, 'yyyy-MM-dd'));
  }
  
  return dates;
}

// Enhanced data interfaces
export interface ComprehensiveLearningItem extends FilterableDataItem {
  id: string;
  date: string;
  contentType: string;
  provider: string;
  skills: string[];
  groups: string[];
  roles: string[];
  customAttribute: string[];
  
  // Metrics with realistic ranges
  learners: number;          // 10-500/month/team
  completions: number;       // 10-500/month/team
  hours: number;            // 50-2,000/month/team
  engagementRate: number;   // 35-90%
  avgRating: number;        // 1-5
  activeUsers: number;      // Based on learners
}

export interface SkillRatingItem extends FilterableDataItem {
  id: string;
  skill: string;
  currentRating: number;    // 1-5
  targetRating: number;     // 1-5
  date: string;
  contentType: string;
  provider: string;
  skills: string[];
  groups: string[];
  roles: string[];
  customAttribute: string[];
}

// Utility functions for realistic data generation
function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 1): number {
  return +(Math.random() * (max - min) + min).toFixed(decimals);
}

function getRandomElements<T>(array: T[], min: number = 1, max?: number): T[] {
  const count = getRandomInRange(min, max || Math.min(3, array.length));
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Generate comprehensive learning data covering all filter combinations
export function generateComprehensiveLearningData(): ComprehensiveLearningItem[] {
  const data: ComprehensiveLearningItem[] = [];
  let idCounter = 1;

  // Generate data for each quarter
  Object.entries(DATE_HIERARCHY.FY25).forEach(([quarter, qData]) => {
    // Generate data for each month in the quarter
    qData.months.forEach(monthKey => {
      const monthStart = new Date(`${monthKey}-01`);
      const monthEnd = endOfMonth(monthStart);
      
      // Generate daily data points for the month to increase density
      for (let day = 0; day < 30; day++) {
        const currentDate = format(addDays(monthStart, day), 'yyyy-MM-dd');
        
        // Generate data for each role-content-provider combination
        FILTER_OPTIONS.roles.forEach(role => {
          FILTER_OPTIONS.contentTypes.forEach(contentType => {
            // Generate entries for each provider, but not every combination every day
            const shouldGenerate = Math.random() < 0.3; // 30% chance per combination per day
            if (!shouldGenerate) return;
            
            const provider = FILTER_OPTIONS.providers[Math.floor(Math.random() * FILTER_OPTIONS.providers.length)];
            const skills = getRandomElements(FILTER_OPTIONS.skills, 1, 4);
            const groups = getRandomElements(FILTER_OPTIONS.groups, 1, 3);
            const customAttribute = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 3);
            
            // Generate realistic metrics with seasonal variation
            const quarterMultiplier = quarter === 'Q1' ? 1.2 : quarter === 'Q4' ? 0.8 : 1.0;
            const roleMultiplier = getRoleMultiplier(role);
            const baseLearners = getProviderMultiplier(provider) * getContentTypeMultiplier(contentType) * roleMultiplier * quarterMultiplier;
            
            const learners = Math.max(5, getRandomInRange(Math.floor(baseLearners * 0.6), Math.floor(baseLearners * 1.4)));
            const completions = Math.floor(learners * getRandomFloat(0.55, 0.98));
            const hours = Math.max(10, Math.floor(learners * getRandomFloat(2, 25)));
            const engagementRate = getRandomFloat(35, 98);
            const avgRating = getRandomFloat(2.8, 4.9);
            const activeUsers = Math.floor(learners * getRandomFloat(0.65, 0.98));

            data.push({
              id: `comprehensive-${idCounter++}`,
              date: currentDate,
              contentType,
              provider,
              skills,
              groups,
              roles: [role],
              customAttribute,
              learners,
              completions,
              hours,
              engagementRate,
              avgRating,
              activeUsers
            });
          });
        });
        
        // Generate some multi-role entries for team projects
        const teamProjectsCount = getRandomInRange(3, 8);
        for (let i = 0; i < teamProjectsCount; i++) {
          const contentType = FILTER_OPTIONS.contentTypes[Math.floor(Math.random() * FILTER_OPTIONS.contentTypes.length)];
          const provider = FILTER_OPTIONS.providers[Math.floor(Math.random() * FILTER_OPTIONS.providers.length)];
          const skills = getRandomElements(FILTER_OPTIONS.skills, 2, 5);
          const groups = getRandomElements(FILTER_OPTIONS.groups, 1, 3);
          const roles = getRandomElements(FILTER_OPTIONS.roles, 2, 4);
          const customAttribute = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 3);
          
          const baseLearners = getProviderMultiplier(provider) * getContentTypeMultiplier(contentType);
          const learners = Math.max(8, getRandomInRange(Math.floor(baseLearners * 0.7), Math.floor(baseLearners * 1.2)));
          const completions = Math.floor(learners * getRandomFloat(0.6, 0.95));
          const hours = Math.max(15, Math.floor(learners * getRandomFloat(3, 20)));
          const engagementRate = getRandomFloat(40, 95);
          const avgRating = getRandomFloat(3.0, 4.8);
          const activeUsers = Math.floor(learners * getRandomFloat(0.7, 0.95));

          data.push({
            id: `comprehensive-${idCounter++}`,
            date: currentDate,
            contentType,
            provider,
            skills,
            groups,
            roles,
            customAttribute,
            learners,
            completions,
            hours,
            engagementRate,
            avgRating,
            activeUsers
          });
        }
      }
    });
  });

  return data;
}

// Generate skill rating data for all combinations
export function generateSkillRatingData(): SkillRatingItem[] {
  const data: SkillRatingItem[] = [];
  let idCounter = 1;

  // Define role-skill priorities to ensure relevant skill gaps
  const roleSkillPriorities = {
    "Software Engineer": ["Python Programming", "Java", "Cloud Computing", "Data Analytics"],
    "Senior Software Engineer": ["Python Programming", "Java", "Cloud Computing", "Leadership"],
    "Tech Lead": ["Leadership", "Project Management", "Python Programming", "Innovation"],
    "Engineering Manager": ["Leadership", "Project Management", "Innovation", "Business Analysis"],
    "Product Manager": ["Leadership", "Project Management", "Business Analysis", "Innovation"],
    "Senior Product Manager": ["Leadership", "Project Management", "Business Analysis", "Business Intelligence"],
    "Data Scientist": ["Python Programming", "Machine Learning", "Data Analytics", "Big Data Analysis"],
    "Senior Data Scientist": ["Python Programming", "Machine Learning", "Data Analytics", "Business Intelligence"],
    "Data Analyst": ["Data Analytics", "Business Intelligence", "Data Visualization", "Python Programming"],
    "UX Designer": ["Innovation", "Data Visualization", "Leadership", "Business Analysis"],
    "Senior UX Designer": ["Innovation", "Data Visualization", "Leadership", "Project Management"],
    "Marketing Manager": ["Leadership", "Data Analytics", "Business Intelligence", "Innovation"],
    "Sales Manager": ["Leadership", "Business Analysis", "Project Management", "Innovation"],
    "DevOps Engineer": ["Cloud Computing", "Python Programming", "Leadership", "Project Management"],
    "QA Engineer": ["Java", "Python Programming", "Project Management", "Cloud Computing"],
    "Business Analyst": ["Business Analysis", "Data Analytics", "Business Intelligence", "Data Visualization"],
    "Project Manager": ["Project Management", "Leadership", "Business Analysis", "Innovation"],
    "Scrum Master": ["Project Management", "Leadership", "Business Analysis", "Innovation"],
    "Director": ["Leadership", "Project Management", "Business Analysis", "Innovation"],
    "VP Engineering": ["Leadership", "Project Management", "Innovation", "Business Analysis"],
    "CTO": ["Leadership", "Innovation", "Project Management", "Cloud Computing"]
  };

  // Generate entries for priority skills per role first
  Object.entries(roleSkillPriorities).forEach(([role, prioritySkills]) => {
    FILTER_OPTIONS.groups.forEach(group => {
      prioritySkills.forEach(skill => {
        // Generate 3-4 entries per role-skill-group combination for priority skills
        const entriesCount = getRandomInRange(3, 4);
        
        for (let i = 0; i < entriesCount; i++) {
          const contentTypes = getRandomElements(FILTER_OPTIONS.contentTypes, 1, 1);
          const providers = getRandomElements(FILTER_OPTIONS.providers, 1, 1);
          const customAttributes = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 2);
          
          // Generate realistic ratings with bigger gaps for priority skills
          const currentRating = getRoleSkillBaseline(role, skill) + getRandomFloat(-0.8, 0.4);
          const targetRating = Math.min(5, currentRating + getRandomFloat(0.6, 1.8));
          
          // Random recent date
          const randomQuarter = Math.floor(Math.random() * 4) + 1;
          const quarterData = DATE_HIERARCHY.FY25[`Q${randomQuarter}` as keyof typeof DATE_HIERARCHY.FY25];
          const randomDate = quarterData.dates[Math.floor(Math.random() * quarterData.dates.length)];

          data.push({
            id: `rating-${idCounter++}`,
            skill,
            currentRating: Math.max(1, Math.min(5, +currentRating.toFixed(1))),
            targetRating: Math.max(1, Math.min(5, +targetRating.toFixed(1))),
            date: randomDate,
            contentType: contentTypes[0],
            provider: providers[0],
            skills: [skill],
            groups: [group],
            roles: [role],
            customAttribute: customAttributes
          });
        }
      });
    });
  });

  // Then add some additional data for all skill-role combinations (reduced volume)
  FILTER_OPTIONS.skills.forEach(skill => {
    FILTER_OPTIONS.roles.forEach(role => {
      // Skip if this is already a priority skill for this role
      const rolePriorities = roleSkillPriorities[role as keyof typeof roleSkillPriorities];
      if (rolePriorities && rolePriorities.includes(skill)) {
        return; // Already generated above
      }
      
      // Generate fewer entries for non-priority skills
      FILTER_OPTIONS.groups.slice(0, 3).forEach(group => { // Only first 3 groups to reduce volume
        const entriesCount = getRandomInRange(1, 2);
        
        for (let i = 0; i < entriesCount; i++) {
          const contentTypes = getRandomElements(FILTER_OPTIONS.contentTypes, 1, 1);
          const providers = getRandomElements(FILTER_OPTIONS.providers, 1, 1);
          const customAttributes = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 2);
          
          // Generate realistic ratings with smaller gaps for non-priority skills
          const currentRating = getRoleSkillBaseline(role, skill) + getRandomFloat(-0.3, 0.3);
          const targetRating = Math.min(5, currentRating + getRandomFloat(0.2, 0.8));
          
          // Random recent date
          const randomQuarter = Math.floor(Math.random() * 4) + 1;
          const quarterData = DATE_HIERARCHY.FY25[`Q${randomQuarter}` as keyof typeof DATE_HIERARCHY.FY25];
          const randomDate = quarterData.dates[Math.floor(Math.random() * quarterData.dates.length)];

          data.push({
            id: `rating-${idCounter++}`,
            skill,
            currentRating: Math.max(1, Math.min(5, +currentRating.toFixed(1))),
            targetRating: Math.max(1, Math.min(5, +targetRating.toFixed(1))),
            date: randomDate,
            contentType: contentTypes[0],
            provider: providers[0],
            skills: [skill],
            groups: [group],
            roles: [role],
            customAttribute: customAttributes
          });
        }
      });
    });
  });

  return data;
}

// Helper functions for realistic data generation
function getProviderMultiplier(provider: string): number {
  const multipliers: Record<string, number> = {
    "Udemy": 120,
    "Coursera": 100,
    "LinkedIn Learning": 110,
    "Pluralsight": 90,
    "Codecademy": 85,
    "Cloud Academy": 75,
    "edX": 95,
    "Skillsoft": 80
  };
  return multipliers[provider] || 100;
}

function getContentTypeMultiplier(contentType: string): number {
  const multipliers: Record<string, number> = {
    "Course": 1.2,
    "Article": 0.8,
    "Academy": 1.3,
    "Assessment": 0.6,
    "Book": 0.9,
    "Event": 0.5,
    "Podcast": 0.7,
    "Task": 0.4
  };
  return multipliers[contentType] || 1.0;
}

function getRoleMultiplier(role: string): number {
  const multipliers: Record<string, number> = {
    "Software Engineer": 1.3,
    "Senior Software Engineer": 1.5,
    "Tech Lead": 1.4,
    "Engineering Manager": 1.2,
    "Product Manager": 1.3,
    "Senior Product Manager": 1.4,
    "Data Scientist": 1.4,
    "Senior Data Scientist": 1.5,
    "Data Analyst": 1.2,
    "UX Designer": 1.1,
    "Senior UX Designer": 1.3,
    "Marketing Manager": 1.0,
    "Sales Manager": 0.9,
    "DevOps Engineer": 1.2,
    "QA Engineer": 1.1,
    "Business Analyst": 1.0,
    "Project Manager": 1.1,
    "Scrum Master": 1.0,
    "Director": 0.8,
    "VP Engineering": 0.7,
    "CTO": 0.6
  };
  return multipliers[role] || 1.0;
}

function getRoleSkillBaseline(role: string, skill: string): number {
  // Define skill affinity by role for realistic baselines
  const roleSkillMatrix: Record<string, Record<string, number>> = {
    "Software Engineer": {
      "Python Programming": 3.8,
      "Java": 4.0,
      "Cloud Computing": 3.6,
      "Data Analytics": 3.2,
      "Machine Learning": 2.8,
      "Leadership": 3.0,
      "Project Management": 3.2
    },
    "Senior Software Engineer": {
      "Python Programming": 4.2,
      "Java": 4.3,
      "Cloud Computing": 4.0,
      "Data Analytics": 3.5,
      "Machine Learning": 3.2,
      "Leadership": 3.5,
      "Project Management": 3.8
    },
    "Tech Lead": {
      "Python Programming": 4.0,
      "Java": 3.8,
      "Cloud Computing": 3.9,
      "Leadership": 4.1,
      "Project Management": 4.2,
      "Innovation": 3.7
    },
    "Engineering Manager": {
      "Leadership": 4.4,
      "Project Management": 4.2,
      "Python Programming": 3.5,
      "Innovation": 3.9,
      "Business Analysis": 3.7,
      "Data Visualization": 3.3
    },
    "Product Manager": {
      "Leadership": 4.1,
      "Project Management": 4.3,
      "Business Analysis": 4.0,
      "Data Visualization": 3.5,
      "Innovation": 3.8,
      "Business Intelligence": 3.6
    },
    "Senior Product Manager": {
      "Leadership": 4.4,
      "Project Management": 4.5,
      "Business Analysis": 4.2,
      "Innovation": 4.1,
      "Business Intelligence": 3.9,
      "Data Visualization": 3.8
    },
    "Data Scientist": {
      "Python Programming": 4.2,
      "Machine Learning": 4.0,
      "Data Analytics": 4.3,
      "Business Intelligence": 3.8,
      "Big Data Analysis": 4.1,
      "Leadership": 3.2,
      "Data Visualization": 4.0
    },
    "Senior Data Scientist": {
      "Python Programming": 4.5,
      "Machine Learning": 4.4,
      "Data Analytics": 4.5,
      "Business Intelligence": 4.2,
      "Big Data Analysis": 4.3,
      "Leadership": 3.8,
      "Data Visualization": 4.2
    },
    "Data Analyst": {
      "Data Analytics": 4.0,
      "Business Intelligence": 3.8,
      "Data Visualization": 3.9,
      "Python Programming": 3.2,
      "Big Data Analysis": 3.5,
      "Business Analysis": 3.6
    },
    "UX Designer": {
      "Innovation": 3.9,
      "Data Visualization": 3.7,
      "Leadership": 3.1,
      "Project Management": 3.4,
      "Business Analysis": 3.3
    },
    "Senior UX Designer": {
      "Innovation": 4.2,
      "Data Visualization": 4.0,
      "Leadership": 3.6,
      "Project Management": 3.8,
      "Business Analysis": 3.6
    },
    "Marketing Manager": {
      "Leadership": 3.9,
      "Project Management": 3.7,
      "Data Analytics": 3.4,
      "Business Intelligence": 3.5,
      "Innovation": 3.6,
      "Data Visualization": 3.2
    },
    "Sales Manager": {
      "Leadership": 4.0,
      "Business Analysis": 3.8,
      "Project Management": 3.6,
      "Data Analytics": 3.2,
      "Innovation": 3.4
    },
    "DevOps Engineer": {
      "Cloud Computing": 4.2,
      "Python Programming": 3.7,
      "Java": 3.5,
      "Leadership": 3.2,
      "Project Management": 3.4
    },
    "QA Engineer": {
      "Java": 3.6,
      "Python Programming": 3.4,
      "Project Management": 3.5,
      "Leadership": 3.0,
      "Cloud Computing": 3.2
    },
    "Business Analyst": {
      "Business Analysis": 4.2,
      "Data Analytics": 3.8,
      "Business Intelligence": 3.9,
      "Project Management": 3.7,
      "Data Visualization": 3.6,
      "Leadership": 3.3
    },
    "Project Manager": {
      "Project Management": 4.3,
      "Leadership": 3.9,
      "Business Analysis": 3.6,
      "Data Visualization": 3.3,
      "Innovation": 3.4
    },
    "Scrum Master": {
      "Project Management": 4.1,
      "Leadership": 3.8,
      "Business Analysis": 3.5,
      "Innovation": 3.6
    },
    "Director": {
      "Leadership": 4.6,
      "Project Management": 4.3,
      "Business Analysis": 4.0,
      "Innovation": 4.2,
      "Business Intelligence": 3.9,
      "Data Visualization": 3.7
    },
    "VP Engineering": {
      "Leadership": 4.7,
      "Project Management": 4.5,
      "Innovation": 4.4,
      "Business Analysis": 4.1,
      "Python Programming": 3.6,
      "Cloud Computing": 3.8
    },
    "CTO": {
      "Leadership": 4.8,
      "Innovation": 4.6,
      "Project Management": 4.4,
      "Cloud Computing": 4.0,
      "Business Analysis": 4.2,
      "Python Programming": 3.7
    }
  };

  return roleSkillMatrix[role]?.[skill] || getRandomFloat(2.5, 3.8);
}

// Aggregation helper functions
export function aggregateDataByPeriod<T extends { date: string }>(
  data: T[],
  aggregationLevel: 'month' | 'quarter' | 'year'
): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};

  data.forEach(item => {
    const date = new Date(item.date);
    let key: string;

    switch (aggregationLevel) {
      case 'month':
        key = format(date, 'yyyy-MM');
        break;
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
      default:
        key = item.date;
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
}

// Generate comprehensive datasets - Force regeneration with updated baselines
export const comprehensiveLearningData = generateComprehensiveLearningData().map(item => ({
  ...item,
  rating: Math.floor(Math.random() * 5) + 1, // 1-5 star rating
  region: ['North America (NA)', 'Europe, Middle East & Africa (EMEA)', 'Asia-Pacific (APAC)'][Math.floor(Math.random() * 3)]
}));

export const comprehensiveSkillRatings = generateSkillRatingData().map(rating => ({
  ...rating,
  rating: Math.floor(Math.random() * 5) + 1, // 1-5 star rating  
  region: ['North America (NA)', 'Europe, Middle East & Africa (EMEA)', 'Asia-Pacific (APAC)'][Math.floor(Math.random() * 3)]
}));

console.log('🚀 Updated Mock Data Generated:', {
  learningDataCount: comprehensiveLearningData.length,
  skillRatingsCount: comprehensiveSkillRatings.length,
  sampleLearningItem: comprehensiveLearningData[0],
  sampleSkillRating: comprehensiveSkillRatings[0],
  uniqueRoles: [...new Set(comprehensiveLearningData.flatMap(item => item.roles))],
  skillRatingSample: comprehensiveSkillRatings.slice(0, 5).map(r => ({
    role: r.roles[0], 
    skill: r.skill, 
    current: r.currentRating, 
    target: r.targetRating,
    gap: r.targetRating - r.currentRating
  }))
});

// Export aggregated views for dashboard consumption
export const learningDataByMonth = aggregateDataByPeriod(comprehensiveLearningData, 'month');
export const learningDataByQuarter = aggregateDataByPeriod(comprehensiveLearningData, 'quarter');
export const learningDataByYear = aggregateDataByPeriod(comprehensiveLearningData, 'year');

// Trending topics with comprehensive filter coverage
export function generateTrendingTopicsData(): Array<{
  id: string;
  topic: string;
  learners: number;
  growth: number;
  date: string;
  contentType: string;
  provider: string;
  skills: string[];
  groups: string[];
  roles: string[];
  customAttribute: string[];
}> {
  const topics = [
    "Artificial Intelligence", "Machine Learning", "Cloud Computing", "Data Science",
    "Cybersecurity", "Agile Methodology", "DevOps", "Blockchain", "IoT", "Digital Marketing",
    "Product Management", "Leadership Development", "Project Management", "UX Design"
  ];

  const data: any[] = [];
  let idCounter = 1;

  topics.forEach(topic => {
    // Generate multiple entries per topic with different filter combinations
    const entriesCount = getRandomInRange(3, 6);
    
    for (let i = 0; i < entriesCount; i++) {
      const skills = getRandomElements(FILTER_OPTIONS.skills, 1, 2);
      const groups = getRandomElements(FILTER_OPTIONS.groups, 1, 3);
      const roles = getRandomElements(FILTER_OPTIONS.roles, 1, 4);
      const contentTypes = getRandomElements(FILTER_OPTIONS.contentTypes, 1, 1);
      const providers = getRandomElements(FILTER_OPTIONS.providers, 1, 1);
      const customAttributes = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 2);
      
      // Random recent date
      const allDates = Object.values(DATE_HIERARCHY.FY25).flatMap(q => q.dates);
      const randomDate = allDates[Math.floor(Math.random() * allDates.length)];
      
      data.push({
        id: `topic-${idCounter++}`,
        topic,
        learners: getRandomInRange(500, 2500),
        growth: getRandomInRange(15, 200),
        date: randomDate,
        contentType: contentTypes[0],
        provider: providers[0],
        skills,
        groups,
        roles,
        customAttribute: customAttributes
      });
    }
  });

  return data;
}

export const comprehensiveTrendingTopics = generateTrendingTopicsData();
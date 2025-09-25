// Comprehensive Mock Data Generator with Full Filter Coverage
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
      
      // Generate weekly data points for the month
      for (let week = 0; week < 4; week++) {
        const weekDate = format(addDays(monthStart, week * 7), 'yyyy-MM-dd');
        
        // Ensure data for every filter combination
        FILTER_OPTIONS.contentTypes.forEach(contentType => {
          FILTER_OPTIONS.providers.forEach(provider => {
            // Generate 2-3 entries per content type + provider combination
            const entriesCount = getRandomInRange(2, 3);
            
            for (let i = 0; i < entriesCount; i++) {
              const skills = getRandomElements(FILTER_OPTIONS.skills, 1, 3);
              const groups = getRandomElements(FILTER_OPTIONS.groups, 1, 2);
              const roles = getRandomElements(FILTER_OPTIONS.roles, 1, 3);
              const customAttribute = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 2);
              
              // Generate realistic metrics based on content type and provider
              const baseLearners = getProviderMultiplier(provider) * getContentTypeMultiplier(contentType);
              const learners = Math.max(10, getRandomInRange(baseLearners * 0.8, baseLearners * 1.2));
              const completions = Math.floor(learners * getRandomFloat(0.6, 0.95));
              const hours = Math.max(50, Math.floor(learners * getRandomFloat(3, 12)));
              const engagementRate = getRandomFloat(35, 90);
              const avgRating = getRandomFloat(3.5, 4.8);
              const activeUsers = Math.floor(learners * getRandomFloat(0.7, 0.95));

              data.push({
                id: `comprehensive-${idCounter++}`,
                date: weekDate,
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
          });
        });
      }
    });
  });

  return data;
}

// Generate skill rating data for all combinations
export function generateSkillRatingData(): SkillRatingItem[] {
  const data: SkillRatingItem[] = [];
  let idCounter = 1;

  // Generate ratings for each skill across different contexts
  FILTER_OPTIONS.skills.forEach(skill => {
    FILTER_OPTIONS.roles.forEach(role => {
      FILTER_OPTIONS.groups.forEach(group => {
        // Generate multiple rating entries for this combination
        const entriesCount = getRandomInRange(2, 4);
        
        for (let i = 0; i < entriesCount; i++) {
          const contentTypes = getRandomElements(FILTER_OPTIONS.contentTypes, 1, 2);
          const providers = getRandomElements(FILTER_OPTIONS.providers, 1, 2);
          const customAttributes = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 2);
          
          // Generate realistic ratings based on role and skill
          const currentRating = getRoleSkillBaseline(role, skill) + getRandomFloat(-0.5, 0.5);
          const targetRating = Math.min(5, currentRating + getRandomFloat(0.3, 1.2));
          
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
    "Video": 1.1,
    "Assessment": 0.6,
    "Podcast": 0.7,
    "Book": 0.9,
    "Event": 0.5,
    "Academy": 1.3,
    "Task": 0.4
  };
  return multipliers[contentType] || 1.0;
}

function getRoleSkillBaseline(role: string, skill: string): number {
  // Define skill affinity by role for realistic baselines
  const roleSkillMatrix: Record<string, Record<string, number>> = {
    "Data Scientist": {
      "Python Programming": 4.2,
      "Machine Learning": 4.0,
      "Data Analytics": 4.3,
      "Business Intelligence": 3.8,
      "Leadership": 3.2
    },
    "Software Engineer": {
      "Python Programming": 3.8,
      "Java": 4.0,
      "Cloud Computing": 3.6,
      "Leadership": 3.0,
      "Project Management": 3.2
    },
    "Product Manager": {
      "Leadership": 4.1,
      "Project Management": 4.3,
      "Business Analysis": 4.0,
      "Data Visualization": 3.5,
      "Innovation": 3.8
    },
    "Engineering Manager": {
      "Leadership": 4.4,
      "Project Management": 4.2,
      "Python Programming": 3.5,
      "Innovation": 3.9,
      "Business Analysis": 3.7
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

// Generate comprehensive datasets
export const comprehensiveLearningData = generateComprehensiveLearningData();
export const comprehensiveSkillRatings = generateSkillRatingData();

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
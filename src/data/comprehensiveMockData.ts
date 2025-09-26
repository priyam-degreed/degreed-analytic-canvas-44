import { addDays, format, endOfMonth } from 'date-fns';

// Comprehensive filter options - matches FilterBar exactly
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
    "Developer", "SDET", "Product Manager", "Data Scientist", "Designer",
    "Marketing Specialist", "Sales Representative", "DevOps Engineer", 
    "Business Analyst", "Project Manager", "Technical Lead", "Engineering Manager"
  ],
  customAttributes: [
    "Budget", "Completion Status", "Compliance", "Learning Hours", "Onboarding", "Skill Proficiency"
  ],
  regions: [
    "North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"
  ],
  ratings: [1, 2, 3, 4, 5]
};

// FY25 date hierarchy for systematic data generation
export const DATE_HIERARCHY = {
  FY25: {
    Q1: {
      name: "Q1 FY25",
      dateRange: { start: "2024-04-01", end: "2024-06-30" },
      months: {
        "2024-04": { start: "2024-04-01", end: "2024-04-30" },
        "2024-05": { start: "2024-05-01", end: "2024-05-31" },
        "2024-06": { start: "2024-06-01", end: "2024-06-30" }
      }
    },
    Q2: {
      name: "Q2 FY25",
      dateRange: { start: "2024-07-01", end: "2024-09-30" },
      months: {
        "2024-07": { start: "2024-07-01", end: "2024-07-31" },
        "2024-08": { start: "2024-08-01", end: "2024-08-31" },
        "2024-09": { start: "2024-09-01", end: "2024-09-30" }
      }
    },
    Q3: {
      name: "Q3 FY25",
      dateRange: { start: "2024-10-01", end: "2024-12-31" },
      months: {
        "2024-10": { start: "2024-10-01", end: "2024-10-31" },
        "2024-11": { start: "2024-11-01", end: "2024-11-30" },
        "2024-12": { start: "2024-12-01", end: "2024-12-31" }
      }
    },
    Q4: {
      name: "Q4 FY25",
      dateRange: { start: "2025-01-01", end: "2025-03-31" },
      months: {
        "2025-01": { start: "2025-01-01", end: "2025-01-31" },
        "2025-02": { start: "2025-02-01", end: "2025-02-28" },
        "2025-03": { start: "2025-03-01", end: "2025-03-31" }
      }
    }
  }
};

// Data structures
export interface ComprehensiveLearningItem {
  id: string;
  date: string;
  contentType: string;
  provider: string;
  skills: string[];
  groups: string[];
  roles: string[];
  customAttribute: string[];
  learners: number;
  completions: number;
  hours: number;
  engagementRate: number;
  avgRating: number;
  activeUsers: number;
}

export interface SkillRatingItem {
  id: string;
  skill: string;
  currentRating: number;
  targetRating: number;
  date: string;
  contentType: string;
  provider: string;
  skills: string[];
  groups: string[];
  roles: string[];
  customAttribute: string[];
}

// Helper functions
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

function getProviderMultiplier(provider: string): number {
  const multipliers: Record<string, number> = {
    "LinkedIn Learning": 1.3,
    "Coursera": 1.2,
    "Pluralsight": 1.1,
    "Udemy": 1.0,
    "edX": 0.9,
    "Skillsoft": 0.8,
    "Cloud Academy": 0.7,
    "Codecademy": 0.6
  };
  return multipliers[provider] || 1.0;
}

function getContentTypeMultiplier(contentType: string): number {
  const multipliers: Record<string, number> = {
    "Course": 1.3,
    "Academy": 1.2,
    "Article": 1.1,
    "Assessment": 1.0,
    "Event": 0.9,
    "Book": 0.8,
    "Podcast": 0.7,
    "Task": 0.6
  };
  return multipliers[contentType] || 1.0;
}

// COMPREHENSIVE DATA GENERATION - Ensures every filter combination has results
export function generateComprehensiveLearningData(): ComprehensiveLearningItem[] {
  const data: ComprehensiveLearningItem[] = [];
  let idCounter = 1;

  // Generate systematic data for every filter combination
  Object.values(DATE_HIERARCHY.FY25).forEach(quarter => {
    Object.keys(quarter.months).forEach(monthKey => {
      const monthStart = new Date(`${monthKey}-01`);
      
      // Generate 4 weekly data points per month
      for (let week = 0; week < 4; week++) {
        const weekDate = format(addDays(monthStart, week * 7), 'yyyy-MM-dd');
        
        // MATRIX APPROACH: Ensure every combination has data
        // Primary combinations: Each role x contentType x provider
        FILTER_OPTIONS.roles.forEach(role => {
          FILTER_OPTIONS.contentTypes.forEach(contentType => {
            FILTER_OPTIONS.providers.forEach(provider => {
              // Generate 1-2 skill combinations per primary combination
              const skillSets = [
                getRandomElements(FILTER_OPTIONS.skills, 1, 2),
                getRandomElements(FILTER_OPTIONS.skills, 2, 3)
              ];
              
              skillSets.forEach(skills => {
                const groups = getRandomElements(FILTER_OPTIONS.groups, 1, 2);
                const customAttribute = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 2);
                
                // Calculate metrics with proper distribution
                const baseMultiplier = getProviderMultiplier(provider) * getContentTypeMultiplier(contentType);
                const learners = Math.max(1, Math.round(getRandomInRange(2, 15) * baseMultiplier));
                const completions = Math.max(1, Math.round(learners * getRandomFloat(0.6, 0.9)));
                const hours = Math.max(1, Math.round(learners * getRandomFloat(2, 12)));
                const activeUsers = Math.max(1, Math.round(learners * getRandomFloat(0.7, 1.0)));

                data.push({
                  id: `learning-${idCounter++}`,
                  date: weekDate,
                  contentType,
                  provider,
                  skills,
                  groups,
                  roles: [role],
                  customAttribute,
                  learners,
                  completions,
                  hours,
                  engagementRate: getRandomFloat(65, 95, 1),
                  avgRating: getRandomFloat(3.0, 5.0, 1),
                  activeUsers
                });
              });
            });
          });
        });

        // Secondary combinations: Multiple roles for popular combinations
        const multiRoleCombinations = [
          ["Product Manager", "Data Scientist"],
          ["Developer", "DevOps Engineer"],
          ["Business Analyst", "Project Manager"],
          ["Designer", "Technical Lead"]
        ];

        multiRoleCombinations.forEach(roles => {
          // Limit to top content types and providers for multi-role to prevent explosion
          FILTER_OPTIONS.contentTypes.slice(0, 4).forEach(contentType => {
            FILTER_OPTIONS.providers.slice(0, 4).forEach(provider => {
              const skills = getRandomElements(FILTER_OPTIONS.skills, 2, 4);
              const groups = getRandomElements(FILTER_OPTIONS.groups, 1, 3);
              const customAttribute = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 3);
              
              const baseMultiplier = getProviderMultiplier(provider) * getContentTypeMultiplier(contentType) * 1.5; // Boost for multi-role
              const learners = Math.max(5, Math.round(getRandomInRange(8, 25) * baseMultiplier));
              const completions = Math.max(3, Math.round(learners * getRandomFloat(0.7, 0.95)));
              const hours = Math.max(10, Math.round(learners * getRandomFloat(4, 20)));
              const activeUsers = Math.max(4, Math.round(learners * getRandomFloat(0.8, 1.1)));

              data.push({
                id: `learning-multi-${idCounter++}`,
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
                engagementRate: getRandomFloat(70, 95, 1),
                avgRating: getRandomFloat(3.5, 5.0, 1),
                activeUsers
              });
            });
          });
        });
      }
    });
  });

  return data;
}

// Enhanced Skill Rating Data Generation
export function generateSkillRatingData(): SkillRatingItem[] {
  const data: SkillRatingItem[] = [];
  let idCounter = 1;

  // Ensure every skill-role combination has data
  FILTER_OPTIONS.skills.forEach(skill => {
    FILTER_OPTIONS.roles.forEach(role => {
      // Generate entries across different time periods
      const dates = ["2024-04-01", "2024-07-01", "2024-10-01", "2025-01-01"];
      
      dates.forEach(date => {
        const contentType = FILTER_OPTIONS.contentTypes[Math.floor(Math.random() * FILTER_OPTIONS.contentTypes.length)];
        const provider = FILTER_OPTIONS.providers[Math.floor(Math.random() * FILTER_OPTIONS.providers.length)];
        const groups = getRandomElements(FILTER_OPTIONS.groups, 1, 2);
        const customAttribute = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 2);
        
        // Generate realistic skill ratings based on role-skill affinity
        const currentRating = getRandomFloat(2.0, 4.5, 1);
        const targetRating = Math.min(5.0, currentRating + getRandomFloat(0.5, 1.5, 1));

        data.push({
          id: `skill-${idCounter++}`,
          skill,
          currentRating,
          targetRating,
          date,
          contentType,
          provider,
          skills: [skill],
          groups,
          roles: [role],
          customAttribute
        });
      });
    });
  });

  return data;
}

// Comprehensive trending topics data
export function generateTrendingTopicsData() {
  const data: any[] = [];
  let idCounter = 1;

  // Ensure every skill has trending topic data across all filter dimensions
  FILTER_OPTIONS.skills.forEach(skill => {
    FILTER_OPTIONS.roles.forEach(role => {
      FILTER_OPTIONS.groups.forEach(group => {
        const provider = FILTER_OPTIONS.providers[Math.floor(Math.random() * FILTER_OPTIONS.providers.length)];
        const contentType = FILTER_OPTIONS.contentTypes[Math.floor(Math.random() * FILTER_OPTIONS.contentTypes.length)];
        const customAttribute = getRandomElements(FILTER_OPTIONS.customAttributes, 1, 2);

        data.push({
          id: `trending-${idCounter++}`,
          topic: skill,
          learners: Math.max(5, getRandomInRange(15, 150)),
          growth: getRandomInRange(-10, 80),
          date: "2024-09-15",
          skills: [skill],
          groups: [group],
          roles: [role],
          provider,
          contentType,
          customAttribute,
          rating: getRandomInRange(3, 5),
          region: FILTER_OPTIONS.regions[Math.floor(Math.random() * FILTER_OPTIONS.regions.length)]
        });
      });
    });
  });

  return data;
}

// Data aggregation utility
export function aggregateDataByPeriod<T extends { date: string }>(
  data: T[],
  aggregationLevel: 'month' | 'quarter' | 'year'
): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};

  data.forEach(item => {
    let key: string;
    const date = new Date(item.date);
    
    switch (aggregationLevel) {
      case 'month':
        key = format(date, 'yyyy-MM');
        break;
      case 'quarter':
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        key = `${date.getFullYear()}-Q${quarter}`;
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
}

// Generate comprehensive datasets with regional and rating data
export const comprehensiveLearningData = generateComprehensiveLearningData().map(item => ({
  ...item,
  rating: Math.floor(item.avgRating), // Add rating for filtering (1-5)
  region: FILTER_OPTIONS.regions[Math.floor(Math.random() * FILTER_OPTIONS.regions.length)]
}));

export const comprehensiveSkillRatings = generateSkillRatingData().map(item => ({
  ...item,
  rating: Math.floor(item.currentRating), // Add rating for filtering (1-5)
  region: FILTER_OPTIONS.regions[Math.floor(Math.random() * FILTER_OPTIONS.regions.length)]
}));

// Generate comprehensive trending topics
export const comprehensiveTrendingTopics = generateTrendingTopicsData();

console.log('🚀 Comprehensive Mock Data Generated:', {
  learningDataCount: comprehensiveLearningData.length,
  skillRatingsCount: comprehensiveSkillRatings.length,
  trendingTopicsCount: comprehensiveTrendingTopics.length,
  sampleLearningItem: comprehensiveLearningData[0],
  filterCoverage: {
    roles: FILTER_OPTIONS.roles.length,
    contentTypes: FILTER_OPTIONS.contentTypes.length,
    providers: FILTER_OPTIONS.providers.length,
    skills: FILTER_OPTIONS.skills.length,
    groups: FILTER_OPTIONS.groups.length,
    customAttributes: FILTER_OPTIONS.customAttributes.length,
    regions: FILTER_OPTIONS.regions.length
  }
});

// Export aggregated views for dashboard consumption
export const learningDataByMonth = aggregateDataByPeriod(comprehensiveLearningData, 'month');
export const learningDataByQuarter = aggregateDataByPeriod(comprehensiveLearningData, 'quarter');
export const learningDataByYear = aggregateDataByPeriod(comprehensiveLearningData, 'year');
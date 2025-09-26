import { FilterableDataItem } from '@/hooks/useFilteredData';
import { format, addDays } from 'date-fns';

// Enhanced filter options for Skills Dashboard
export const SKILLS_DASHBOARD_OPTIONS = {
  periods: [
    'FY24', 'FY25', 'Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25',
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  roles: [
    'Data Scientist', 'Product Manager', 'Learning Designer', 'Sales Associate', 'HR Specialist',
    'Software Engineer', 'Marketing Manager', 'Business Analyst', 'UX Designer', 'DevOps Engineer'
  ],
  groups: [
    'Sales', 'Engineering', 'Product', 'HR', 'L&D', 'Marketing', 'Data Science', 'Design', 'Operations'
  ],
  providers: [
    'Udemy', 'Coursera', 'Pluralsight', 'LinkedIn Learning', 'Codecademy', 'edX', 'Skillsoft'
  ],
  contentTypes: [
    'Course', 'Article', 'Assessment', 'Event', 'Podcast', 'Book'
  ],
  skills: [
    'Python', 'SQL', 'Leadership', 'Project Management', 'Data Visualization', 'Cloud Computing',
    'Machine Learning', 'Business Analysis', 'Innovation', 'Communication', 'Java', 'React'
  ],
  ratings: [1, 2, 3, 4, 5],
  regions: ['NA', 'EMEA', 'APAC'],
  employmentTypes: ['Full-time', 'Contractor']
};

// Skills Dashboard specific data interfaces
export interface SkillEngagementData extends FilterableDataItem {
  id: string;
  date: string;
  userId: string;
  hasSkillPlan: boolean;
  followedSkillsCount: number;
  hasFocusSkills: boolean;
  focusSkillsCount: number;
  roles: string[];
  groups: string[];
  provider: string;
  contentType: string;
  skills: string[];
  rating: number;
  region: string;
  customAttribute: string[];
}

export interface SkillRatingData extends FilterableDataItem {
  id: string;
  date: string;
  skill: string;
  userId: string;
  selfRating: number;
  peerRating: number;
  managerRating: number;
  isEndorsedSkill: boolean;
  isFocusSkill: boolean;
  roles: string[];  
  groups: string[];
  provider: string;
  contentType: string;
  skills: string[];
  rating: number;
  region: string;
  customAttribute: string[];
}

// Generate user engagement data
export function generateSkillEngagementData(): SkillEngagementData[] {
  const data: SkillEngagementData[] = [];
  let idCounter = 1;

  // Generate 15,000 users for realistic scale
  const totalUsers = 15000;
  
  for (let userId = 1; userId <= totalUsers; userId++) {
    const roles = [SKILLS_DASHBOARD_OPTIONS.roles[Math.floor(Math.random() * SKILLS_DASHBOARD_OPTIONS.roles.length)]];
    const groups = [SKILLS_DASHBOARD_OPTIONS.groups[Math.floor(Math.random() * SKILLS_DASHBOARD_OPTIONS.groups.length)]];
    const provider = SKILLS_DASHBOARD_OPTIONS.providers[Math.floor(Math.random() * SKILLS_DASHBOARD_OPTIONS.providers.length)];
    const contentType = SKILLS_DASHBOARD_OPTIONS.contentTypes[Math.floor(Math.random() * SKILLS_DASHBOARD_OPTIONS.contentTypes.length)];
    const region = SKILLS_DASHBOARD_OPTIONS.regions[Math.floor(Math.random() * SKILLS_DASHBOARD_OPTIONS.regions.length)];
    const customAttribute = ['Skill Proficiency'];
    
    // 37% of users follow skill plans (as per requirement)
    const hasSkillPlan = Math.random() < 0.37;
    const followedSkillsCount = hasSkillPlan ? Math.floor(Math.random() * 4) + 1 : 0; // 1-4 skills if following
    
    // Focus skills (much smaller subset)
    const hasFocusSkills = hasSkillPlan && Math.random() < 0.23; // ~23% of those with skill plans have focus
    const focusSkillsCount = hasFocusSkills ? Math.floor(Math.random() * 2) + 1 : 0; // 1-2 focus skills
    
    const skills = getRandomSkills(Math.max(followedSkillsCount, 1));
    const rating = Math.floor(Math.random() * 5) + 1;
    
    // Generate entries across different time periods
    const monthsToGenerate = Math.floor(Math.random() * 3) + 1; // 1-3 months per user
    for (let month = 0; month < monthsToGenerate; month++) {
      const date = format(addDays(new Date('2024-04-01'), Math.floor(Math.random() * 365)), 'yyyy-MM-dd');
      
      data.push({
        id: `engagement-${idCounter++}`,
        date,
        userId: `user-${userId}`,
        hasSkillPlan,
        followedSkillsCount,
        hasFocusSkills,
        focusSkillsCount,
        roles,
        groups,
        provider,
        contentType,
        skills,
        rating,
        region,
        customAttribute
      });
    }
  }

  return data;
}

// Generate skill rating data
export function generateSkillRatingData(): SkillRatingData[] {
  const data: SkillRatingData[] = [];
  let idCounter = 1;

  // Generate ratings for all skills across users
  SKILLS_DASHBOARD_OPTIONS.skills.forEach(skill => {
    // Generate 800-1200 ratings per skill for good coverage
    const ratingsCount = Math.floor(Math.random() * 400) + 800;
    
    for (let i = 0; i < ratingsCount; i++) {
      const roles = [SKILLS_DASHBOARD_OPTIONS.roles[Math.floor(Math.random() * SKILLS_DASHBOARD_OPTIONS.roles.length)]];
      const groups = [SKILLS_DASHBOARD_OPTIONS.groups[Math.floor(Math.random() * SKILLS_DASHBOARD_OPTIONS.groups.length)]];
      const provider = SKILLS_DASHBOARD_OPTIONS.providers[Math.floor(Math.random() * SKILLS_DASHBOARD_OPTIONS.providers.length)];
      const contentType = SKILLS_DASHBOARD_OPTIONS.contentTypes[Math.floor(Math.random() * SKILLS_DASHBOARD_OPTIONS.contentTypes.length)];
      const region = SKILLS_DASHBOARD_OPTIONS.regions[Math.floor(Math.random() * SKILLS_DASHBOARD_OPTIONS.regions.length)];
      const customAttribute = ['Skill Proficiency'];
      
      // Generate correlated ratings with some variance
      const baseSelfRating = Math.random() * 2 + 2.5; // 2.5-4.5 base
      const selfRating = Math.min(5, Math.max(1, baseSelfRating + (Math.random() - 0.5) * 0.8));
      
      // Peer ratings tend to be slightly lower than self
      const peerRating = Math.min(5, Math.max(1, selfRating - 0.2 + (Math.random() - 0.5) * 0.6));
      
      // Manager ratings can be higher (as mentioned in requirements)
      const managerRating = Math.min(5, Math.max(1, selfRating + 0.5 + (Math.random() - 0.5) * 1.2));
      
      // 43% are endorsed skills (12.2K out of 28.3K total)
      const isEndorsedSkill = Math.random() < 0.43;
      
      // Focus skills are much rarer (816 total, ~35% are endorsed = 291)
      const isFocusSkill = Math.random() < 0.05; // 5% are focus skills
      
      const date = format(addDays(new Date('2024-04-01'), Math.floor(Math.random() * 365)), 'yyyy-MM-dd');
      const rating = Math.floor(selfRating);
      
      data.push({
        id: `rating-${idCounter++}`,
        date,
        skill,
        userId: `user-${Math.floor(Math.random() * 15000) + 1}`,
        selfRating: +selfRating.toFixed(2),
        peerRating: +peerRating.toFixed(2),
        managerRating: +managerRating.toFixed(2),
        isEndorsedSkill,
        isFocusSkill,
        roles,
        groups,
        provider,
        contentType,
        skills: [skill],
        rating,
        region,
        customAttribute
      });
    }
  });

  return data;
}

// Helper functions
function getRandomSkills(count: number): string[] {
  const shuffled = [...SKILLS_DASHBOARD_OPTIONS.skills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, SKILLS_DASHBOARD_OPTIONS.skills.length));
}

// Generate the mock data
export const skillEngagementData = generateSkillEngagementData();
export const skillRatingData = generateSkillRatingData();

// Pre-calculated metrics for KPIs
export const skillsDashboardMetrics = {
  totalUsers: 14400,
  usersWithSkillPlans: 1310,
  skillPlanPercentage: 37.0,
  skillPlanTrend: 33.8,
  averageSkillsPerUser: 1.96,
  skillsPerUserTrend: -1.03,
  usersWithFocusSkills: 302,
  totalFollowedSkills: 28300,
  endorsedSkills: 12200,
  totalFocusSkills: 816,
  endorsedFocusSkills: 291,
  avgSelfRatingEndorsed: 3.88,
  avgSelfRatingFocus: 3.94,
  avgSelfRating: 3.92,
  avgPeerRating: 3.83,
  avgManagerRating: 5.06,
  medianPeerRating: 4.0,
  medianSelfRating: 4.0
};
// Mock employee data for learning dashboard drill-downs
export interface LearningEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  completions: number;
  learningHours: number;
  lastActivity: string;
  engagementScore: number;
  skills: string[];
  region: string;
}

// Generate comprehensive learning employee data
export const learningEmployees: LearningEmployee[] = [
  // High engagement employees (active learners)
  { id: '1', name: 'Sarah Chen', role: 'Software Engineer', department: 'Engineering', completions: 12, learningHours: 45, lastActivity: '2024-01-15', engagementScore: 95, skills: ['JavaScript', 'React', 'Python'], region: 'North America' },
  { id: '2', name: 'Michael Torres', role: 'Data Scientist', department: 'Analytics', completions: 15, learningHours: 52, lastActivity: '2024-01-14', engagementScore: 92, skills: ['Python', 'Machine Learning', 'SQL'], region: 'Europe' },
  { id: '3', name: 'Elena Rodriguez', role: 'Product Manager', department: 'Product', completions: 8, learningHours: 38, lastActivity: '2024-01-13', engagementScore: 88, skills: ['Product Strategy', 'Analytics', 'Leadership'], region: 'South America' },
  { id: '4', name: 'David Kim', role: 'UX Designer', department: 'Design', completions: 10, learningHours: 42, lastActivity: '2024-01-12', engagementScore: 90, skills: ['Figma', 'User Research', 'Prototyping'], region: 'Asia Pacific' },
  { id: '5', name: 'Jessica Wang', role: 'DevOps Engineer', department: 'Engineering', completions: 13, learningHours: 48, lastActivity: '2024-01-11', engagementScore: 94, skills: ['AWS', 'Docker', 'Kubernetes'], region: 'North America' },
  
  // Medium engagement employees
  { id: '6', name: 'Alex Johnson', role: 'Business Analyst', department: 'Operations', completions: 6, learningHours: 28, lastActivity: '2024-01-10', engagementScore: 75, skills: ['Excel', 'Tableau', 'SQL'], region: 'Europe' },
  { id: '7', name: 'Maria Gonzalez', role: 'Marketing Manager', department: 'Marketing', completions: 7, learningHours: 32, lastActivity: '2024-01-09', engagementScore: 78, skills: ['Digital Marketing', 'Analytics', 'Content Strategy'], region: 'South America' },
  { id: '8', name: 'Robert Lee', role: 'Sales Representative', department: 'Sales', completions: 5, learningHours: 24, lastActivity: '2024-01-08', engagementScore: 70, skills: ['Salesforce', 'Negotiation', 'Communication'], region: 'Asia Pacific' },
  { id: '9', name: 'Jennifer Brown', role: 'HR Specialist', department: 'Human Resources', completions: 6, learningHours: 26, lastActivity: '2024-01-07', engagementScore: 72, skills: ['Recruitment', 'Performance Management', 'Employee Relations'], region: 'North America' },
  { id: '10', name: 'Thomas Wilson', role: 'Financial Analyst', department: 'Finance', completions: 4, learningHours: 22, lastActivity: '2024-01-06', engagementScore: 68, skills: ['Financial Modeling', 'Excel', 'Power BI'], region: 'Europe' },
  
  // Low engagement but recent activity
  { id: '11', name: 'Lisa Zhang', role: 'Quality Assurance', department: 'Engineering', completions: 3, learningHours: 18, lastActivity: '2024-01-05', engagementScore: 60, skills: ['Testing', 'Automation', 'Quality Assurance'], region: 'Asia Pacific' },
  { id: '12', name: 'Carlos Martinez', role: 'Support Specialist', department: 'Customer Support', completions: 2, learningHours: 15, lastActivity: '2024-01-04', engagementScore: 55, skills: ['Customer Service', 'Troubleshooting', 'Communication'], region: 'South America' },
  
  // Various other employees for comprehensive coverage
  { id: '13', name: 'Amanda Taylor', role: 'Scrum Master', department: 'Engineering', completions: 9, learningHours: 36, lastActivity: '2024-01-15', engagementScore: 85, skills: ['Agile', 'Scrum', 'Leadership'], region: 'North America' },
  { id: '14', name: 'James Anderson', role: 'Solutions Architect', department: 'Engineering', completions: 11, learningHours: 44, lastActivity: '2024-01-14', engagementScore: 89, skills: ['System Design', 'AWS', 'Microservices'], region: 'Europe' },
  { id: '15', name: 'Sophie Martin', role: 'Content Creator', department: 'Marketing', completions: 5, learningHours: 25, lastActivity: '2024-01-13', engagementScore: 73, skills: ['Content Writing', 'SEO', 'Social Media'], region: 'Europe' }
];

// Helper function to get drill-down data for learning metrics
export function getLearningDrillDownData(cardType: string): any {
  const baseData = {
    cardType,
    description: getCardDescription(cardType),
  };

  switch (cardType) {
    case 'Total Active Learners':
      return {
        ...baseData,
        employees: learningEmployees.length,
        ratingDistribution: {
          'High Engagement (80-100)': learningEmployees.filter(e => e.engagementScore >= 80).length,
          'Medium Engagement (60-79)': learningEmployees.filter(e => e.engagementScore >= 60 && e.engagementScore < 80).length,
          'Low Engagement (0-59)': learningEmployees.filter(e => e.engagementScore < 60).length,
        },
        departmentBreakdown: getDepartmentBreakdown(),
        regionBreakdown: getRegionBreakdown(),
      };

    case 'Active This Week':
      const recentlyActive = learningEmployees.filter(e => 
        new Date(e.lastActivity) >= new Date('2024-01-10')
      );
      return {
        ...baseData,
        employees: recentlyActive.length,
        ratingDistribution: {
          'Daily Active': recentlyActive.filter(e => new Date(e.lastActivity) >= new Date('2024-01-14')).length,
          'Weekly Active': recentlyActive.filter(e => 
            new Date(e.lastActivity) >= new Date('2024-01-10') && new Date(e.lastActivity) < new Date('2024-01-14')
          ).length,
        },
        topLearners: recentlyActive
          .sort((a, b) => b.completions - a.completions)
          .slice(0, 5)
          .reduce((acc, emp) => ({ ...acc, [emp.name]: emp.completions }), {}),
      };

    case 'Course Completions':
      const totalCompletions = learningEmployees.reduce((sum, e) => sum + e.completions, 0);
      return {
        ...baseData,
        employees: learningEmployees.filter(e => e.completions > 0).length,
        value: totalCompletions,
        ratingDistribution: {
          'High Completers (10+)': learningEmployees.filter(e => e.completions >= 10).length,
          'Medium Completers (5-9)': learningEmployees.filter(e => e.completions >= 5 && e.completions < 10).length,
          'Low Completers (1-4)': learningEmployees.filter(e => e.completions >= 1 && e.completions < 5).length,
        },
        topCompletions: learningEmployees
          .sort((a, b) => b.completions - a.completions)
          .slice(0, 5)
          .reduce((acc, emp) => ({ ...acc, [emp.name]: emp.completions }), {}),
      };

    case 'Learning Hours':
      const totalHours = learningEmployees.reduce((sum, e) => sum + e.learningHours, 0);
      return {
        ...baseData,
        employees: learningEmployees.filter(e => e.learningHours > 0).length,
        value: `${totalHours}h`,
        ratingDistribution: {
          'Heavy Learners (40+ hrs)': learningEmployees.filter(e => e.learningHours >= 40).length,
          'Regular Learners (20-39 hrs)': learningEmployees.filter(e => e.learningHours >= 20 && e.learningHours < 40).length,
          'Light Learners (1-19 hrs)': learningEmployees.filter(e => e.learningHours >= 1 && e.learningHours < 20).length,
        },
        avgHoursPerEmployee: Math.round(totalHours / learningEmployees.length * 10) / 10,
      };

    case 'Learning Completions':
      return {
        ...baseData,
        employees: learningEmployees.filter(e => e.completions > 0).length,
        value: learningEmployees.reduce((sum, e) => sum + e.completions, 0),
        ratingDistribution: {
          'This Month': Math.floor(learningEmployees.reduce((sum, e) => sum + e.completions, 0) * 0.3),
          'Last Month': Math.floor(learningEmployees.reduce((sum, e) => sum + e.completions, 0) * 0.25),
          'Previous Months': Math.floor(learningEmployees.reduce((sum, e) => sum + e.completions, 0) * 0.45),
        },
        monthlyTrend: '+87 vs last month',
      };

    case 'Learning Satisfaction':
      return {
        ...baseData,
        employees: learningEmployees.length,
        value: '89%',
        ratingDistribution: {
          'Highly Satisfied (4-5 stars)': Math.floor(learningEmployees.length * 0.89),
          'Satisfied (3 stars)': Math.floor(learningEmployees.length * 0.08),
          'Unsatisfied (1-2 stars)': Math.floor(learningEmployees.length * 0.03),
        },
        feedbackBreakdown: {
          'Positive Feedback': 234,
          'Neutral Feedback': 18,
          'Negative Feedback': 8,
        },
      };

    case 'Total Learning Hours':
      return {
        ...baseData,
        employees: learningEmployees.length,
        value: `${learningEmployees.reduce((sum, e) => sum + e.learningHours, 0)}h`,
        ratingDistribution: {
          'Skills Development': Math.floor(learningEmployees.reduce((sum, e) => sum + e.learningHours, 0) * 0.45),
          'Leadership Training': Math.floor(learningEmployees.reduce((sum, e) => sum + e.learningHours, 0) * 0.25),
          'Technical Training': Math.floor(learningEmployees.reduce((sum, e) => sum + e.learningHours, 0) * 0.30),
        },
        avgHoursPerEmployee: Math.round(learningEmployees.reduce((sum, e) => sum + e.learningHours, 0) / learningEmployees.length * 10) / 10,
      };

    case 'Most Active Skill':
      const skillCounts = learningEmployees.reduce((acc: Record<string, number>, emp) => {
        emp.skills.forEach(skill => {
          acc[skill] = (acc[skill] || 0) + 1;
        });
        return acc;
      }, {});
      const topSkill = Object.entries(skillCounts).sort(([,a], [,b]) => b - a)[0];
      
      return {
        ...baseData,
        employees: skillCounts[topSkill[0]] || 0,
        value: topSkill[0] || 'Unknown/General',
        ratingDistribution: Object.entries(skillCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .reduce((acc, [skill, count]) => ({ ...acc, [skill]: count }), {}),
        totalSkillHours: learningEmployees
          .filter(e => e.skills.includes(topSkill[0]))
          .reduce((sum, e) => sum + e.learningHours, 0),
      };

    default:
      return baseData;
  }
}

function getCardDescription(cardType: string): string {
  const descriptions: Record<string, string> = {
    'Total Active Learners': 'All employees who have engaged with learning content',
    'Active This Week': 'Employees who completed learning activities in the past 7 days',
    'Course Completions': 'Total number of courses completed across all learners',
    'Learning Hours': 'Cumulative hours spent on learning activities',
    'Learning Completions': 'Recent learning completion statistics with monthly comparison',
    'Learning Satisfaction': 'Overall satisfaction rating based on learner feedback',
    'Total Learning Hours': 'Total time invested in learning across all categories',
    'Most Active Skill': 'The skill category with highest learning engagement',
  };
  
  return descriptions[cardType] || 'Learning metric details';
}

function getDepartmentBreakdown(): Record<string, number> {
  return learningEmployees.reduce((acc: Record<string, number>, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
}

function getRegionBreakdown(): Record<string, number> {
  return learningEmployees.reduce((acc: Record<string, number>, emp) => {
    acc[emp.region] = (acc[emp.region] || 0) + 1;
    return acc;
  }, {});
}
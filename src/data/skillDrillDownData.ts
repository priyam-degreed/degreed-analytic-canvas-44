// Mock employee data for skills dashboard drill-downs
export interface SkillEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  skillsTracked: number;
  expertSkills: number;
  activeSkillPlans: number;
  skillsInDecay: number;
  lastSkillAssessment: string;
  skillRating: number;
  region: string;
  topSkills: string[];
}

// Generate comprehensive skill employee data
export const skillEmployees: SkillEmployee[] = [
  // High skill performers
  { id: '1', name: 'Sarah Chen', role: 'Software Engineer', department: 'Engineering', skillsTracked: 24, expertSkills: 8, activeSkillPlans: 3, skillsInDecay: 1, lastSkillAssessment: '2024-01-15', skillRating: 4.2, region: 'North America', topSkills: ['JavaScript', 'React', 'Python'] },
  { id: '2', name: 'Michael Torres', role: 'Data Scientist', department: 'Analytics', skillsTracked: 28, expertSkills: 12, activeSkillPlans: 4, skillsInDecay: 0, lastSkillAssessment: '2024-01-14', skillRating: 4.5, region: 'Europe', topSkills: ['Python', 'Machine Learning', 'SQL'] },
  { id: '3', name: 'Elena Rodriguez', role: 'Product Manager', department: 'Product', skillsTracked: 18, expertSkills: 6, activeSkillPlans: 2, skillsInDecay: 2, lastSkillAssessment: '2024-01-13', skillRating: 3.9, region: 'South America', topSkills: ['Product Strategy', 'Analytics', 'Leadership'] },
  { id: '4', name: 'David Kim', role: 'UX Designer', department: 'Design', skillsTracked: 22, expertSkills: 9, activeSkillPlans: 3, skillsInDecay: 1, lastSkillAssessment: '2024-01-12', skillRating: 4.1, region: 'Asia Pacific', topSkills: ['Figma', 'User Research', 'Prototyping'] },
  { id: '5', name: 'Jessica Wang', role: 'DevOps Engineer', department: 'Engineering', skillsTracked: 26, expertSkills: 11, activeSkillPlans: 5, skillsInDecay: 0, lastSkillAssessment: '2024-01-11', skillRating: 4.4, region: 'North America', topSkills: ['AWS', 'Docker', 'Kubernetes'] },
  
  // Medium skill performers
  { id: '6', name: 'Alex Johnson', role: 'Business Analyst', department: 'Operations', skillsTracked: 15, expertSkills: 4, activeSkillPlans: 2, skillsInDecay: 3, lastSkillAssessment: '2024-01-10', skillRating: 3.5, region: 'Europe', topSkills: ['Excel', 'Tableau', 'SQL'] },
  { id: '7', name: 'Maria Gonzalez', role: 'Marketing Manager', department: 'Marketing', skillsTracked: 16, expertSkills: 5, activeSkillPlans: 1, skillsInDecay: 2, lastSkillAssessment: '2024-01-09', skillRating: 3.7, region: 'South America', topSkills: ['Digital Marketing', 'Analytics', 'Content Strategy'] },
  { id: '8', name: 'Robert Lee', role: 'Sales Representative', department: 'Sales', skillsTracked: 12, expertSkills: 3, activeSkillPlans: 1, skillsInDecay: 4, lastSkillAssessment: '2024-01-08', skillRating: 3.2, region: 'Asia Pacific', topSkills: ['Salesforce', 'Negotiation', 'Communication'] },
  { id: '9', name: 'Jennifer Brown', role: 'HR Specialist', department: 'Human Resources', skillsTracked: 14, expertSkills: 4, activeSkillPlans: 2, skillsInDecay: 3, lastSkillAssessment: '2024-01-07', skillRating: 3.4, region: 'North America', topSkills: ['Recruitment', 'Performance Management', 'Employee Relations'] },
  { id: '10', name: 'Thomas Wilson', role: 'Financial Analyst', department: 'Finance', skillsTracked: 13, expertSkills: 2, activeSkillPlans: 1, skillsInDecay: 5, lastSkillAssessment: '2024-01-06', skillRating: 3.1, region: 'Europe', topSkills: ['Financial Modeling', 'Excel', 'Power BI'] },
  
  // Lower skill performers but developing
  { id: '11', name: 'Lisa Zhang', role: 'Quality Assurance', department: 'Engineering', skillsTracked: 11, expertSkills: 2, activeSkillPlans: 3, skillsInDecay: 2, lastSkillAssessment: '2024-01-05', skillRating: 3.0, region: 'Asia Pacific', topSkills: ['Testing', 'Automation', 'Quality Assurance'] },
  { id: '12', name: 'Carlos Martinez', role: 'Support Specialist', department: 'Customer Support', skillsTracked: 9, expertSkills: 1, activeSkillPlans: 2, skillsInDecay: 3, lastSkillAssessment: '2024-01-04', skillRating: 2.8, region: 'South America', topSkills: ['Customer Service', 'Troubleshooting', 'Communication'] },
  
  // Various other employees for comprehensive coverage
  { id: '13', name: 'Amanda Taylor', role: 'Scrum Master', department: 'Engineering', skillsTracked: 19, expertSkills: 7, activeSkillPlans: 2, skillsInDecay: 1, lastSkillAssessment: '2024-01-15', skillRating: 3.8, region: 'North America', topSkills: ['Agile', 'Scrum', 'Leadership'] },
  { id: '14', name: 'James Anderson', role: 'Solutions Architect', department: 'Engineering', skillsTracked: 25, expertSkills: 10, activeSkillPlans: 4, skillsInDecay: 2, lastSkillAssessment: '2024-01-14', skillRating: 4.3, region: 'Europe', topSkills: ['System Design', 'AWS', 'Microservices'] },
  { id: '15', name: 'Sophie Martin', role: 'Content Creator', department: 'Marketing', skillsTracked: 14, expertSkills: 3, activeSkillPlans: 1, skillsInDecay: 2, lastSkillAssessment: '2024-01-13', skillRating: 3.3, region: 'Europe', topSkills: ['Content Writing', 'SEO', 'Social Media'] }
];

// Helper function to get drill-down data for skill metrics
export function getSkillDrillDownData(cardType: string): any {
  const baseData = {
    cardType,
    description: getCardDescription(cardType),
  };

  switch (cardType) {
    case 'Total Skills Tracked':
      const totalSkillsTracked = skillEmployees.reduce((sum, e) => sum + e.skillsTracked, 0);
      return {
        ...baseData,
        employees: skillEmployees.length,
        value: totalSkillsTracked,
        ratingDistribution: {
          'High Skill Coverage (20+ skills)': skillEmployees.filter(e => e.skillsTracked >= 20).length,
          'Medium Skill Coverage (15-19 skills)': skillEmployees.filter(e => e.skillsTracked >= 15 && e.skillsTracked < 20).length,
          'Low Skill Coverage (1-14 skills)': skillEmployees.filter(e => e.skillsTracked < 15).length,
        },
        departmentBreakdown: getDepartmentBreakdown(),
        regionBreakdown: getRegionBreakdown(),
        averageSkillsPerEmployee: Math.round(totalSkillsTracked / skillEmployees.length * 10) / 10,
      };

    case 'Expert-Level Skills':
      const totalExpertSkills = skillEmployees.reduce((sum, e) => sum + e.expertSkills, 0);
      return {
        ...baseData,
        employees: skillEmployees.filter(e => e.expertSkills > 0).length,
        value: totalExpertSkills,
        ratingDistribution: {
          'Highly Expert (8+ expert skills)': skillEmployees.filter(e => e.expertSkills >= 8).length,
          'Moderately Expert (4-7 expert skills)': skillEmployees.filter(e => e.expertSkills >= 4 && e.expertSkills < 8).length,
          'Developing Expertise (1-3 expert skills)': skillEmployees.filter(e => e.expertSkills >= 1 && e.expertSkills < 4).length,
        },
        topExperts: skillEmployees
          .sort((a, b) => b.expertSkills - a.expertSkills)
          .slice(0, 5)
          .reduce((acc, emp) => ({ ...acc, [emp.name]: emp.expertSkills }), {}),
        expertiseRatio: `${Math.round((totalExpertSkills / skillEmployees.reduce((sum, e) => sum + e.skillsTracked, 0)) * 100)}%`,
      };

    case 'Active Skill Plans':
      const totalActiveSkillPlans = skillEmployees.reduce((sum, e) => sum + e.activeSkillPlans, 0);
      return {
        ...baseData,
        employees: skillEmployees.filter(e => e.activeSkillPlans > 0).length,
        value: totalActiveSkillPlans,
        ratingDistribution: {
          'High Activity (4+ active plans)': skillEmployees.filter(e => e.activeSkillPlans >= 4).length,
          'Medium Activity (2-3 active plans)': skillEmployees.filter(e => e.activeSkillPlans >= 2 && e.activeSkillPlans < 4).length,
          'Low Activity (1 active plan)': skillEmployees.filter(e => e.activeSkillPlans === 1).length,
        },
        mostActiveUsers: skillEmployees
          .sort((a, b) => b.activeSkillPlans - a.activeSkillPlans)
          .slice(0, 5)
          .reduce((acc, emp) => ({ ...acc, [emp.name]: emp.activeSkillPlans }), {}),
        averagePlansPerEmployee: Math.round(totalActiveSkillPlans / skillEmployees.length * 10) / 10,
      };

    case 'Skills in Decay':
      const totalSkillsInDecay = skillEmployees.reduce((sum, e) => sum + e.skillsInDecay, 0);
      const employeesWithDecay = skillEmployees.filter(e => e.skillsInDecay > 0);
      return {
        ...baseData,
        employees: employeesWithDecay.length,
        value: totalSkillsInDecay,
        ratingDistribution: {
          'High Decay Risk (4+ skills)': skillEmployees.filter(e => e.skillsInDecay >= 4).length,
          'Medium Decay Risk (2-3 skills)': skillEmployees.filter(e => e.skillsInDecay >= 2 && e.skillsInDecay < 4).length,
          'Low Decay Risk (1 skill)': skillEmployees.filter(e => e.skillsInDecay === 1).length,
        },
        riskEmployees: skillEmployees
          .filter(e => e.skillsInDecay > 0)
          .sort((a, b) => b.skillsInDecay - a.skillsInDecay)
          .slice(0, 5)
          .reduce((acc, emp) => ({ ...acc, [emp.name]: emp.skillsInDecay }), {}),
        decayPercentage: `${Math.round((totalSkillsInDecay / skillEmployees.reduce((sum, e) => sum + e.skillsTracked, 0)) * 100)}%`,
      };

    default:
      return baseData;
  }
}

function getCardDescription(cardType: string): string {
  const descriptions: Record<string, string> = {
    'Total Skills Tracked': 'All skills being monitored and assessed across the organization',
    'Expert-Level Skills': 'Skills where employees have achieved expert-level proficiency (4+ rating)',
    'Active Skill Plans': 'Current skill development plans in progress across all employees',
    'Skills in Decay': 'Skills showing declining proficiency that require attention and development',
  };
  
  return descriptions[cardType] || 'Skill metric details';
}

function getDepartmentBreakdown(): Record<string, number> {
  return skillEmployees.reduce((acc: Record<string, number>, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
}

function getRegionBreakdown(): Record<string, number> {
  return skillEmployees.reduce((acc: Record<string, number>, emp) => {
    acc[emp.region] = (acc[emp.region] || 0) + 1;
    return acc;
  }, {});
}
interface RecordItem {
  id: string;
  name: string;
  value: number | string;
  description?: string;
  department?: string;
  role?: string;
  rating?: number;
  hours?: number;
  completions?: number;
  lastActivity?: string;
}

// Generate mock records for different categories
export const generateRecords = (category: string, title: string): RecordItem[] => {
  const recordTemplates = {
    // Rating-based records
    '1-2 Stars': generateLearnersByRating(1, 2),
    '3 Stars': generateLearnersByRating(3, 3),
    '4-5 Stars': generateLearnersByRating(4, 5),
    
    // Skill-based records
    'JavaScript': generateSkillLearners('JavaScript'),
    'Python': generateSkillLearners('Python'),
    'Data Analysis': generateSkillLearners('Data Analysis'),
    'Project Management': generateSkillLearners('Project Management'),
    'Machine Learning': generateSkillLearners('Machine Learning'),
    'React': generateSkillLearners('React'),
    'Cloud Computing': generateSkillLearners('Cloud Computing'),
    
    // Tier-based records
    'Beginner': generateTierLearners('Beginner'),
    'Intermediate': generateTierLearners('Intermediate'),
    'Advanced': generateTierLearners('Advanced'),
    'Expert': generateTierLearners('Expert'),
  };

  return recordTemplates[category] || generateDefaultRecords(category, title);
};

function generateLearnersByRating(minRating: number, maxRating: number): RecordItem[] {
  const names = [
    'Alex Johnson', 'Maria Garcia', 'David Chen', 'Sarah Wilson', 'Michael Brown',
    'Emily Davis', 'James Rodriguez', 'Lisa Anderson', 'Robert Taylor', 'Jennifer White',
    'Christopher Lee', 'Amanda Thompson', 'Daniel Martinez', 'Jessica Miller', 'Matthew Jackson'
  ];
  
  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance'];
  const roles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Marketing Manager', 'Sales Rep'];
  
  return names.slice(0, 12).map((name, index) => ({
    id: `learner_${index + 1}`,
    name,
    value: (Math.random() * (maxRating - minRating) + minRating).toFixed(1),
    department: departments[index % departments.length],
    role: roles[index % roles.length],
    rating: Math.random() * (maxRating - minRating) + minRating,
    hours: Math.floor(Math.random() * 80) + 20,
    completions: Math.floor(Math.random() * 15) + 5,
    lastActivity: `${Math.floor(Math.random() * 30) + 1} days ago`,
    description: `Active learner with ${Math.floor(Math.random() * 15) + 5} course completions`
  }));
}

function generateSkillLearners(skill: string): RecordItem[] {
  const names = [
    'Alex Thompson', 'Sarah Kim', 'Michael Zhang', 'Emily Rodriguez', 'David Wilson',
    'Lisa Chen', 'James Park', 'Maria Gonzalez', 'Robert Johnson', 'Jennifer Lee',
    'Christopher Brown', 'Amanda Davis', 'Daniel Garcia', 'Jessica Taylor'
  ];
  
  const departments = ['Engineering', 'Product', 'Data Science', 'DevOps', 'QA'];
  const roles = ['Senior Developer', 'Tech Lead', 'Data Scientist', 'DevOps Engineer', 'QA Engineer'];
  
  return names.slice(0, 15).map((name, index) => ({
    id: `skill_${skill.toLowerCase().replace(/\s+/g, '_')}_${index + 1}`,
    name,
    value: Math.floor(Math.random() * 50) + 20,
    department: departments[index % departments.length],
    role: roles[index % roles.length],
    rating: Math.random() * 2 + 3.5, // 3.5-5.0 rating
    hours: Math.floor(Math.random() * 100) + 30,
    completions: Math.floor(Math.random() * 20) + 8,
    lastActivity: `${Math.floor(Math.random() * 14) + 1} days ago`,
    description: `Specialist in ${skill} with strong performance metrics`
  }));
}

function generateTierLearners(tier: string): RecordItem[] {
  const names = [
    'Taylor Johnson', 'Jordan Smith', 'Casey Brown', 'Morgan Davis', 'Riley Wilson',
    'Avery Garcia', 'Quinn Rodriguez', 'Cameron Lee', 'Dakota Miller', 'Sage Anderson',
    'River Thompson', 'Phoenix Martinez', 'Skyler Jackson'
  ];
  
  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'Operations'];
  const roles = ['Junior Developer', 'Associate PM', 'Marketing Specialist', 'Account Manager', 'Analyst'];
  
  const tierMultipliers = {
    'Beginner': { hours: 0.5, completions: 0.3, rating: 0.7 },
    'Intermediate': { hours: 0.8, completions: 0.7, rating: 0.9 },
    'Advanced': { hours: 1.2, completions: 1.1, rating: 1.1 },
    'Expert': { hours: 1.5, completions: 1.4, rating: 1.2 }
  };
  
  const multiplier = tierMultipliers[tier] || tierMultipliers['Intermediate'];
  
  return names.slice(0, 13).map((name, index) => ({
    id: `tier_${tier.toLowerCase()}_${index + 1}`,
    name,
    value: Math.floor((Math.random() * 40 + 10) * multiplier.completions),
    department: departments[index % departments.length],
    role: roles[index % roles.length],
    rating: (Math.random() * 1.5 + 3) * multiplier.rating,
    hours: Math.floor((Math.random() * 60 + 20) * multiplier.hours),
    completions: Math.floor((Math.random() * 12 + 3) * multiplier.completions),
    lastActivity: `${Math.floor(Math.random() * 21) + 1} days ago`,
    description: `${tier} level learner with consistent progress`
  }));
}

function generateDefaultRecords(category: string, title: string): RecordItem[] {
  const names = [
    'Sam Williams', 'Kelly Martinez', 'Chris Johnson', 'Pat Davis', 'Jamie Brown',
    'Drew Wilson', 'Ash Garcia', 'Blair Rodriguez', 'Sage Thompson', 'River Lee'
  ];
  
  return names.map((name, index) => ({
    id: `default_${index + 1}`,
    name,
    value: Math.floor(Math.random() * 100) + 1,
    department: ['Engineering', 'Product', 'Marketing'][index % 3],
    role: ['Developer', 'Manager', 'Analyst'][index % 3],
    rating: Math.random() * 2 + 3,
    hours: Math.floor(Math.random() * 80) + 10,
    completions: Math.floor(Math.random() * 15) + 2,
    lastActivity: `${Math.floor(Math.random() * 30) + 1} days ago`,
    description: `Member of ${category} category`
  }));
}
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
  const firstNames = [
    'Alex', 'Maria', 'David', 'Sarah', 'Michael', 'Emily', 'James', 'Lisa', 'Robert', 'Jennifer',
    'Christopher', 'Amanda', 'Daniel', 'Jessica', 'Matthew', 'Ashley', 'Joshua', 'Michelle', 'Andrew', 'Stephanie',
    'Brian', 'Nicole', 'Kevin', 'Elizabeth', 'Steven', 'Helen', 'Thomas', 'Laura', 'Ryan', 'Rebecca',
    'Jason', 'Sharon', 'Anthony', 'Cynthia', 'Mark', 'Kathleen', 'Donald', 'Amy', 'Kenneth', 'Angela',
    'Paul', 'Brenda', 'Jonathan', 'Emma', 'Walter', 'Olivia', 'Wayne', 'Rachel', 'Carl', 'Madison'
  ];
  
  const lastNames = [
    'Johnson', 'Garcia', 'Chen', 'Wilson', 'Brown', 'Davis', 'Rodriguez', 'Anderson', 'Taylor', 'White',
    'Lee', 'Thompson', 'Martinez', 'Miller', 'Jackson', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker',
    'Young', 'Allen', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker',
    'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker',
    'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan'
  ];
  
  const departments = [
    'Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Customer Success',
    'Data Science', 'Design', 'Legal', 'IT', 'Quality Assurance', 'Business Development', 'Research'
  ];
  
  const roles = [
    'Software Engineer', 'Senior Software Engineer', 'Data Scientist', 'Product Manager', 'Marketing Manager',
    'Sales Representative', 'HR Specialist', 'Financial Analyst', 'Operations Manager', 'Customer Success Manager',
    'UX Designer', 'DevOps Engineer', 'QA Engineer', 'Business Analyst', 'Research Scientist', 'Technical Lead',
    'Account Manager', 'Content Strategist', 'Project Manager', 'Solutions Engineer'
  ];
  
  // Generate up to 50 records
  const recordCount = Math.min(50, Math.max(15, Math.floor(Math.random() * 35) + 15));
  
  return Array.from({ length: recordCount }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    return {
      id: `learner_${index + 1}`,
      name,
      value: (Math.random() * (maxRating - minRating) + minRating).toFixed(1),
      department: departments[Math.floor(Math.random() * departments.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      rating: Math.random() * (maxRating - minRating) + minRating,
      hours: Math.floor(Math.random() * 120) + 20,
      completions: Math.floor(Math.random() * 25) + 5,
      lastActivity: `${Math.floor(Math.random() * 30) + 1} days ago`,
      description: `Active learner with ${Math.floor(Math.random() * 15) + 5} course completions`
    };
  });
}

function generateSkillLearners(skill: string): RecordItem[] {
  const firstNames = [
    'Alex', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Jennifer',
    'Christopher', 'Amanda', 'Daniel', 'Jessica', 'Matthew', 'Ashley', 'Joshua', 'Michelle', 'Andrew', 'Stephanie',
    'Brian', 'Nicole', 'Kevin', 'Elizabeth', 'Steven', 'Helen', 'Thomas', 'Laura', 'Ryan', 'Rebecca',
    'Jason', 'Sharon', 'Anthony', 'Cynthia', 'Mark', 'Kathleen', 'Donald', 'Amy', 'Kenneth', 'Angela',
    'Paul', 'Brenda', 'Jonathan', 'Emma', 'Walter', 'Olivia', 'Wayne', 'Rachel', 'Carl', 'Madison'
  ];
  
  const lastNames = [
    'Thompson', 'Kim', 'Zhang', 'Rodriguez', 'Wilson', 'Chen', 'Park', 'Gonzalez', 'Johnson', 'Lee',
    'Brown', 'Davis', 'Garcia', 'Taylor', 'Miller', 'Moore', 'Anderson', 'Thomas', 'Jackson', 'White',
    'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Lewis', 'Walker', 'Hall',
    'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams',
    'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell'
  ];
  
  const departments = [
    'Engineering', 'Product', 'Data Science', 'DevOps', 'QA', 'Research', 'IT', 'Analytics',
    'Machine Learning', 'Cloud Engineering', 'Frontend', 'Backend', 'Full Stack', 'Mobile'
  ];
  
  const roles = [
    'Senior Developer', 'Tech Lead', 'Data Scientist', 'DevOps Engineer', 'QA Engineer',
    'Software Architect', 'Principal Engineer', 'Staff Engineer', 'Engineering Manager', 'Consultant',
    'Specialist', 'Expert', 'Analyst', 'Researcher', 'Solutions Engineer'
  ];
  
  // Generate 40-50 records for skills
  const recordCount = Math.floor(Math.random() * 11) + 40;
  
  return Array.from({ length: recordCount }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    return {
      id: `skill_${skill.toLowerCase().replace(/\s+/g, '_')}_${index + 1}`,
      name,
      value: Math.floor(Math.random() * 80) + 20,
      department: departments[Math.floor(Math.random() * departments.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      rating: Math.random() * 1.5 + 3.5, // 3.5-5.0 rating
      hours: Math.floor(Math.random() * 150) + 40,
      completions: Math.floor(Math.random() * 30) + 8,
      lastActivity: `${Math.floor(Math.random() * 21) + 1} days ago`,
      description: `Specialist in ${skill} with strong performance metrics`
    };
  });
}

function generateTierLearners(tier: string): RecordItem[] {
  const firstNames = [
    'Taylor', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Cameron', 'Dakota', 'Sage',
    'River', 'Phoenix', 'Skyler', 'Blake', 'Reese', 'Drew', 'Peyton', 'Hayden', 'Logan', 'Rowan',
    'Devon', 'Finley', 'Harper', 'Kendall', 'Sloan', 'Parker', 'Emery', 'Tatum', 'Sage', 'Jamie',
    'Alex', 'Jordan', 'Avery', 'Taylor', 'Casey', 'Riley', 'Morgan', 'Quinn', 'Emerson', 'Lennox',
    'Marlowe', 'Sutton', 'Briar', 'Ellis', 'Indigo', 'Remy', 'Shay', 'Wren', 'Lane', 'Gray'
  ];
  
  const lastNames = [
    'Johnson', 'Smith', 'Brown', 'Davis', 'Wilson', 'Garcia', 'Rodriguez', 'Lee', 'Miller', 'Anderson',
    'Thompson', 'Martinez', 'Jackson', 'White', 'Lopez', 'Clark', 'Lewis', 'Walker', 'Hall', 'Allen',
    'Young', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
    'Nelson', 'Baker', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans',
    'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell'
  ];
  
  const departments = [
    'Engineering', 'Product', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'Customer Success',
    'Design', 'Data Science', 'IT', 'Legal', 'Business Development', 'Quality Assurance'
  ];
  
  const roles = [
    'Junior Developer', 'Associate PM', 'Marketing Specialist', 'Account Manager', 'Analyst',
    'Coordinator', 'Specialist', 'Associate', 'Assistant', 'Representative', 'Consultant',
    'Manager', 'Senior Analyst', 'Lead', 'Principal', 'Director'
  ];
  
  const tierMultipliers = {
    'Beginner': { hours: 0.4, completions: 0.3, rating: 0.7, count: [25, 35] },
    'Intermediate': { hours: 0.8, completions: 0.7, rating: 0.9, count: [35, 45] },
    'Advanced': { hours: 1.2, completions: 1.1, rating: 1.1, count: [40, 50] },
    'Expert': { hours: 1.5, completions: 1.4, rating: 1.2, count: [30, 40] }
  };
  
  const multiplier = tierMultipliers[tier] || tierMultipliers['Intermediate'];
  const [minCount, maxCount] = multiplier.count;
  const recordCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  
  return Array.from({ length: recordCount }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    return {
      id: `tier_${tier.toLowerCase()}_${index + 1}`,
      name,
      value: Math.floor((Math.random() * 40 + 10) * multiplier.completions),
      department: departments[Math.floor(Math.random() * departments.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      rating: (Math.random() * 1.5 + 3) * multiplier.rating,
      hours: Math.floor((Math.random() * 80 + 20) * multiplier.hours),
      completions: Math.floor((Math.random() * 20 + 3) * multiplier.completions),
      lastActivity: `${Math.floor(Math.random() * 28) + 1} days ago`,
      description: `${tier} level learner with consistent progress`
    };
  });
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
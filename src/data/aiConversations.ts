// AI Conversation Examples and Response Templates for LXP Analytics

export interface ConversationExample {
  id: string;
  query: string;
  category: "skills" | "engagement" | "content" | "career" | "analytics";
  response: string;
  visualization?: {
    type: "column" | "bar" | "line" | "pie" | "heatmap";
    title: string;
    insights: string[];
  };
  followUpSuggestions: string[];
}

export const conversationExamples: ConversationExample[] = [
  {
    id: "skills-trending-q3",
    query: "What are the top 5 skills trending in Q3?",
    category: "skills",
    response: "Analyzing Q3 skill trends...\n\nHere is a column chart showing the Top 5 Trending Skills in Q3.\n\nKey findings:\n• AI/ML skills show explosive 145% growth\n• Cybersecurity interest surged by 123%\n• Cloud computing remains consistently in-demand\n• Data science pathways see steady 67% growth",
    visualization: {
      type: "column",
      title: "Top 5 Trending Skills in Q3 2024",
      insights: [
        "Artificial Intelligence leads with 2,340+ active learners",
        "145% growth rate indicates high market demand",
        "Engineering teams show highest skill adoption rates"
      ]
    },
    followUpSuggestions: [
      "Show skill gaps for engineering team",
      "Compare Q3 vs Q2 skill trends",
      "Break down by department",
      "Add skill decay analysis"
    ]
  },
  
  {
    id: "pathway-completion-rates",
    query: "Which content pathways have the highest completion rates?",
    category: "content",
    response: "Creating new visualization...\n\nHere is a column chart showing Learning Completion Rates by Pathway.\n\nKey insights:\n• Digital Marketing pathway leads with 81% completion\n• Leadership Development shows opportunity for improvement at 59%\n• Technical tracks maintain strong 65-72% completion rates",
    visualization: {
      type: "column", 
      title: "Learning Completion Rates by Pathway",
      insights: [
        "Digital Marketing Specialist pathway achieves highest completion (81%)",
        "Data Science Professional track shows strong engagement (72%)",
        "Leadership Development needs engagement improvements (59%)"
      ]
    },
    followUpSuggestions: [
      "Show completion trends over time",
      "Break down by learner role", 
      "Add time-to-completion metric",
      "Compare with industry benchmarks"
    ]
  },

  {
    id: "engineering-skill-gaps",
    query: "Show me the skill gaps for our engineering team vs market demand",
    category: "skills",
    response: "Analyzing skill gaps for engineering team vs market demand...\n\nHere is a bar chart showing the Skill Gaps in Engineering Team.\n\nCritical findings:\n• Kubernetes shows the largest gap (55 point deficit)\n• Machine Learning skills need development (33 point gap)\n• React/Frontend skills are well-aligned with market needs",
    visualization: {
      type: "bar",
      title: "Engineering Team Skill Gaps vs Market Demand", 
      insights: [
        "Kubernetes expertise critically needed (55 point gap)",
        "ML/AI skills represent growth opportunity (33 point gap)",
        "DevOps capabilities show moderate gap (22 points)"
      ]
    },
    followUpSuggestions: [
      "Create skill development roadmap",
      "Show available learning content",
      "Add hiring vs training analysis",
      "Compare with peer organizations"
    ]
  },

  {
    id: "leadership-preparation",
    query: "How many learners are preparing for leadership roles?",
    category: "career",
    response: "Based on current data analysis:\n\n876 learners are actively engaged in leadership development pathways with strong progression indicators:\n\n• Leadership Development Journey: 59% completion rate\n• Management Fundamentals: 234 active learners\n• Team Leadership modules showing high engagement\n• 40% of product managers ready for senior roles",
    followUpSuggestions: [
      "Show leadership readiness by department",
      "Track career progression timelines",
      "Compare internal vs external leadership hires",
      "Add succession planning insights"
    ]
  },

  {
    id: "engagement-trends",
    query: "Show learning engagement by department over time",
    category: "engagement", 
    response: "Creating new visualization...\n\nHere is a line chart showing Learning Engagement Trends by Department Over the Past 6 Months.\n\nPositive trends identified:\n• Engineering leads with 94% engagement score\n• Product team shows consistent 88% engagement\n• 66% overall increase in learning hours since April",
    visualization: {
      type: "line",
      title: "Learning Engagement Trends by Department (6 Months)",
      insights: [
        "Engineering maintains highest engagement (94%)",
        "All departments show upward trajectory",
        "Q3 marked significant acceleration in learning activity"
      ]
    },
    followUpSuggestions: [
      "Add engagement drivers analysis",
      "Show seasonal patterns",
      "Break down by content type",
      "Compare with productivity metrics"
    ]
  },

  {
    id: "content-satisfaction",
    query: "What content has the highest satisfaction scores?",
    category: "content",
    response: "Analyzing content satisfaction across all learning materials...\n\nTop performing content by satisfaction:\n\n• Introduction to AI Ethics: 4.8/5 rating (2,341 completions)\n• Cloud Security Fundamentals: 4.6/5 rating (1,987 completions)\n• Agile Leadership Pathway: 4.7/5 rating (1,756 completions)\n\nOverall NPS score: 67 (Industry benchmark: 45)",
    followUpSuggestions: [
      "Show satisfaction by content type",
      "Add learner feedback themes",
      "Compare provider performance",
      "Track satisfaction trends over time"
    ]
  }
];

// AI Response Templates
export const responseTemplates = {
  analysis: "Analyzing {topic}...\n\nHere is a {chartType} showing {title}.\n\n{insights}",
  creation: "Creating new visualization...\n\nHere is a {chartType} showing {title}.\n\n{keyFindings}",
  comparison: "Comparing {aspect1} vs {aspect2}...\n\n{findings}\n\nKey differences:\n{differences}",
  trend: "Analyzing trends over {timeFrame}...\n\n{trendInsights}\n\nProjections:\n{projections}"
};

// Smart Suggestions Engine
export const generateSuggestions = (context: string, category: string): string[] => {
  const suggestionBank = {
    skills: [
      "Show skill decay rates",
      "Compare with market demand",
      "Add certification tracking",
      "Break down by experience level",
      "Show learning velocity",
      "Add skill endorsements"
    ],
    engagement: [
      "Add completion rate trends", 
      "Show engagement drivers",
      "Break down by content type",
      "Compare departments",
      "Add seasonal patterns",
      "Show learner personas"
    ],
    content: [
      "Add satisfaction ratings",
      "Show usage patterns",
      "Compare providers",
      "Track content ROI",
      "Add feedback themes",
      "Show content lifecycle"
    ],
    career: [
      "Show readiness metrics",
      "Add progression timelines",
      "Track internal mobility",
      "Compare with external hires",
      "Show succession planning",
      "Add retention correlation"
    ],
    analytics: [
      "Switch to bar chart",
      "Add time filter",
      "Break down by department",
      "Show comparative metrics", 
      "Add drill-down options",
      "Export to dashboard"
    ]
  };

  return suggestionBank[category as keyof typeof suggestionBank]?.slice(0, 3) || [];
};

// Context-Aware Response Generation
export const generateContextualResponse = (query: string): {
  response: string;
  visualization?: any;
  suggestions: string[];
} => {
  const lowerQuery = query.toLowerCase();
  
  // Find matching conversation example
  const matchingExample = conversationExamples.find(example => 
    lowerQuery.includes(example.query.toLowerCase().split(' ').slice(0, 3).join(' '))
  );
  
  if (matchingExample) {
    return {
      response: matchingExample.response,
      visualization: matchingExample.visualization,
      suggestions: matchingExample.followUpSuggestions
    };
  }
  
  // Generate contextual response based on keywords
  const category = detectCategory(lowerQuery);
  const suggestions = generateSuggestions(query, category);
  
  return {
    response: `I can help you analyze ${category} data and create visualizations. What specific aspect would you like to explore?`,
    suggestions
  };
};

const detectCategory = (query: string): string => {
  const categoryKeywords = {
    skills: ['skill', 'gap', 'competenc', 'expertis', 'growth', 'decay'],
    engagement: ['engagement', 'activity', 'participation', 'usage', 'active'],
    content: ['content', 'course', 'pathway', 'completion', 'satisfaction', 'rating'],
    career: ['career', 'leadership', 'promotion', 'readiness', 'development', 'progression'],
    analytics: ['trend', 'metric', 'chart', 'dashboard', 'report', 'analysis']
  };
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      return category;
    }
  }
  
  return 'analytics';
};
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  MessageSquare, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Lightbulb,
  Send,
  Sparkles,
  BarChart3,
  PieChart,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Play,
  HelpCircle,
  ArrowRight,
  Plus
} from "lucide-react";
import { aiInsightsData, conversationStarters } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ChatMessage {
  type: "user" | "assistant";
  content: string;
  visualization?: {
    type: "line" | "bar" | "column";
    title: string;
    metrics: string[];
    attributes: string[];
    filters: string[];
    data?: any;
  };
}

interface TourStep {
  id: number;
  title: string;
  description: string;
  action: string;
}

export default function AIInsights() {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: "assistant",
      content: "Hi there,\nHow can I help you?"
    }
  ]);

  const tourSteps: TourStep[] = [
    { id: 1, title: "Ask me a question", description: "Try asking about learning trends, skill gaps, or engagement metrics", action: "Ask a natural language question" },
    { id: 2, title: "Explore dashboards", description: "Navigate through our pre-built analytics dashboards", action: "Browse dashboard categories" },
    { id: 3, title: "Search skills & pathways", description: "Use smart search to find specific content and insights", action: "Try the search functionality" },
    { id: 4, title: "Personalize filters", description: "Filter data by team, role, region, and time period", action: "Apply custom filters" },
    { id: 5, title: "Export or share insights", description: "Save and share your discoveries with stakeholders", action: "Export or share results" }
  ];

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = { type: "user", content: query };
    setChatMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      // Generate contextual response based on query
      let response = "";
      let visualization = null;

      if (query.toLowerCase().includes("trend") || query.toLowerCase().includes("skill")) {
        response = "Creating new visualization...\n\nHere is line chart showing the Trend of AI Learning Activity Over the Past 6 Months";
        visualization = {
          type: "line" as const,
          title: "Trend of AI Learning Activity Over the Past 6 Months", 
          metrics: ["Learning Hours", "Course Completions"],
          attributes: ["Skill Category", "Date - Month/Year"],
          filters: ["Past 6 months", "AI-related content"],
          data: [
            { month: "Apr", hours: 234, completions: 45 },
            { month: "May", hours: 287, completions: 52 },
            { month: "Jun", hours: 356, completions: 67 },
            { month: "Jul", hours: 445, completions: 89 },
            { month: "Aug", hours: 534, completions: 123 },
            { month: "Sep", hours: 623, completions: 145 }
          ]
        };
      } else if (query.toLowerCase().includes("completion") || query.toLowerCase().includes("pathway")) {
        response = "Creating a new visualization to show content completion rates\n\nHere is column chart showing the Course Completion Rates by Learning Pathway";
        visualization = {
          type: "column" as const,
          title: "Course Completion Rates by Learning Pathway",
          metrics: ["Completion Rate"],
          attributes: ["Learning Pathway"],
          filters: ["Active Pathways Only"],
          data: [
            { pathway: "Data Science Professional", rate: 72, learners: 987 },
            { pathway: "Software Engineering", rate: 67, learners: 1234 },
            { pathway: "Leadership Development", rate: 59, learners: 876 },
            { pathway: "Digital Marketing", rate: 81, learners: 654 }
          ]
        };
      } else if (query.toLowerCase().includes("gap") || query.toLowerCase().includes("engineer")) {
        response = "Analyzing skill gaps for engineering team vs market demand\n\nHere is bar chart showing the Skill Gaps in Engineering Team";
        visualization = {
          type: "bar" as const,
          title: "Skill Gaps in Engineering Team vs Market Demand",
          metrics: ["Current Skills", "Market Demand", "Gap"],
          attributes: ["Skill Category"],
          filters: ["Engineering Department"],
          data: [
            { skill: "Kubernetes", current: 23, demand: 78, gap: 55 },
            { skill: "Machine Learning", current: 34, demand: 67, gap: 33 },
            { skill: "DevOps", current: 45, demand: 67, gap: 22 },
            { skill: "Cloud Architecture", current: 56, demand: 70, gap: 14 }
          ]
        };
      } else {
        const responses = [
          "Based on the latest data, I can see significant growth in learning engagement across all departments. The engineering team shows particularly strong momentum with a 34% increase in course completions this quarter.",
          "Interesting pattern detected: Python and Machine Learning skills show the highest learner interest, with 2,340+ active learners this month. This aligns with market demand trends.",
          "Leadership pathway completion rates have improved to 59%, up from 45% last quarter. The new microlearning format is driving better engagement.",
          "Video content is significantly outperforming other formats with 85% completion rates vs 67% for text-based materials. Consider expanding video curriculum."
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      const aiMessage: ChatMessage = { 
        type: "assistant", 
        content: response,
        visualization 
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    setQuery(action);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case "skill_gap":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "engagement":
        return <Target className="h-4 w-4 text-green-500" />;
      case "career_development":
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case "anomaly":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "prediction":
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default:
        return <Brain className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const renderVisualization = (viz: any) => {
    if (!viz || !viz.data) return null;

    return (
      <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">Creating new visualization...</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-800">{viz.title}</h4>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>• <strong>Metrics:</strong> {viz.metrics.join(", ")}</li>
              <li>• <strong>Attributes:</strong> {viz.attributes.join(", ")}</li>
              <li>• <strong>Filters:</strong> {viz.filters.join(", ")}</li>
            </ul>
          </div>

          {/* Simple chart representation */}
          <div className="bg-white p-4 rounded-md border">
            <div className="h-48 flex items-end justify-around gap-2">
              {viz.data.slice(0, 4).map((item: any, idx: number) => {
                const value = item.rate || item.gap || item.completions || item.hours || 50;
                const height = Math.max((value / 100) * 150, 20);
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md w-8 mb-2 flex items-end justify-center text-xs text-white font-medium"
                      style={{ height: `${height}px` }}
                    >
                      {value}
                    </div>
                    <div className="text-xs text-center text-gray-600 max-w-16 leading-tight">
                      {item.pathway || item.skill || item.month || "Item"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-3 w-3 mr-1" />
              Switch to Bar Chart
            </Button>
            <Button variant="outline" size="sm">
              <PieChart className="h-3 w-3 mr-1" />
              Slice by Department
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-background to-blue-50/30">
      {/* Take a Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto">
                  <span className="text-white font-bold">{currentTourStep + 1}</span>
                </div>
                <h3 className="text-lg font-semibold">{tourSteps[currentTourStep].title}</h3>
                <p className="text-sm text-muted-foreground">{tourSteps[currentTourStep].description}</p>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowTour(false)}
                  >
                    Skip Tour
                  </Button>
                  <div className="flex gap-2">
                    {currentTourStep > 0 && (
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentTourStep(prev => prev - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    <Button 
                      onClick={() => {
                        if (currentTourStep < tourSteps.length - 1) {
                          setCurrentTourStep(prev => prev + 1);
                        } else {
                          setShowTour(false);
                        }
                      }}
                    >
                      {currentTourStep === tourSteps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            AI Assistant Online
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Hi there,<br />How can I help you?
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            I'm your AI-powered analytics assistant for Degreed's Learning Experience Platform. 
            Ask me about learning trends, skill gaps, or content performance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            className="p-6 h-auto flex-col space-y-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-2 hover:border-purple-200"
            onClick={() => handleQuickAction("Search for a dashboard showing learning engagement trends")}
          >
            <Search className="h-6 w-6 text-purple-600" />
            <div className="space-y-1 text-center">
              <div className="font-medium">Search for a dashboard or visualization</div>
              <div className="text-xs text-muted-foreground">Find insights about learning and skills</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto flex-col space-y-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-2 hover:border-blue-200"
            onClick={() => handleQuickAction("Create a new visualization showing top skills by department")}
          >
            <Plus className="h-6 w-6 text-blue-600" />
            <div className="space-y-1 text-center">
              <div className="font-medium">Create a new visualization</div>
              <div className="text-xs text-muted-foreground">Generate charts and insights</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto flex-col space-y-2 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 border-2 hover:border-green-200"
            onClick={() => setShowTour(true)}
          >
            <MessageSquare className="h-6 w-6 text-green-600" />
            <div className="space-y-1 text-center">
              <div className="font-medium">Answer a business question</div>
              <div className="text-xs text-muted-foreground">Get AI-powered insights</div>
            </div>
          </Button>
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-purple-100">
            <CardContent className="p-6">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto space-y-4 mb-6">
                {chatMessages.map((message, index) => (
                  <div key={index} className={cn("flex gap-3", message.type === "user" ? "justify-end" : "justify-start")}>
                    {message.type === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className={cn("max-w-[80%]", message.type === "user" ? "order-2" : "")}>
                      <div className={cn(
                        "p-4 rounded-lg text-sm whitespace-pre-wrap",
                        message.type === "user"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-sm"
                          : "bg-white border-2 border-gray-100 rounded-bl-sm"
                      )}>
                        {message.content}
                      </div>
                      {message.visualization && renderVisualization(message.visualization)}
                    </div>
                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 order-1">
                        <span className="text-white font-medium text-sm">U</span>
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border-2 border-gray-100 p-4 rounded-lg rounded-bl-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask here..."
                    className="flex-1 border-2 border-purple-100 focus:border-purple-300"
                    onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendQuery()}
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={handleSendQuery} 
                    disabled={!query.trim() || isTyping}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-xs text-center text-muted-foreground">
                  AI assistants can make mistakes. Check before relying on these answers.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Question Categories */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTour(true)}
              className="text-purple-600 hover:text-purple-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Take a Tour
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {conversationStarters.map((category, idx) => (
              <Card key={idx} className="border-2 border-gray-100 hover:border-purple-200 transition-colors">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-3 text-center text-gray-700">{category.category}</h3>
                  <div className="space-y-2">
                    {category.questions.slice(0, 2).map((question, qIdx) => (
                      <Button
                        key={qIdx}
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-left h-auto p-2 justify-start hover:bg-purple-50"
                        onClick={() => handleQuickAction(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent AI Insights */}
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Recent AI-Generated Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsightsData.slice(0, 4).map((insight, index) => (
                  <div key={index} className="p-4 rounded-lg border-2 border-gray-100 hover:border-purple-200 transition-colors">
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-600 font-medium">{Math.round(insight.confidence * 100)}% confidence</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            Explore <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
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
  Plus,
  X,
  Minimize2,
  Maximize2
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

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
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
            <div className="h-32 flex items-end justify-around gap-2">
              {viz.data.slice(0, 4).map((item: any, idx: number) => {
                const value = item.rate || item.gap || item.completions || item.hours || 50;
                const height = Math.max((value / 100) * 100, 15);
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md w-6 mb-2 flex items-end justify-center text-xs text-white font-medium"
                      style={{ height: `${height}px` }}
                    >
                      {value}
                    </div>
                    <div className="text-xs text-center text-gray-600 max-w-12 leading-tight">
                      {(item.pathway || item.skill || item.month || "Item").substring(0, 8)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-3 w-3 mr-1" />
              Bar Chart
            </Button>
            <Button variant="outline" size="sm">
              <PieChart className="h-3 w-3 mr-1" />
              Slice by Dept
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl border z-50 transition-all duration-300",
        isMinimized ? "h-14" : "h-[600px]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <span className="font-medium">AI Analytics Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex flex-col h-[calc(100%-56px)]">
            {/* Tour Modal */}
            {showTour && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
                <Card className="w-full max-w-sm mx-4">
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto">
                        <span className="text-white font-bold text-sm">{currentTourStep + 1}</span>
                      </div>
                      <h3 className="font-medium">{tourSteps[currentTourStep].title}</h3>
                      <p className="text-xs text-muted-foreground">{tourSteps[currentTourStep].description}</p>
                      
                      <div className="flex justify-between pt-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowTour(false)}
                        >
                          Skip
                        </Button>
                        <div className="flex gap-1">
                          {currentTourStep > 0 && (
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentTourStep(prev => prev - 1)}
                            >
                              Back
                            </Button>
                          )}
                          <Button 
                            size="sm"
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

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.length === 1 && (
                <div className="text-center space-y-3 py-4">
                  <h3 className="font-medium text-lg">Hi there,<br />How can I help you?</h3>
                  <p className="text-xs text-muted-foreground">
                    Ask me about learning trends, skill gaps, or content performance.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleQuickAction("Search for learning engagement trends")}
                    >
                      <Search className="h-3 w-3 mr-1" />
                      Search dashboards
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleQuickAction("Create visualization showing top skills")}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Create visualization
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => setShowTour(true)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Take a Tour
                    </Button>
                  </div>
                </div>
              )}

              {chatMessages.map((message, index) => (
                <div key={index} className={cn("flex gap-2", message.type === "user" ? "justify-end" : "justify-start")}>
                  {message.type === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Brain className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className={cn("max-w-[80%]", message.type === "user" ? "order-2" : "")}>
                    <div className={cn(
                      "p-3 rounded-lg text-sm whitespace-pre-wrap",
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-sm"
                        : "bg-gray-50 border rounded-bl-sm"
                    )}>
                      {message.content}
                    </div>
                    {message.visualization && renderVisualization(message.visualization)}
                  </div>
                  {message.type === "user" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 order-1">
                      <span className="text-white font-medium text-xs">U</span>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Brain className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-gray-50 border p-3 rounded-lg rounded-bl-sm">
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
            <div className="border-t p-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendQuery()}
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSendQuery} 
                  disabled={!query.trim() || isTyping}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-xs text-center text-muted-foreground">
                AI assistants can make mistakes. Check before relying on these answers.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
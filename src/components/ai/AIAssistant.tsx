import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Search, 
  Send, 
  Plus,
  X,
  Minimize2,
  Maximize2,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  ThumbsUp,
  ThumbsDown,
  BookmarkPlus,
  ExternalLink,
  Sparkles,
  Clock,
  Filter,
  TrendingUp,
  Users,
  Target,
  Award,
  BookOpen,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateContextualResponse } from "@/data/aiConversations";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  visualization?: VisualizationData;
  suggestions?: string[];
}

interface VisualizationData {
  id: string;
  type: "column" | "bar" | "line" | "pie" | "heatmap";
  title: string;
  metrics: string[];
  attributes: string[];
  filters: string[];
  data: any[];
  canModify?: boolean;
  saveOptions?: boolean;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const sampleQueries = [
  "What are the top 5 skills trending in Q3?",
  "Which content pathways have the highest completion rates?", 
  "Show me the skill gaps for our engineering team vs market demand",
  "How many learners are preparing for leadership roles?",
  "Show learning engagement by department over time",
  "What content has the highest satisfaction scores?"
];

const quickActions = [
  { icon: Search, label: "Search dashboards", query: "Show me learning engagement dashboards" },
  { icon: Plus, label: "Create visualization", query: "Create a chart showing course completion rates" },
  { icon: TrendingUp, label: "Answer a business question", query: "What is the learning completion rate by department?" }
];

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (isOpen && chatMessages.length === 0) {
  //     // Initialize with welcome message
  //     setChatMessages([{
  //       id: '1',
  //       type: 'assistant',
  //       content: 'Hi there,\n\nHow can I help you?',
  //       timestamp: new Date()
  //     }]);
  //   }
  // }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const generateVisualization = (queryText: string): VisualizationData | null => {
    const lowerQuery = queryText.toLowerCase();
    
    if (lowerQuery.includes("completion") && (lowerQuery.includes("rate") || lowerQuery.includes("pathway"))) {
      return {
        id: `viz-${Date.now()}`,
        type: "column",
        title: "Learning Completion Rates by Pathway",
        metrics: ["Completion Rate"],
        attributes: ["Learning Pathway"],
        filters: ["Active Pathways Only"],
        data: [
          { name: "Data Science Professional", rate: 72, learners: 987 },
          { name: "Software Engineering Track", rate: 67, learners: 1234 },
          { name: "Leadership Development", rate: 59, learners: 876 },
          { name: "Digital Marketing Specialist", rate: 81, learners: 654 },
          { name: "Cloud Architecture Expert", rate: 63, learners: 543 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    if (lowerQuery.includes("skill") && (lowerQuery.includes("gap") || lowerQuery.includes("engineer"))) {
      return {
        id: `viz-${Date.now()}`,
        type: "bar",
        title: "Skill Gaps in Engineering Team vs Market Demand",
        metrics: ["Current Skills", "Market Demand", "Gap"],
        attributes: ["Skill Category"],
        filters: ["Engineering Department"],
        data: [
          { name: "Kubernetes", current: 23, demand: 78, gap: 55 },
          { name: "Machine Learning", current: 34, demand: 67, gap: 33 },
          { name: "DevOps", current: 45, demand: 67, gap: 22 },
          { name: "Cloud Architecture", current: 56, demand: 70, gap: 14 },
          { name: "React/Frontend", current: 67, demand: 75, gap: 8 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    if (lowerQuery.includes("trend") || lowerQuery.includes("time") || lowerQuery.includes("engagement")) {
      return {
        id: `viz-${Date.now()}`,
        type: "line", 
        title: "Learning Engagement Trends Over Past 6 Months",
        metrics: ["Learning Hours", "Course Completions"],
        attributes: ["Department", "Date - Month/Year"],
        filters: ["Past 6 months"],
        data: [
          { month: "Apr", hours: 2340, completions: 456, engagement: 78 },
          { month: "May", hours: 2567, completions: 523, engagement: 82 },
          { month: "Jun", hours: 2890, completions: 612, engagement: 85 },
          { month: "Jul", hours: 3245, completions: 734, engagement: 88 },
          { month: "Aug", hours: 3567, completions: 823, engagement: 91 },
          { month: "Sep", hours: 3890, completions: 945, engagement: 94 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    if (lowerQuery.includes("top") && lowerQuery.includes("skill")) {
      return {
        id: `viz-${Date.now()}`,
        type: "column",
        title: "Top 5 Trending Skills in Q3",
        metrics: ["Learner Growth", "Market Demand Score"],
        attributes: ["Skill Name"],
        filters: ["Q3 2024", "Trending Skills"],
        data: [
          { name: "Artificial Intelligence", growth: 145, demand: 95, learners: 2340 },
          { name: "Cloud Computing", growth: 89, demand: 92, learners: 1987 },
          { name: "Data Science", growth: 67, demand: 88, learners: 1765 },
          { name: "Cybersecurity", growth: 123, demand: 85, learners: 1543 },
          { name: "Agile Methodology", growth: 56, demand: 76, learners: 1432 }
        ],
        canModify: true,
        saveOptions: true
      };
    }
    
    return null;
  };

  const generateResponse = (queryText: string): string => {
    const lowerQuery = queryText.toLowerCase();
    
    if (lowerQuery.includes("completion") && lowerQuery.includes("rate")) {
      return "Creating new visualization...\n\nHere is a column chart showing the Learning Completion Rates by Pathway.\n\nKey insights:\n• Digital Marketing pathway leads with 81% completion\n• Leadership Development shows opportunity for improvement at 59%\n• Overall pathway engagement is strong across technical tracks";
    }
    
    if (lowerQuery.includes("skill") && lowerQuery.includes("gap")) {
      return "Analyzing skill gaps for engineering team vs market demand...\n\nHere is a bar chart showing the Skill Gaps in Engineering Team.\n\nCritical findings:\n• Kubernetes shows the largest gap (55 point deficit)\n• Machine Learning skills need development (33 point gap)\n• React/Frontend skills are well-aligned with market needs";
    }
    
    if (lowerQuery.includes("trend") || lowerQuery.includes("engagement")) {
      return "Creating new visualization...\n\nHere is a line chart showing the Learning Engagement Trends Over the Past 6 Months.\n\nPositive trends identified:\n• 66% increase in learning hours since April\n• Course completions up 107% year-over-year\n• Engagement scores consistently improving";
    }
    
    if (lowerQuery.includes("top") && lowerQuery.includes("skill")) {
      return "Analyzing Q3 skill trends...\n\nHere is a column chart showing the Top 5 Trending Skills in Q3.\n\nKey findings:\n• AI/ML skills show explosive 145% growth\n• Cybersecurity interest surged by 123%\n• Cloud computing remains consistently in-demand";
    }
    
    if (lowerQuery.includes("leadership")) {
      return "Based on current data, 876 learners are actively engaged in leadership development pathways. The Leadership Development Journey shows a 59% completion rate with strong engagement in management fundamentals and team leadership modules.";
    }
    
    return "I can help you analyze learning data, create visualizations, and provide insights about skills, content performance, and learner engagement. What specific aspect would you like to explore?";
  };

  const getSuggestions = (queryText: string): string[] => {
    const lowerQuery = queryText.toLowerCase();
    const allSuggestions = [
      "Switch to a bar chart",
      "Break down by department",
      "Add time filter for last quarter", 
      "Show by learning pathway",
      "Compare with previous period",
      "Export to dashboard",
      "Save this visualization",
      "Drill down by role",
      "Add completion rate metric",
      "Filter by skill category"
    ];
    
    return allSuggestions.slice(0, 3);
  };

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user", 
      content: query,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsTyping(true);
    setShowSuggestions(false);

    // Simulate AI processing with realistic delay
    setTimeout(() => {
      // Use enhanced contextual response generation
      const contextualResponse = generateContextualResponse(query);
      const visualization = generateVisualization(query);
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "assistant",
        content: contextualResponse.response,
        timestamp: new Date(),
        visualization,
        suggestions: visualization ? getSuggestions(query) : contextualResponse.suggestions
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (actionQuery: string) => {
    setQuery(actionQuery);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderChart = (viz: VisualizationData) => {
    const maxValue = Math.max(...viz.data.map(d => Math.max(d.rate || 0, d.gap || 0, d.growth || 0, d.engagement || 0, d.learners/10 || 0)));
    
    return (
      <div className="bg-white border rounded-lg p-4">
        <div className="h-48 flex items-end justify-around gap-1">
          {viz.data.map((item, idx) => {
            let value = item.rate || item.gap || item.growth || item.engagement || item.learners/10 || 50;
            const height = Math.max((value / maxValue) * 160, 12);
            
            return (
              <div key={idx} className="flex flex-col items-center flex-1 max-w-16">
                <div 
                  className={cn(
                    "rounded-t-sm w-full mb-1 flex items-end justify-center text-xs text-white font-medium transition-all duration-300 hover:opacity-80",
                    viz.type === "bar" ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                    viz.type === "line" ? "bg-gradient-to-r from-green-500 to-green-600" :
                    "bg-gradient-to-r from-purple-500 to-purple-600"
                  )}
                  style={{ height: `${height}px` }}
                >
                  <span className="text-xs mb-1">{Math.round(value)}</span>
                </div>
                <div className="text-xs text-center text-gray-600 leading-tight px-1">
                  {(item.name || item.month || `Item ${idx + 1}`).substring(0, 8)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVisualization = (message: ChatMessage) => {
    if (!message.visualization) return null;
    
    const viz = message.visualization;
    
    return (
      <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        {/* Visualization Header */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Creating new visualization...</span>
        </div>
        
        {/* Chart Details */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">{viz.title}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Metrics: {viz.metrics.join(", ")}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Attributes: {viz.attributes.join(", ")}</Badge>  
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Filters: {viz.filters.join(", ")}</Badge>
              </div>
            </div>
          </div>

          {/* Chart Rendering */}
          {renderChart(viz)}

          {/* Chart Controls */}
          {viz.canModify && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="text-xs h-7">
                <BarChart3 className="h-3 w-3 mr-1" />
                Switch to bar chart
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7">
                <LineChart className="h-3 w-3 mr-1" />
                Show trend
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7">
                <Users className="h-3 w-3 mr-1" />
                Break down by department
              </Button>
            </div>
          )}

          {/* Save Options */}
          {viz.saveOptions && (
            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  <BookmarkPlus className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open in Analyse
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "fixed bottom-6 right-6 w-[480px] bg-white rounded-xl shadow-2xl border z-50 transition-all duration-300 animate-scale-in",
        isMinimized ? "h-16" : "h-[700px]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold">AI Analytics Assistant</span>
              <div className="text-xs text-blue-100">Powered by Degreed Intelligence</div>
            </div>
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
          <div className="flex flex-col h-[calc(100%-64px)]">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.length === 1 && chatMessages[0].type === 'assistant' && (
                <div className="text-center space-y-4 py-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl text-gray-800">Hi there,</h3>
                    <h3 className="font-semibold text-xl text-gray-800">How can I help you?</h3>
                  </div>
                  
                  <div className="grid gap-2">
                    {quickActions.map((action, idx) => (
                      <Button 
                        key={idx}
                        variant="outline" 
                        size="sm"
                        className="justify-start h-10 text-sm"
                        onClick={() => handleQuickAction(action.query)}
                      >
                        <action.icon className="h-4 w-4 mr-3" />
                        {action.label}
                      </Button>
                    ))}
                  </div>

                  {/* <div className="pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Answer a business question</p>
                    <div className="space-y-2">
                      {sampleQueries.slice(0, 2).map((sample, idx) => (
                        <button
                          key={idx}
                          className="block w-full text-left p-2 text-xs text-gray-600 hover:bg-gray-50 rounded border border-gray-200 transition-colors"
                          onClick={() => handleQuickAction(sample)}
                        >
                          {sample}
                        </button>
                      ))}
                    </div>
                  </div> */}
                </div>
              )}

              {chatMessages.map((message) => (
                <div key={message.id} className={cn("flex gap-3", message.type === "user" ? "justify-end" : "justify-start")}>
                  {message.type === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 mt-1">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={cn("max-w-[85%] space-y-3", message.type === "user" ? "order-2" : "")}>
                    <div className={cn(
                      "p-3 rounded-lg text-sm whitespace-pre-wrap",
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-sm"
                        : "bg-gray-50 border rounded-bl-sm"
                    )}>
                      {message.content}
                    </div>
                    
                    {renderVisualization(message)}
                    
                    {/* {message.suggestions && message.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-medium">Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>
                  
                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center shrink-0 order-1 mt-1">
                      <span className="text-white font-medium text-xs">U</span>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-50 border p-3 rounded-lg rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                    placeholder="Ask here..."
                    className="pr-10"
                  />
                  {query && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-6 w-6 p-0"
                      onClick={() => setQuery("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Button 
                  onClick={handleSendQuery}
                  disabled={!query.trim()}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 text-center mt-2">
                All assistants can make mistakes. Check before relying on these answers.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
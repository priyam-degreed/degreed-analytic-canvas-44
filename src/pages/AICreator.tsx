import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Send, 
  Plus,
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
  Lightbulb,
  MoreVertical,
  RotateCcw,
  ArrowLeft
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
  feedback?: "up" | "down" | null;
}

interface VisualizationData {
  id: string;
  type: "column" | "bar" | "line" | "pie" | "heatmap" | "treemap";
  title: string;
  metrics: string[];
  attributes: string[];
  filters: string[];
  data: any[];
  canModify?: boolean;
  saveOptions?: boolean;
}

// Enhanced NLP sample queries based on the business questions
const sampleQueries = [
  "Which part of the organization has the highest and lowest completion rate on assigned learning?",
  "What's driving the completion rate on assigned learning?",
  "How many learning assignments are past due?",
  "Are users developing skills that are endorsed?",
  "How are users developing their skills?",
  "Which category of learning has the highest completion rate?",
  "Which learning provider has gained the most user satisfaction?",
  "Show completion rate by Org Unit for last 90 days",
  "What are the top 5 skills trending for 6 months period?",
  "Show learning engagement by job role over time"
];

const quickActions = [
  { icon: Search, label: "Search dashboards", query: "Show me learning engagement dashboards" },
  { icon: Plus, label: "Create visualization", query: "Create a chart showing course completion rates" },
  { icon: TrendingUp, label: "Answer a business question", query: "What is the learning completion rate by Pathway?" }
];

export default function AICreator() {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [visualizationToSave, setVisualizationToSave] = useState<VisualizationData | null>(null);
  const [visualizationName, setVisualizationName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle reset - clear conversation and start new chat
  const handleReset = () => {
    setChatMessages([]);
    setQuery("");
    setIsTyping(false);
    // Re-initialize with welcome message
    setTimeout(() => {
      setChatMessages([{
        id: '1',
        type: 'assistant',
        content: 'Hi there,\n\nHow can I help you?',
        timestamp: new Date()
      }]);
    }, 100);
  };

  useEffect(() => {
    if (chatMessages.length === 0) {
      // Initialize with welcome message
      setChatMessages([{
       id: '1',
       type: 'assistant',
       content: 'Hi there,\n\nHow can I help you create insights and visualizations for your data?',
       timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Enhanced NLP parsing and data model mapping
  const parseNLQuery = (queryText: string) => {
    const lowerQuery = queryText.toLowerCase();
    
    // Data model mapping from NLP objectives
    const dataModel = {
      facts: {
        'assignments completed': 'assignmentsCompleted',
        'assignments assigned': 'assignmentsAssigned', 
        'assignments past due': 'assignmentsPastDue',
        'completion rate': 'completionRate',
        'endorsed skill events': 'endorsedSkillEvents',
        'skill development events': 'skillDevelopmentEvents',
        'endorsed skill %': 'endorsedSkillPercent',
        'satisfaction score': 'satisfactionScore',
        'avg satisfaction': 'avgSatisfaction'
      },
      attributes: {
        'org unit': 'orgUnit',
        'organization': 'orgUnit',
        'role': 'role',
        'job role': 'role',
        'region': 'region',
        'provider': 'provider',
        'category': 'category',
        'skill': 'skill',
        'development method': 'developmentMethod',
        'assignment status': 'assignmentStatus',
        'time': 'time'
      }
    };
    
    return { lowerQuery, dataModel };
  };

  const generateVisualization = (queryText: string): VisualizationData | null => {
    const { lowerQuery, dataModel } = parseNLQuery(queryText);
    
    // Primary NLP questions from business requirements
    
    // 1. "Which part of the organization has the highest and lowest completion rate on assigned learning?"
    if ((lowerQuery.includes("organization") || lowerQuery.includes("org")) && 
        lowerQuery.includes("completion rate") && 
        (lowerQuery.includes("highest") || lowerQuery.includes("lowest"))) {
      return {
        id: `viz-${Date.now()}`,
        type: "bar",
        title: "Completion Rate for Assigned Learning by Org Unit",
        metrics: ["Completion Rate %", "Assignments Completed", "Assignments Assigned"],
        attributes: ["Org Unit", "Job Role"],
        filters: ["Assigned Learning", "All Org Units", "Current Period"],
        data: [
          { name: "Associate UI Engineer", rate: 100.0, completed: 45, assigned: 45, orgUnit: "Product Design" },
          { name: "Web Designer", rate: 60.7, completed: 17, assigned: 28, orgUnit: "Product Design" },
          { name: "Civil Engineer", rate: 57.9, completed: 22, assigned: 38, orgUnit: "Infrastructure" },
          { name: "Mobile Developer", rate: 55.4, completed: 31, assigned: 56, orgUnit: "Engineering" },
          { name: "Software Engineer", rate: 50.0, completed: 89, assigned: 178, orgUnit: "Engineering" },
          { name: "Content Creator", rate: 47.8, completed: 11, assigned: 23, orgUnit: "Marketing" },
          { name: "Data Analyst", rate: 41.9, completed: 18, assigned: 43, orgUnit: "Analytics" },
          { name: "Database Administrator", rate: 33.3, completed: 12, assigned: 36, orgUnit: "IT Operations" }
        ],
        canModify: true,
        saveOptions: true
      };
    }

    // Default fallback visualization
    return {
      id: `viz-${Date.now()}`,
      type: "column",
      title: "Learning Analytics Overview",
      metrics: ["Completion Rate", "Enrollments", "Progress"],
      attributes: ["Time Period", "Category"],
      filters: ["All Data", "Current Period"],
      data: [
        { name: "Jan", completions: 45, enrollments: 120, progress: 78 },
        { name: "Feb", completions: 52, enrollments: 134, progress: 82 },
        { name: "Mar", completions: 48, enrollments: 145, progress: 75 },
        { name: "Apr", completions: 61, enrollments: 156, progress: 88 },
        { name: "May", completions: 55, enrollments: 142, progress: 81 }
      ],
      canModify: true,
      saveOptions: true
    };
  };


  const getSuggestions = (queryText: string): string[] => {
    const lowerQuery = queryText.toLowerCase();
    
    if (lowerQuery.includes("completion rate")) {
      return [
        "Filter to Region = APAC",
        "Add assignment status breakdown", 
        "Compare with previous year",
        "Show by learning category",
        "Save as 'Past Due Tracking'"
      ];
    }
    
    return [
      "Show trending skills for Q4",
      "Compare learning providers",
      "Filter by job role",
      "Show skill development methods",
      "Export to dashboard"
    ];
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

    // Simulate AI processing delay
    setTimeout(() => {
      const visualization = generateVisualization(query);
      const aiResponse = generateContextualResponse(query);
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant", 
        content: aiResponse.response,
        timestamp: new Date(),
        visualization: visualization || aiResponse.visualization,
        suggestions: aiResponse.suggestions
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (actionQuery: string) => {
    setQuery(actionQuery);
    setTimeout(() => handleSendQuery(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setTimeout(() => handleSendQuery(), 100);
  };

  // Enhanced chart type switching with more options
  const handleChartTypeSwitch = (messageId: string, newType: "column" | "bar" | "line" | "pie" | "heatmap" | "treemap") => {
    setChatMessages(prev => prev.map(message => {
      if (message.id === messageId && message.visualization) {
        return {
          ...message,
          visualization: {
            ...message.visualization,
            type: newType,
            title: newType === "column" ? 
              message.visualization.title.replace(/Bar Chart|Line Chart|Pie Chart|Analysis/gi, "Column Chart") :
              newType === "bar" ?
              message.visualization.title.replace(/Column Chart|Line Chart|Pie Chart|Analysis/gi, "Bar Chart") :
              newType === "line" ? 
              message.visualization.title.replace(/Bar Chart|Column Chart|Pie Chart|Analysis/gi, "Line Chart") :
              newType === "heatmap" ?
              message.visualization.title.replace(/Chart|Analysis/gi, "Heatmap") :
              newType === "treemap" ?
              message.visualization.title.replace(/Chart|Analysis/gi, "Treemap") :
              message.visualization.title
          }
        };
      }
      return message;
    }));
  };

  const renderChart = (viz: VisualizationData) => {
    // Simplified chart rendering for demo
    return (
      <div className="bg-card border border-border rounded-lg p-4 h-64 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-2" />
          <p className="font-medium">{viz.title}</p>
          <p className="text-sm">Chart visualization would render here</p>
        </div>
      </div>
    );
  };

  const renderVisualization = (viz: VisualizationData, messageId: string) => {
    return (
      <div className="mt-4 border border-border rounded-lg bg-card">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">{viz.title}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {viz.metrics.slice(0, 2).map(metric => (
                <Badge key={metric} variant="secondary" className="text-xs">
                  {metric}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Chart Type Switcher */}
          <div className="flex items-center gap-1">
            <Button 
              variant={viz.type === "column" ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => handleChartTypeSwitch(messageId, "column")}
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Column
            </Button>
            <Button 
              variant={viz.type === "bar" ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => handleChartTypeSwitch(messageId, "bar")}
            >
              <Activity className="h-3 w-3 mr-1" />
              Bar
            </Button>
            <Button 
              variant={viz.type === "line" ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => handleChartTypeSwitch(messageId, "line")}
            >
              <LineChart className="h-3 w-3 mr-1" />
              Line
            </Button>
            <Button 
              variant={viz.type === "pie" ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => handleChartTypeSwitch(messageId, "pie")}
            >
              <PieChart className="h-3 w-3 mr-1" />
              Pie
            </Button>
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-4">
          {renderChart(viz)}
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setVisualizationToSave(viz);
                setVisualizationName(viz.title);
                setShowSaveDialog(true);
              }}
            >
              <BookmarkPlus className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard-builder')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open in Builder
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Create with AI
              </h1>
              <p className="text-sm text-muted-foreground">
                Ask questions and generate insights from your data
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Chat
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Quick Actions */}
        {chatMessages.length <= 1 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleQuickAction(action.query)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <action.icon className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium text-sm">{action.label}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {action.query.slice(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-6 mb-6">
          {chatMessages.map((message) => (
            <div key={message.id} className={cn(
              "flex gap-4",
              message.type === "user" ? "justify-end" : "justify-start"
            )}>
              {message.type === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              
              <div className={cn(
                "max-w-3xl",
                message.type === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border",
                "rounded-lg p-4"
              )}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                
                {message.visualization && (
                  renderVisualization(message.visualization, message.id)
                )}
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Suggested follow-ups:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-6"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {message.type === "assistant" && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {message.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-card border border-border rounded-lg p-4 max-w-3xl">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="sticky bottom-0 bg-background border-t border-border pt-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendQuery()}
                placeholder="Ask me anything about your learning data..."
                className="pr-12"
              />
              <Button
                size="sm"
                onClick={handleSendQuery}
                disabled={!query.trim() || isTyping}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* Sample Queries */}
          {chatMessages.length <= 1 && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.slice(0, 3).map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleQuickAction(sample)}
                  >
                    {sample.slice(0, 50)}...
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Visualization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="viz-name">Visualization Name</Label>
              <Input
                id="viz-name"
                value={visualizationName}
                onChange={(e) => setVisualizationName(e.target.value)}
                placeholder="Enter a name for your visualization"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Visualization Saved",
                  description: `"${visualizationName}" has been saved to your dashboards.`,
                });
                setShowSaveDialog(false);
              }}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

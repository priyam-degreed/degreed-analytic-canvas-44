import { useState } from "react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  MessageSquare, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Lightbulb,
  Send,
  Sparkles
} from "lucide-react";
import { aiInsightsData } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ChatMessage {
  type: "user" | "assistant";
  content: string;
}

export default function AIInsights() {
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: "assistant",
      content: "Hello! I'm your AI Analytics Assistant. I can help you explore learning data, identify trends, and answer questions about your workforce development. What would you like to know?"
    }
  ]);

  const handleSendQuery = () => {
    if (!query.trim()) return;

    // Add user message
    const userMessage: ChatMessage = { type: "user", content: query };
    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on the data, I can see that learning completions increased by 29% this quarter. The main drivers are Developer and SDET roles showing significant engagement.",
        "Python skills show interesting patterns - while 40% of users have it on their profile, only 15% demonstrate expert-level proficiency. This suggests a skills development opportunity.",
        "Cloud Computing is trending upward with 87 hours of recent activity. I'd recommend expanding course offerings in this area.",
        "Skill plan adoption has grown to 52% of users, up from 37% last quarter. The momentum is strong - consider promoting this success."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const aiMessage: ChatMessage = { type: "assistant", content: randomResponse };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setQuery("");
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case "skill_gap":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "engagement":
        return <Target className="h-5 w-5 text-success" />;
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-accent" />;
      default:
        return <Brain className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-success";
    if (confidence >= 0.8) return "text-accent";
    return "text-warning";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Analytics Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Intelligent insights and conversational analytics for your learning data
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-success">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            AI Assistant Online
          </div>
        </div>
      </div>

      {/* AI Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Panel */}
        <ChartCard
          title="Natural Language Query"
          subtitle="Ask questions about your learning and skills data"
          className="lg:col-span-2"
          actions={false}
        >
          <div className="space-y-4">
            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto space-y-3 p-4 bg-muted/20 rounded-lg">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Brain className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-lg text-sm",
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <span className="text-accent-foreground font-medium text-sm">U</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Query Input */}
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me about learning trends, skills gaps, or user engagement..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
              />
              <Button onClick={handleSendQuery} disabled={!query.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Queries */}
            <div className="flex flex-wrap gap-2">
              {[
                "Show me learning completion trends",
                "What skills have the biggest gaps?", 
                "Which roles are most engaged?",
                "Recommend focus areas for Q4"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* AI Insights Panel */}
        <ChartCard
          title="Smart Search"
          subtitle="AI-powered content discovery"
          actions={false}
        >
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for dashboards, metrics..."
                className="pl-10"
              />
            </div>

            {/* Recent Searches */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</h4>
              <div className="space-y-2">
                {[
                  "Python skills dashboard",
                  "Learning completion by role",
                  "Q3 strategic overview",
                  "Skills adoption trends"
                ].map((search) => (
                  <div
                    key={search}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer text-sm"
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <span>{search}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Actions */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Suggested Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Identify Trends
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Skills Gap Analysis
                </Button>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* AI-Generated Insights */}
      <ChartCard
        title="AI-Generated Insights"
        subtitle="Automated discoveries from your learning and skills data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsightsData.map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-gradient-card hover:shadow-md transition-fast"
            >
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <span className={cn("font-medium", getConfidenceColor(insight.confidence))}>
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                      <span className={cn(
                        "px-2 py-1 rounded-md font-medium",
                        insight.impact === 'high' 
                          ? 'bg-accent/10 text-accent' 
                          : 'bg-warning/10 text-warning'
                      )}>
                        {insight.impact} impact
                      </span>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Explore
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* AI Analytics Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard
          title="Trend Detection"
          subtitle="Automated pattern recognition"
          actions={false}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Learning velocity increasing</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Skills diversity expanding</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span>Engagement plateau detected</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Predictive Analytics"
          subtitle="Future performance forecasting"
          actions={false}
        >
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">425</div>
              <div className="text-sm text-muted-foreground">Predicted completions next month</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Based on current trends and seasonal patterns
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Anomaly Detection"
          subtitle="Unusual patterns identified"
          actions={false}
        >
          <div className="space-y-3">
            <div className="p-2 bg-warning/10 rounded-md">
              <div className="text-sm font-medium text-warning">Unusual Activity</div>
              <div className="text-xs text-muted-foreground">
                SDET role showing 97% completion increase
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Last detected: 2 hours ago
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
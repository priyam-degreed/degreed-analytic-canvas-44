import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Clock,
  TrendingUp, 
  BarChart3,
  Users,
  BookOpen,
  Target,
  Award,
  Brain,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchResult, searchWithAI, recentSearches, suggestedQueries } from "@/data/searchData";

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (result: SearchResult) => void;
}


export function SmartSearch({ isOpen, onClose, onSelect }: SmartSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true);
      // Use AI-powered search with realistic delay
      setTimeout(() => {
        const searchResults = searchWithAI(query, 8);
        setResults(searchResults);
        setIsLoading(false);
      }, 400);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (onSelect) {
      onSelect(result);
    } else {
      navigate(result.path);
    }
    onClose();
  };

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dashboard": return BarChart3;
      case "visualization": return TrendingUp;
      case "insight": return Brain;
      case "content": return BookOpen;
      default: return Search;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      dashboard: "bg-blue-100 text-blue-800",
      visualization: "bg-green-100 text-green-800", 
      insight: "bg-purple-100 text-purple-800",
      metric: "bg-orange-100 text-orange-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-background rounded-xl shadow-2xl border border-border z-50 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dashboards, metrics, analytics..."
              className="pl-10 h-12 text-lg border-0 focus-visible:ring-0 bg-muted/50"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[600px] overflow-y-auto">
          {query.length === 0 ? (
            /* Empty State */
            <div className="p-6 space-y-6">
              {/* Suggested Queries */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Suggested searches</h3>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedQueries.map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-3 p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => handleSuggestedQuery(suggestion.query)}
                    >
                      <suggestion.icon className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">{suggestion.query}</div>
                        <div className="text-xs text-gray-500">{suggestion.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Recent searches</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setQuery(search)}
                    >
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isLoading ? (
            /* Loading State */
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
                <span className="text-gray-600">Searching...</span>
              </div>
            </div>
          ) : results.length > 0 ? (
            /* Results */
            <div className="p-6 space-y-3">
              <div className="text-sm text-muted-foreground mb-4">
                Found {results.length} results for "{query}" 
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  AI-powered
                </span>
              </div>
              
              {results.map((result) => {
                const IconComponent = result.icon;
                return (
                  <Card 
                    key={result.id}
                    className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] border-l-4 border-l-primary"
                    onClick={() => handleResultClick(result)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-foreground">{result.title}</h3>
                            <Badge className={cn("text-xs", getTypeBadge(result.type))}>
                              {result.type}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {result.description}
                          </p>
                          
                          {result.tags && (
                            <div className="flex gap-2 mt-2">
                              {result.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-muted-foreground">{result.category}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>{result.relevance}% match</span>
                              <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* No Results */
            <div className="p-6 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No results found</h3>
              <p className="text-sm text-muted-foreground">
                Try searching for "learning analytics", "skill trends", or "engagement metrics"
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
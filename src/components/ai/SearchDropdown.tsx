import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
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

interface SearchDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (result: SearchResult) => void;
  onSuggestedQuery: (query: string) => void;
}

export function SearchDropdown({ query, isOpen, onClose, onSelect, onSuggestedQuery }: SearchDropdownProps) {
  const navigate = useNavigate();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true);
      // Use AI-powered search with realistic delay
      setTimeout(() => {
        const searchResults = searchWithAI(query, 6);
        setResults(searchResults);
        setIsLoading(false);
      }, 300);
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
    <div className="absolute top-full left-0 right-0 mt-1 bg-background rounded-lg shadow-2xl border border-border z-50 max-h-[500px] overflow-y-auto">
      {query.length === 0 ? (
        /* Empty State - Suggestions */
        <div className="p-4 space-y-4">
          {/* Suggested Queries */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Suggested searches</h4>
            <div className="space-y-1">
              {suggestedQueries.slice(0, 4).map((suggestion, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-3 w-full p-2 text-left hover:bg-accent rounded-md transition-colors"
                  onClick={() => onSuggestedQuery(suggestion.query)}
                >
                  <suggestion.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{suggestion.query}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent searches</h4>
            <div className="space-y-1">
              {recentSearches.slice(0, 3).map((search, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-3 w-full p-2 text-left hover:bg-accent rounded-md transition-colors"
                  onClick={() => onSuggestedQuery(search)}
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{search}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : isLoading ? (
        /* Loading State */
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Searching...</span>
          </div>
        </div>
      ) : results.length > 0 ? (
        /* Results */
        <div className="p-2">
          <div className="text-xs text-muted-foreground mb-3 px-2">
            Found {results.length} results for "{query}"
            <span className="ml-2 bg-primary/10 text-primary px-2 py-1 rounded-full">
              AI-powered
            </span>
          </div>
          
          <div className="space-y-1">
            {results.map((result) => {
              const IconComponent = result.icon;
              return (
                <button
                  key={result.id}
                  className="w-full text-left p-3 hover:bg-accent rounded-lg transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-foreground text-sm">{result.title}</h4>
                        <Badge className={cn("text-xs", getTypeBadge(result.type))}>
                          {result.type}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {result.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{result.category}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{result.relevance}% match</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* No Results */
        <div className="p-6 text-center">
          <div className="text-sm font-medium text-foreground mb-1">No results found</div>
          <p className="text-xs text-muted-foreground">
            Try "learning metrics", "engagement trends", or "skill analytics"
          </p>
        </div>
      )}
    </div>
  );
}
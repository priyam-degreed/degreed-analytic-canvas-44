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

  // Only show dropdown if there are search results
  if (!isOpen || query.length === 0 || (!isLoading && results.length === 0)) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[400px] overflow-y-auto">
      {isLoading ? (
        /* Loading State */
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
            <span className="text-sm text-gray-600">Searching...</span>
          </div>
        </div>
      ) : (
        /* Results */
        <div className="p-1">
          {results.map((result) => {
            const IconComponent = result.icon;
            return (
              <button
                key={result.id}
                className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                onClick={() => handleResultClick(result)}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <IconComponent className="h-4 w-4 text-gray-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{result.title}</div>
                  <div className="text-xs text-gray-500 mt-1">Feb 10</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
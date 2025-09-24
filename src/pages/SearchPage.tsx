import { useState } from "react";
import { Search } from "lucide-react"; 
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchWithAI } from "@/data/searchData";
import { SmartSearch } from "@/components/ai/SmartSearch";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (query: string) => {
    if (!query) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const searchResults = searchWithAI(query);
      setResults(searchResults);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="text-muted-foreground">Find dashboards, metrics, and analytics across the platform.</p>
      </div>
      
      <div className="max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dashboards, metrics, analytics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-pulse">Searching...</div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {results.length} results for "{searchQuery}"
          </p>
          <div className="grid gap-4">
            {results.map((result: any) => (
              <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <result.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{result.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{result.type}</Badge>
                        <Badge variant="outline">{result.category}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isLoading && searchQuery && results.length === 0 && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-medium mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground">
            Try different keywords or explore our suggested searches.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
import { ExternalLink, Loader2 } from 'lucide-react';

interface SearchResult {
  url: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  currentUrl?: string;
}

export function SearchResults({ results, loading, currentUrl }: SearchResultsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Search Results</h3>
      
      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="rounded-lg border bg-card p-4 shadow-sm">
            <h4 className="font-medium line-clamp-1">{result.title}</h4>
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
            >
              <span className="truncate max-w-md">{result.url}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {result.content}
            </p>
          </div>
        ))}
        
        {loading && (
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {currentUrl ? `Analyzing ${currentUrl}...` : 'Loading more results...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
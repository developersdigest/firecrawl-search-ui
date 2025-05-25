import { ExternalLink, Clock, FileText, User, Calendar } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  url: string;
  content: string;
  author?: string;
  publishedDate?: string;
  readingTime: number;
  wordCount: number;
}

export function ArticleCard({ 
  title, 
  url, 
  content, 
  author, 
  publishedDate, 
  readingTime, 
  wordCount 
}: ArticleCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
          >
            <span className="truncate max-w-xs">{url}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {author && (
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
          )}
          {publishedDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(publishedDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>{wordCount.toLocaleString()} words</span>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <p className="line-clamp-4 text-muted-foreground">
            {content.substring(0, 300)}...
          </p>
        </div>
      </div>
    </div>
  );
}
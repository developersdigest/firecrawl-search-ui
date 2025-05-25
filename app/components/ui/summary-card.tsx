import { FileText, Sparkles } from 'lucide-react';

interface SummaryCardProps {
  summary: string;
  keyPoints?: string[];
  sourceCount?: number;
}

export function SummaryCard({ summary, keyPoints, sourceCount }: SummaryCardProps) {
  return (
    <div className="rounded-lg border bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800 p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Summary</h3>
        {sourceCount && (
          <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">
            Based on {sourceCount} sources
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {summary}
        </p>
        
        {keyPoints && keyPoints.length > 0 && (
          <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Key Points</span>
            </h4>
            <ul className="space-y-2">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
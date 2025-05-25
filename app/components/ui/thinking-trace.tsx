import { Brain } from 'lucide-react';

interface ThinkingTraceProps {
  thoughts: string[];
  isThinking?: boolean;
}

export function ThinkingTrace({ thoughts, isThinking = false }: ThinkingTraceProps) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 p-4 mb-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className={`h-5 w-5 text-blue-600 dark:text-blue-400 ${isThinking ? 'animate-pulse' : ''}`} />
          <span className="font-medium text-sm text-blue-900 dark:text-blue-100">
            {isThinking ? 'Thinking...' : 'Thought Process'}
          </span>
        </div>
      </div>
      
      <div className="mt-3 space-y-2">
        {thoughts.map((thought, index) => (
          <div
            key={index}
            className="text-sm text-blue-800 dark:text-blue-200 pl-7 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            • {thought}
          </div>
        ))}
        {isThinking && (
          <div className="text-sm text-blue-600 dark:text-blue-400 pl-7 flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
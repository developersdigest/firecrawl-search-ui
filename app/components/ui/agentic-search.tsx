import { Search, Globe, Brain, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';

interface SearchIteration {
  query: string;
  sources: Source[];
  bulletPoints: string[];
  confidence: number;
  reasoning?: string;
}

interface Source {
  url: string;
  title: string;
  snippet?: string;
  scraped?: boolean;
}

interface AgenticSearchProps {
  request: string;
  iterations: SearchIteration[];
  isSearching: boolean;
  currentPhase?: 'thinking' | 'searching' | 'scraping' | 'summarizing' | 'assessing';
  showMore?: boolean;
  finalSummary?: string;
  allSources?: Source[];
}

export function AgenticSearch({ 
  request, 
  iterations, 
  isSearching, 
  currentPhase,
  showMore = false,
  finalSummary,
  allSources = []
}: AgenticSearchProps) {
  return (
    <div className="rounded-2xl glass shadow-xl p-6 mb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <Search className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Research Agent</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{request}</p>
        </div>
      </div>

      {/* Search Container - Fixed Height with Scroll */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 max-h-96 overflow-y-auto custom-scrollbar backdrop-blur-sm">
        <div className="p-4 space-y-4">
          {iterations.map((iteration, index) => (
            <div key={index} className="space-y-3">
              {/* Search Query */}
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                  <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Search #{index + 1}: <span className="text-purple-600 dark:text-purple-400">&quot;{iteration.query}&quot;</span>
                </span>
              </div>

              {/* Sources */}
              {iteration.sources.length > 0 && (
                <div className="pl-6 space-y-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Found {iteration.sources.length} sources
                  </div>
                  <div className="space-y-1">
                    {iteration.sources.slice(0, showMore ? undefined : 5).map((source, sourceIndex) => (
                      <div
                        key={sourceIndex}
                        className={`text-xs p-2 rounded-lg border transition-all duration-300 ${
                          source.scraped
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate flex-1">{source.title}</span>
                          {source.scraped && (
                            <span className="text-green-600 dark:text-green-400 ml-2">🔥</span>
                          )}
                        </div>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                        >
                          <span className="truncate">{new URL(source.url).hostname}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </div>
                    ))}
                    {!showMore && iteration.sources.length > 5 && (
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1">
                        <ChevronRight className="h-3 w-3" />
                        <span>See {iteration.sources.length - 5} more</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Bullet Points */}
              {iteration.bulletPoints.length > 0 && (
                <div className="pl-6 space-y-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Key findings:</div>
                  {iteration.bulletPoints.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-start space-x-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Confidence Assessment */}
              {iteration.confidence > 0 && (
                <div className="pl-6 flex items-center space-x-2">
                  <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded">
                    <Brain className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Confidence:</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-xs">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            iteration.confidence >= 80 ? 'bg-green-500' :
                            iteration.confidence >= 60 ? 'bg-yellow-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${iteration.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{iteration.confidence}%</span>
                    </div>
                    {iteration.reasoning && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{iteration.reasoning}</p>
                    )}
                  </div>
                </div>
              )}

              {index < iterations.length - 1 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3" />
              )}
            </div>
          ))}

          {/* Current Phase Indicator */}
          {isSearching && currentPhase && (
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="relative">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                <div className="absolute inset-0 animate-ping h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full opacity-30" />
              </div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {currentPhase === 'thinking' && '🤔 Analyzing your request...'}
                {currentPhase === 'searching' && '🔍 Searching for relevant sources...'}
                {currentPhase === 'scraping' && '🔥 Extracting content with Firecrawl...'}
                {currentPhase === 'summarizing' && '✨ Generating insights...'}
                {currentPhase === 'assessing' && '🧠 Evaluating confidence level...'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Final Summary */}
      {finalSummary && (
        <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-inner">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Research Complete</h4>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
            {finalSummary}
          </div>
          
          {/* All Sources */}
          {allSources.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                View all {allSources.length} sources
              </summary>
              <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                {allSources.map((source, index) => (
                  <div key={index} className="text-xs">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {index + 1}. {source.title}
                    </a>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
'use client';

import { Search, Globe, FileSearch, Sparkles, Check, Loader2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface SearchStep {
  type: 'query' | 'searching' | 'found' | 'analyzing' | 'complete';
  content?: string;
  sources?: Source[];
  selectedSources?: string[];
}

interface Source {
  url: string;
  title: string;
  snippet?: string;
  analyzed?: boolean;
  content?: string;
}

interface SearchProcessProps {
  steps: SearchStep[];
  currentStep: number;
}

export function SearchProcess({ steps, currentStep }: SearchProcessProps) {
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());

  const toggleSource = (url: string) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(url)) {
      newExpanded.delete(url);
    } else {
      newExpanded.add(url);
    }
    setExpandedSources(newExpanded);
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isActive = index <= currentStep;
        const isCurrent = index === currentStep;

        return (
          <div
            key={index}
            className={`transition-all duration-500 ${
              isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {step.type === 'query' && (
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
                <Search className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Search Query</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">&quot;{step.content}&quot;</p>
                </div>
              </div>
            )}

            {step.type === 'searching' && (
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-950/30 border border-gray-200 dark:border-gray-800">
                <Globe className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${isCurrent ? 'animate-spin' : ''}`} />
                <p className="text-sm text-gray-700 dark:text-gray-300">Searching the web...</p>
              </div>
            )}

            {step.type === 'found' && step.sources && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-3">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Found {step.sources.length} sources
                  </p>
                </div>
                <div className="space-y-2">
                  {step.sources.map((source, sourceIndex) => {
                    const isExpanded = expandedSources.has(source.url);
                    const isSelected = step.selectedSources?.includes(source.url);
                    
                    return (
                      <div
                        key={sourceIndex}
                        className={`rounded-md border transition-all duration-300 ${
                          isSelected 
                            ? 'border-green-400 dark:border-green-600 bg-green-100/50 dark:bg-green-900/20' 
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                        }`}
                      >
                        <div
                          className="p-3 cursor-pointer"
                          onClick={() => toggleSource(source.url)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                {isSelected && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                )}
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                                  {source.title}
                                </h4>
                              </div>
                              <a 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-flex items-center space-x-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="truncate max-w-xs">{source.url}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              {source.analyzed && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                          </div>
                          {source.snippet && !isExpanded && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                              {source.snippet}
                            </p>
                          )}
                        </div>
                        {isExpanded && source.content && (
                          <div className="px-3 pb-3 pt-0">
                            <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded p-3 max-h-40 overflow-y-auto">
                              {source.content}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step.type === 'analyzing' && (
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border border-orange-200 dark:border-orange-800">
                <div className="relative">
                  <FileSearch className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1">
                      <span className="text-lg animate-bounce">🔥</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    Analyzing with Firecrawl
                  </p>
                  {step.content && (
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">{step.content}</p>
                  )}
                </div>
                {isCurrent && (
                  <Loader2 className="h-4 w-4 text-orange-600 dark:text-orange-400 animate-spin" />
                )}
              </div>
            )}

            {step.type === 'complete' && (
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Analysis complete! Generating summary...
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
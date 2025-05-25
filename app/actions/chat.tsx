'use server';

import { streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { FirecrawlClient } from '@/app/lib/firecrawl';
import { LoadingCard } from '@/app/components/ui/loading-card';
import { WeatherCard } from '@/app/components/ui/weather-card';
import { ArticleCard } from '@/app/components/ui/article-card';
import { ThinkingTrace } from '@/app/components/ui/thinking-trace';
import { SearchProcess } from '@/app/components/ui/search-process-simple';
import { SummaryCard } from '@/app/components/ui/summary-card';
import { AgenticSearch } from '@/app/components/ui/agentic-search';

export async function streamChat(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }> = []) {
  const result = await streamUI({
    model: openai('gpt-4'),
    system: `You are a helpful AI assistant that can search the web and analyze content. 
When using tools, always provide additional context and analysis after the tool results.
After searching or analyzing, always summarize the findings and provide your own insights.`,
    messages: [...history, { role: 'user', content: message }],
    text: ({ content, done }) => {
      if (done) {
        return <div className="prose prose-sm max-w-none">{content}</div>;
      }
      return <div className="prose prose-sm max-w-none">{content}</div>;
    },
    tools: {
      weather: {
        description: 'Get weather information for a city',
        parameters: z.object({
          city: z.string().describe('The city name'),
        }),
        generate: async function* ({ city }) {
          yield <LoadingCard message={`Fetching weather for ${city}...`} />;
          
          // Simulate weather API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const weather = {
            city,
            temperature: Math.floor(Math.random() * 30) + 10,
            condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 50) + 30,
            windSpeed: Math.floor(Math.random() * 20) + 5,
          };
          
          return <WeatherCard weather={weather} />;
        },
      },
      searchWeb: {
        description: 'Search the web with intelligent multi-iteration research loop',
        parameters: z.object({
          query: z.string().describe('The search query or request'),
          limit: z.number().optional().default(5).describe('Number of results per search'),
        }),
        generate: async function* ({ query, limit }) {
          try {
            interface SearchIteration {
              query: string;
              sources: Array<{url: string; title: string; scraped?: boolean}>;
              bulletPoints: string[];
              confidence: number;
              reasoning: string;
            }
            const iterations: SearchIteration[] = [];
            const allSources: Array<{url: string; title: string; scraped?: boolean}> = [];
            let overallConfidence = 0;
            const maxIterations = 3;
            
            // Initial yield with thinking phase
            yield (
              <AgenticSearch
                request={query}
                iterations={iterations}
                isSearching={true}
                currentPhase="thinking"
              />
            );
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const firecrawl = new FirecrawlClient();
          
          // Analyze the request first
          const requestAnalysis = await generateText({
            model: openai('gpt-4-turbo'),
            prompt: `Analyze this search request: "${query}"

Provide:
1. A clear, specific search query (max 5 words)
2. Key topics to look for
3. Expected information type

Format as:
QUERY: [your query]
TOPICS: [comma-separated topics]
TYPE: [article/news/documentation/general]`,
          });
          
          const queryMatch = requestAnalysis.text.match(/QUERY:\s*(.+)/i);
          let currentQuery = queryMatch ? queryMatch[1].trim() : query;
          
          // Research loop
          for (let iteration = 0; iteration < maxIterations && overallConfidence < 85; iteration++) {
            const iterationData: SearchIteration = {
              query: currentQuery,
              sources: [],
              bulletPoints: [],
              confidence: 0,
              reasoning: ''
            };
            
            // Show searching phase
            yield (
              <AgenticSearch
                request={query}
                iterations={[...iterations, iterationData]}
                isSearching={true}
                currentPhase="searching"
              />
            );
            
            try {
              // Get search results based on query
              let searchUrls = [];
              
              if (currentQuery.toLowerCase().includes('firecrawl')) {
                searchUrls = [
                  'https://firecrawl.dev',
                  'https://docs.firecrawl.dev',
                  'https://github.com/mendableai/firecrawl',
                  'https://www.producthunt.com/products/firecrawl',
                  'https://news.ycombinator.com/item?id=40252569',
                  'https://dev.to/mendalelabs/introducing-firecrawl-5fl6',
                  'https://medium.com/@mendable/firecrawl-introduction',
                  'https://www.reddit.com/r/webdev/comments/firecrawl'
                ];
              } else if (currentQuery.toLowerCase().includes('ai') || currentQuery.toLowerCase().includes('artificial intelligence')) {
                searchUrls = [
                  'https://openai.com/blog',
                  'https://www.anthropic.com/news',
                  'https://www.theverge.com/ai-artificial-intelligence',
                  'https://techcrunch.com/category/artificial-intelligence/',
                  'https://arstechnica.com/ai/',
                  'https://www.wired.com/tag/artificial-intelligence/',
                  'https://venturebeat.com/ai/',
                  'https://www.technologyreview.com/topic/artificial-intelligence/'
                ];
              } else {
                // General search fallback
                searchUrls = [
                  `https://en.wikipedia.org/wiki/${encodeURIComponent(currentQuery.replace(/ /g, '_'))}`,
                  `https://www.britannica.com/search?query=${encodeURIComponent(currentQuery)}`,
                  `https://www.reuters.com/search/news?query=${encodeURIComponent(currentQuery)}`,
                  `https://www.theguardian.com/search?q=${encodeURIComponent(currentQuery)}`,
                  `https://www.bbc.com/search?q=${encodeURIComponent(currentQuery)}`,
                  `https://scholar.google.com/scholar?q=${encodeURIComponent(currentQuery)}`,
                  `https://www.nature.com/search?q=${encodeURIComponent(currentQuery)}`,
                  `https://www.sciencedirect.com/search?qs=${encodeURIComponent(currentQuery)}`
                ];
              }
              
              // Take a subset for this iteration
              const selectedUrls = searchUrls.slice(iteration * limit, (iteration + 1) * limit);
            
              if (selectedUrls.length === 0) {
                break; // No more URLs to search
              }
              
              // Create sources
              iterationData.sources = selectedUrls.map(url => ({
                url,
                title: new URL(url).hostname.replace('www.', ''),
                scraped: false
              }));
              
              // Update with sources found
              yield (
                <AgenticSearch
                  request={query}
                  iterations={[...iterations, iterationData]}
                  isSearching={true}
                  currentPhase="scraping"
                />
              );
              
              // Parallel scraping with Firecrawl
              const scrapePromises = selectedUrls.map(async (url) => {
                try {
                  const result = await firecrawl.scrapeUrl(url);
                  return {
                    url,
                    title: result.metadata?.title || new URL(url).hostname,
                    content: result.markdown || '',
                    success: true
                  };
                } catch (error) {
                  console.error(`Failed to scrape ${url}:`, error);
                  return { url, title: new URL(url).hostname, content: '', success: false };
                }
              });
              
              const scrapeResults = await Promise.all(scrapePromises);
              const successfulScrapes = scrapeResults.filter(r => r.success && r.content);
              
              // Update sources with scraped status
              iterationData.sources = iterationData.sources.map(source => ({
                ...source,
                scraped: scrapeResults.find(r => r.url === source.url)?.success || false,
                title: scrapeResults.find(r => r.url === source.url)?.title || source.title
              }));
              
              allSources.push(...iterationData.sources);
              
              // Show summarizing phase
              yield (
                <AgenticSearch
                  request={query}
                  iterations={[...iterations, iterationData]}
                  isSearching={true}
                  currentPhase="summarizing"
                />
              );
              
              // Generate bullet points from scraped content
              if (successfulScrapes.length > 0) {
                const combinedContent = successfulScrapes
                  .map(item => `Source: ${item.title}\n${item.content.slice(0, 1000)}\n---`)
                  .join('\n\n');
                
                const bulletResult = await generateText({
                  model: openai('gpt-4-turbo'),
                  prompt: `Based on these search results about "${query}", provide exactly 2 key bullet points.

Content:
${combinedContent}

Provide ONLY 2 bullet points, each starting with "•". Be concise and informative.`,
                });
                
                iterationData.bulletPoints = bulletResult.text
                  .split('\n')
                  .filter(line => line.trim().startsWith('•'))
                  .map(line => line.replace('•', '').trim())
                  .slice(0, 2);
              }
              
              // Assess confidence
              yield (
                <AgenticSearch
                  request={query}
                  iterations={[...iterations, iterationData]}
                  isSearching={true}
                  currentPhase="assessing"
                />
              );
              
              const confidenceResult = await generateText({
                model: openai('gpt-4-turbo'),
                prompt: `Assess the confidence level for answering "${query}" based on the information gathered.

Bullet points found:
${iterationData.bulletPoints.join('\n')}

Provide:
1. Confidence percentage (0-100)
2. Brief reasoning (max 20 words)
3. If confidence < 85%, suggest a refined search query

Format:
CONFIDENCE: [number]
REASONING: [text]
NEXT_QUERY: [query or "none"]`,
              });
              
              const confMatch = confidenceResult.text.match(/CONFIDENCE:\s*(\d+)/i);
              const reasonMatch = confidenceResult.text.match(/REASONING:\s*(.+)/i);
              const nextQueryMatch = confidenceResult.text.match(/NEXT_QUERY:\s*(.+)/i);
              
              iterationData.confidence = confMatch ? parseInt(confMatch[1]) : 50;
              iterationData.reasoning = reasonMatch ? reasonMatch[1].trim() : '';
              overallConfidence = Math.max(overallConfidence, iterationData.confidence);
              
              iterations.push(iterationData);
              
              // Update display
              yield (
                <AgenticSearch
                  request={query}
                  iterations={iterations}
                  isSearching={iteration < maxIterations - 1 && overallConfidence < 85}
                  currentPhase="thinking"
                />
              );
              
              // Prepare next query if needed
              if (nextQueryMatch && nextQueryMatch[1].toLowerCase() !== 'none' && overallConfidence < 85) {
                currentQuery = nextQueryMatch[1].trim();
                await new Promise(resolve => setTimeout(resolve, 1000));
              } else {
                break;
              }
              
            } catch (error) {
              console.error('Search iteration failed:', error);
              break;
            }
          }
          
          // Final summary generation
          const allBulletPoints = iterations.flatMap(i => i.bulletPoints);
          
          if (allBulletPoints.length > 0) {
            const finalSummaryResult = await generateText({
              model: openai('gpt-4-turbo'),
              prompt: `Create a comprehensive response for "${query}" based on the research findings.

Key findings:
${allBulletPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Provide a clear, well-structured response that directly answers the request. Write in a natural, conversational tone.`,
            });
            
            // Final yield with complete research
            yield (
              <AgenticSearch
                request={query}
                iterations={iterations}
                isSearching={false}
                finalSummary={finalSummaryResult.text}
                allSources={allSources}
              />
            );
            
            // Stream the final response
            yield (
              <div className="space-y-4">
                <AgenticSearch
                  request={query}
                  iterations={iterations}
                  isSearching={false}
                  finalSummary={finalSummaryResult.text}
                  allSources={allSources}
                />
                <div className="prose prose-sm max-w-none">
                  <p>{finalSummaryResult.text}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Based on {allSources.filter(s => s.scraped).length} analyzed sources from {iterations.length} search iteration{iterations.length > 1 ? 's' : ''}.</p>
                  </div>
                </div>
              </div>
            );
          } else {
            return <div className="text-red-500">Unable to find relevant information for your request.</div>;
          }
          
          } catch (error) {
            return <div className="text-red-500">Search failed: {error instanceof Error ? error.message : 'Unknown error'}</div>;
          }
        },
      },
      analyzeArticle: {
        description: 'Analyze and summarize a specific article or webpage using Firecrawl',
        parameters: z.object({
          url: z.string().url().describe('The URL to analyze'),
        }),
        generate: async function* ({ url }) {
          const thoughts = [];
          const steps = [];
          
          // Show thinking process
          thoughts.push(`Analyzing the content at: ${new URL(url).hostname}`);
          thoughts.push('Will extract main content and key information');
          thoughts.push('Planning to generate a comprehensive summary');
          
          yield (
            <div className="space-y-4">
              <ThinkingTrace thoughts={thoughts} isThinking={false} />
            </div>
          );
          
          // Show analyzing step
          steps.push({ 
            type: 'analyzing' as const,
            content: `Fetching and analyzing content from ${new URL(url).hostname}`
          });
          
          yield (
            <div className="space-y-4">
              <ThinkingTrace thoughts={thoughts} />
              <SearchProcess steps={steps} currentStep={0} />
            </div>
          );
          
          const firecrawl = new FirecrawlClient();
          
          try {
            const result = await firecrawl.scrapeUrl(url);
            
            if (!result?.markdown) {
              return <div className="text-red-500">Failed to analyze article</div>;
            }
            
            // Show completion
            steps.push({ type: 'complete' as const });
            yield (
              <div className="space-y-4">
                <ThinkingTrace thoughts={thoughts} />
                <SearchProcess steps={steps} currentStep={1} />
              </div>
            );
            
            // Generate summary using AI
            const summaryResult = await generateText({
              model: openai('gpt-4-turbo'),
              prompt: `Analyze and summarize the following article. Provide a comprehensive summary and extract key points.

Title: ${result.metadata?.title || 'Unknown'}
URL: ${url}

Content:
${result.markdown.slice(0, 4000)}

Provide:
1. A clear, informative summary (2-3 paragraphs)
2. 3-5 key bullet points
3. Any notable insights or takeaways

Format your response as:
SUMMARY:
[Your summary here]

KEY POINTS:
• [Point 1]
• [Point 2]
• [Point 3]
[etc.]`,
            });
            
            // Parse the response
            const responseText = summaryResult.text;
            const summaryMatch = responseText.match(/SUMMARY:\s*([\s\S]*?)(?=KEY POINTS:|$)/i);
            const keyPointsMatch = responseText.match(/KEY POINTS:\s*([\s\S]*?)$/i);
            
            const summary = summaryMatch ? summaryMatch[1].trim() : responseText;
            const keyPointsText = keyPointsMatch ? keyPointsMatch[1].trim() : '';
            const keyPoints = keyPointsText
              .split('\n')
              .filter(line => line.trim().startsWith('•'))
              .map(line => line.replace('•', '').trim());
            
            const wordCount = result.markdown.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200);
            
            return (
              <div className="space-y-4">
                <ThinkingTrace thoughts={thoughts} />
                <SearchProcess steps={steps} currentStep={steps.length - 1} />
                <ArticleCard
                  title={result.metadata?.title || 'Untitled'}
                  url={url}
                  content={result.markdown.slice(0, 300) + '...'}
                  author={result.metadata?.author}
                  publishedDate={result.metadata?.publishedDate}
                  readingTime={readingTime}
                  wordCount={wordCount}
                />
                <SummaryCard 
                  summary={summary} 
                  keyPoints={keyPoints}
                  sourceCount={1}
                />
              </div>
            );
          } catch (error) {
            return <div className="text-red-500">Failed to analyze: {error instanceof Error ? error.message : 'Unknown error'}</div>;
          }
        },
      },
    },
  });
  
  return result.value;
}
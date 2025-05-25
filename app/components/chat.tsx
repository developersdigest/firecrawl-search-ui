'use client';

import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { streamChat } from '@/app/actions/chat';
import { Send, Loader2, Search, Globe, Brain, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
}

// Helper function to extract text from React nodes
function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  
  // For complex React elements, return a placeholder
  // In a real app, you might want to implement more sophisticated text extraction
  return '[Complex content]';
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Add user message
    const userMessageId = Date.now().toString();
    const newUserMessage = {
      id: userMessageId,
      role: 'user' as const,
      content: userMessage,
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Convert messages to history format (text only)
      const history = messages.map(msg => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : extractTextFromReactNode(msg.content)
      }));
      
      // Get the streaming response
      const ui = await streamChat(userMessage, history);
      
      // Create assistant message with streaming content
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: ui,
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: <div className="text-red-500">Sorry, an error occurred. Please try again.</div>,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center mt-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-2xl">
              <Search className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3 gradient-text">Fireplex AI Search</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Intelligent web research powered by Firecrawl</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="glass rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Web Research</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Search and analyze multiple sources intelligently</p>
              </div>
              
              <div className="glass rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Smart Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered insights with confidence assessment</p>
              </div>
              
              <div className="glass rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
                  <Sparkles className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">Live Scraping</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time content extraction with Firecrawl</p>
              </div>
            </div>
            
            <div className="mt-12 space-y-2 text-sm text-gray-500 dark:text-gray-500">
              <p>Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['What is Firecrawl?', 'Latest AI news', 'How does web scraping work?'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'glass'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 glass border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything or search the web..."
            className="flex-1 rounded-2xl border-0 bg-white dark:bg-gray-800 px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-white font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:scale-105 shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Send className="h-6 w-6" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
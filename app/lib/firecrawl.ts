/* eslint-disable @typescript-eslint/no-explicit-any */
import FirecrawlApp from '@mendable/firecrawl-js';

export class FirecrawlClient {
  private client: FirecrawlApp;

  constructor() {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY environment variable is not set');
    }
    this.client = new FirecrawlApp({ apiKey });
  }

  async scrapeUrl(url: string) {
    try {
      const result = await this.client.scrapeUrl(url, {
        formats: ['markdown', 'html'],
      });
      
      if ('success' in result && !result.success) {
        throw new Error(result.error || 'Scrape failed');
      }
      
      return {
        markdown: (result as any).markdown || '',
        html: (result as any).html || '',
        metadata: (result as any).metadata || {},
      };
    } catch (error) {
      console.error('Firecrawl scrape error:', error);
      throw error;
    }
  }

  async mapUrl(url: string, options?: { search?: string; limit?: number }) {
    try {
      const result = await this.client.mapUrl(url, {
        search: options?.search,
        limit: options?.limit || 10,
      });
      
      if ('success' in result && !result.success) {
        throw new Error((result as any).error || 'Map failed');
      }
      
      return {
        links: (result as any).links || [],
        metadata: (result as any).metadata || {},
      };
    } catch (error) {
      console.error('Firecrawl map error:', error);
      throw error;
    }
  }
}
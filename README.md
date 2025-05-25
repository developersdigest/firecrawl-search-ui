# Firecrawl Search UI

An intelligent AI-powered web search interface that uses Firecrawl for content extraction and the Vercel AI SDK for streaming UI components. Experience real-time research with visual feedback, confidence assessments, and beautiful animations.

## Features

- 🔍 **Multi-iteration Search**: Intelligent search loops that refine queries based on confidence levels
- 🔥 **Firecrawl Integration**: Real-time web scraping with parallel content extraction
- 🧠 **AI-Powered Analysis**: Uses GPT-4 for query analysis, summarization, and confidence assessment
- 💫 **Streaming UI**: Beautiful, responsive components that update in real-time
- 📊 **Confidence Tracking**: Visual confidence meters for each search iteration
- 🎨 **Modern Design**: Glass morphism effects, smooth animations, and dark mode support

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Streaming**: Vercel AI SDK RSC
- **Web Scraping**: Firecrawl API
- **AI Model**: OpenAI GPT-4
- **Styling**: Tailwind CSS with custom animations
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firecrawl API key ([Get one here](https://firecrawl.dev))
- OpenAI API key ([Get one here](https://platform.openai.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/firecrawl-search-ui.git
cd firecrawl-search-ui
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Agentic Search Loop

1. **Request Analysis**: The AI analyzes your query and generates an optimized search query
2. **Parallel Scraping**: Multiple sources are scraped simultaneously using Firecrawl
3. **Content Summarization**: Key findings are extracted into bullet points
4. **Confidence Assessment**: The AI evaluates if enough information was gathered
5. **Iteration**: If confidence is low, the search refines and continues (up to 3 iterations)
6. **Final Summary**: A comprehensive response is generated from all findings

### Key Components

- `app/actions/chat.tsx` - Server action with streaming UI logic
- `app/components/ui/agentic-search.tsx` - Main search visualization component
- `app/lib/firecrawl.ts` - Firecrawl client wrapper

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/firecrawl-search-ui&env=OPENAI_API_KEY,FIRECRAWL_API_KEY)

Or deploy manually:

```bash
npm run build
vercel deploy
```

## Examples

Try these searches:
- "What is Firecrawl and how does it work?"
- "Latest developments in AI"
- "Best practices for web scraping in 2024"

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Firecrawl](https://firecrawl.dev) for the amazing web scraping API
- [Vercel AI SDK](https://sdk.vercel.ai) for streaming UI components
- [OpenAI](https://openai.com) for GPT-4 API

# 🔥 linkedRoast

**Get your LinkedIn profile roasted by AI, then receive actionable feedback to level up.**

An iMessage-style web app that roasts LinkedIn profiles with humor and delivers constructive feedback. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 📤 **Upload PDF or paste text** - Multiple input methods for your LinkedIn profile
- 🎭 **Choose your roaster** - Pick from 5 personas: Mean Girl, Startup CEO, Billionaire CEO, Recruiter, or Stand-Up Comic
- 🔥 **Adjust the heat** - 4 roast levels from "Lightly Toasted" to "Burnt to a Crisp"
- 💬 **iOS-style chat** - Roasts delivered as authentic-looking iMessage bubbles
- 🎯 **Profile scoring** - Get rated 0-100 with an archetype (Legendary, Project Demon, Club Nerd, etc.)
- 🖼️ **Shareable cards** - Download your archetype card as a PNG
- ✨ **Actionable feedback** - Concrete rewrites and improvements for every profile section
- 🚫 **Safe & fun** - Humor-only roasts, never harassment

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Forms**: react-hook-form + zod
- **PDF Parsing**: pdf-parse
- **Image Generation**: @vercel/og
- **LLM**: OpenAI GPT-4o-mini (easily swappable)

## Setup

### Prerequisites

- Node.js 18+ installed
- OpenAI API key (or other LLM provider)

### Installation

1. **Clone and install dependencies**:

```bash
cd linkedroast
npm install
```

2. **Set up environment variables**:

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Run the development server**:

```bash
npm run dev
```

4. **Open your browser**:

Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload or paste** your LinkedIn profile text
2. **Select a persona** (who's roasting you)
3. **Choose roast level** (how harsh do you want it?)
4. **Click "Roast Me"** and watch the roast unfold
5. **View your archetype card** and download as PNG
6. **Get actionable feedback** with specific improvements

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── extract/       # PDF text extraction
│   │   ├── roast/         # Generate roast + score
│   │   ├── feedback/      # Generate improvement tips
│   │   └── card/          # OG image generation
│   ├── result/            # Results page
│   ├── page.tsx           # Home page
│   └── layout.tsx
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── IOSChat.tsx        # iMessage-style bubbles
│   ├── PersonaPicker.tsx
│   ├── HeatPicker.tsx
│   ├── FileDrop.tsx
│   ├── PasteArea.tsx
│   ├── ArchetypeModal.tsx
│   └── FeedbackPanel.tsx
└── lib/
    ├── types.ts           # TypeScript types
    ├── prompts.ts         # LLM prompt templates
    ├── llm.ts             # LLM wrapper/provider
    ├── scoring.ts         # Heuristic scoring logic
    └── utils.ts           # Utilities
```

## API Routes

- `POST /api/extract` - Extract text from PDF or accept pasted text
- `POST /api/roast` - Generate roast lines, score, and archetype
- `POST /api/feedback` - Generate structured improvement feedback
- `GET /api/card` - Generate OG image for archetype card

## Customization

### Changing LLM Provider

Edit `src/lib/llm.ts` to swap OpenAI for Groq, Anthropic, or any other provider. The interface is designed to be provider-agnostic.

### Adding New Personas

1. Add to `Persona` type in `src/lib/types.ts`
2. Update `PERSONA_LABELS` mapping
3. Add description in `src/lib/prompts.ts`

### Adjusting Rate Limits

Edit the `RATE_LIMIT` and `RATE_WINDOW` constants in:
- `src/app/api/roast/route.ts`
- `src/app/api/feedback/route.ts`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add your `OPENAI_API_KEY` environment variable
4. Deploy!

### Deploy to Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Fly.io
- Self-hosted with Docker

## Rate Limiting

Basic in-memory rate limiting is implemented (10 requests per IP per 24 hours). For production, consider:
- Redis-based rate limiting
- Cookie-based throttling
- Authentication with user-based limits

## Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest new personas or features
- Improve prompts
- Add tests

## License

MIT

## Acknowledgments

Built with ❤️ using Next.js, shadcn/ui, and OpenAI.

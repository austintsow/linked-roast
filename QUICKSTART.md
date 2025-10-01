# 🚀 Quick Start Guide

## Prerequisites

You need an OpenAI API key to run this app. Get one at: https://platform.openai.com/api-keys

## Setup (2 minutes)

1. **Create your environment file**:
```bash
cp env.example .env.local
```

2. **Add your OpenAI API key**:
Open `.env.local` and replace `your_openai_api_key_here` with your actual API key:
```
OPENAI_API_KEY=sk-proj-...your-actual-key...
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to http://localhost:3000

## Testing the App

### Quick Test with Sample Profile
1. Click the **"Try Sample Profile"** button on the homepage
2. This loads a buzzword-filled profile that will get roasted
3. Watch the roast appear in iMessage-style bubbles
4. Click **"Show My Archetype Card"** to see your archetype
5. Click **"Gimme Real Feedback"** for actionable improvements

### Test with Your Own Profile
1. Go to your LinkedIn profile
2. Export as PDF (LinkedIn > Me > View Profile > More > Save to PDF)
3. Upload the PDF on the homepage, OR
4. Copy/paste your profile text directly

## Features to Try

- ✅ Switch between file upload and paste modes
- ✅ Try all 5 personas (Mean Girl, Startup CEO, Billionaire CEO, Recruiter, Comic)
- ✅ Adjust roast heat levels
- ✅ Download your archetype card as PNG
- ✅ Copy all feedback as markdown
- ✅ Use "Too Harsh?" to lower the heat and re-roast

## Troubleshooting

### "OPENAI_API_KEY is not set"
- Make sure you created `.env.local` (not `.env`)
- Verify your API key is correct
- Restart the dev server after adding the key

### "Rate limit exceeded"
- The app limits 10 requests per IP per 24 hours
- Clear your browser cache or wait 24 hours
- Or adjust rate limits in `src/app/api/roast/route.ts`

### PDF upload fails
- Ensure the PDF is under 5MB
- Try copy/pasting the text instead
- Some PDFs have protection that prevents text extraction

## Project Structure

```
src/
├── app/
│   ├── api/          # API endpoints
│   ├── result/       # Results page
│   └── page.tsx      # Home page
├── components/       # React components
└── lib/              # Utils, types, LLM logic
```

## Next Steps

- Customize personas in `src/lib/prompts.ts`
- Adjust scoring logic in `src/lib/scoring.ts`
- Swap LLM providers in `src/lib/llm.ts`
- Deploy to Vercel for free hosting

## Need Help?

Check the full README.md for detailed documentation.

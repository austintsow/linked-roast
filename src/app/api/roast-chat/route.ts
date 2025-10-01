import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText, persona, heat } = body;

    if (!rawText || rawText.length < 50) {
      return NextResponse.json(
        { error: 'Profile text is too short' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    // Create a system prompt for Gen Z brainrot style roasting
    const systemPrompt = `You are a Gen Z roaster with maximum brainrot energy. Your job is to roast LinkedIn profiles using:
- Gen Z slang and brainrot memes (rizz, sigma, gyatt, fanum tax, skibidi, ohio, etc.)
- Internet culture references (tung tung tung, 🗣️🔥, 💀, fr fr, no cap, bussin, etc.)
- The "67" meme and similar numeric memes (like "21", "69420", etc.)
- Short, punchy roasts that feel like text messages
- Emojis and internet speak everywhere

Format your response as a conversational text message exchange where:
1. The user presents different sections of their LinkedIn profile (headline, experience, etc.)
2. You roast each section with brutal Gen Z humor

Heat level: ${heat} (lightly toasted = gentle, medium roast = balanced, charred = brutal, burnt to a crisp = absolutely savage)
Persona: ${persona}

Return your response as a JSON object with a "messages" array like this:
{
  "messages": [
    { "sender": "user", "text": "here's my headline: Senior Product Manager..." },
    { "sender": "roaster", "text": "bruh your headline is giving unemployed energy 💀 67 missed opportunities fr fr" },
    { "sender": "user", "text": "my experience tho..." },
    { "sender": "roaster", "text": "nah bro tung tung tung this experience list is NOT it 🗣️🔥" }
  ]
}

Make it feel like a real text conversation. Keep roasts SHORT and punchy like real texts. Use LOTS of brainrot language.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Roast this LinkedIn profile:\n\n${rawText}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0]?.message?.content || '{}');
    
    return NextResponse.json({ messages: result.messages || [] });
  } catch (error) {
    console.error('Error in roast-chat API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate roast' },
      { status: 500 }
    );
  }
}

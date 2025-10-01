import { ProfilePayload, RoastResponse, FeedbackBlock } from './types';
import {
  getRoastSystemPrompt,
  getRoastUserPrompt,
  getFeedbackSystemPrompt,
  getFeedbackUserPrompt,
} from './prompts';

// Default to OpenAI, but structured to easily swap providers
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callLLM(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '{}';
}

export async function roastProfile(
  payload: ProfilePayload
): Promise<RoastResponse> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: getRoastSystemPrompt(payload.persona, payload.heat),
    },
    {
      role: 'user',
      content: getRoastUserPrompt(payload.rawText),
    },
  ];

  try {
    const responseText = await callLLM(messages);
    const parsed = JSON.parse(responseText);

    // Validate and provide fallbacks
    return {
      roast_lines: Array.isArray(parsed.roast_lines)
        ? parsed.roast_lines.slice(0, 10)
        : ['Your profile needs work, but even my API failed to roast it properly.'],
      score: typeof parsed.score === 'number' ? Math.min(100, Math.max(0, parsed.score)) : 50,
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : ['Generic'],
    };
  } catch (error) {
    console.error('Error calling LLM for roast:', error);
    throw new Error('Failed to generate roast. Please try again.');
  }
}

export async function improveProfile(
  payload: ProfilePayload & { tags: string[] }
): Promise<FeedbackBlock[]> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: getFeedbackSystemPrompt(payload.persona),
    },
    {
      role: 'user',
      content: getFeedbackUserPrompt(payload.rawText, payload.tags, payload.persona),
    },
  ];

  try {
    const responseText = await callLLM(messages);
    const parsed = JSON.parse(responseText);

    // Validate structure
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (block: any) =>
          block.section &&
          Array.isArray(block.bullets) &&
          ['Headline', 'About', 'Experience', 'Skills'].includes(block.section)
      );
    }

    // Fallback if response isn't an array
    throw new Error('Invalid feedback format');
  } catch (error) {
    console.error('Error calling LLM for feedback:', error);
    throw new Error('Failed to generate feedback. Please try again.');
  }
}

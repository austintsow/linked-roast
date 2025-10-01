import { NextRequest, NextResponse } from 'next/server';
import { improveProfile } from '@/lib/llm';
import { ProfilePayload } from '@/lib/types';

// Simple in-memory rate limiting (per IP)
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests
const RATE_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again tomorrow.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { rawText, persona, heat, tags } = body as ProfilePayload & { tags: string[] };

    // Validation
    if (!rawText || !persona || !heat || !tags) {
      return NextResponse.json(
        { error: 'Missing required fields: rawText, persona, heat, tags' },
        { status: 400 }
      );
    }

    // Call LLM for feedback
    const feedbackBlocks = await improveProfile({ rawText, persona, heat, tags });

    return NextResponse.json({ feedback: feedbackBlocks });
  } catch (error) {
    console.error('Error in feedback API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate feedback';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

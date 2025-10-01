import { NextRequest, NextResponse } from 'next/server';
import { roastProfile } from '@/lib/llm';
import {
  calculateHeuristicScore,
  calculateFinalScore,
  determineArchetype,
} from '@/lib/scoring';
import { ProfilePayload } from '@/lib/types';

// Simple in-memory rate limiting (per IP)
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests
const RATE_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetAt) {
    // Reset or create new record
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
    const { rawText, persona, heat } = body as ProfilePayload;

    // Validation
    if (!rawText || !persona || !heat) {
      return NextResponse.json(
        { error: 'Missing required fields: rawText, persona, heat' },
        { status: 400 }
      );
    }

    if (rawText.length < 50) {
      return NextResponse.json(
        { error: 'Profile text is too short. Provide at least 50 characters.' },
        { status: 400 }
      );
    }

    // Call LLM for roast
    const roastResponse = await roastProfile({ rawText, persona, heat });

    // Calculate heuristic score
    const heuristicScore = calculateHeuristicScore(rawText);

    // Blend scores
    const finalScore = calculateFinalScore(roastResponse.score, heuristicScore);

    // Determine archetype
    const archetype = determineArchetype(finalScore, roastResponse.tags);

    return NextResponse.json({
      roast_lines: roastResponse.roast_lines,
      score: finalScore,
      tags: roastResponse.tags,
      archetype,
    });
  } catch (error) {
    console.error('Error in roast API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate roast';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

import { Archetype } from './types';

// Buzzwords to penalize
const BUZZWORDS = [
  'synergy',
  'leverage',
  'paradigm',
  'disrupt',
  'innovative',
  'strategic',
  'visionary',
  'passionate',
  'dynamic',
  'results-driven',
  'team player',
  'go-getter',
  'rockstar',
  'ninja',
  'guru',
  'wizard',
  'thought leader',
  'best practices',
  'core competencies',
  'value-add',
  'low-hanging fruit',
  'move the needle',
  'circle back',
  'touch base',
];

// Strong indicators of quality
const METRIC_PATTERNS = /\d+%|\d+x|\$\d+|[0-9,]+ (users|customers|employees|projects|products)/gi;
const ACTION_VERBS = [
  'led',
  'managed',
  'shipped',
  'improved',
  'increased',
  'decreased',
  'reduced',
  'built',
  'developed',
  'launched',
  'scaled',
  'drove',
  'achieved',
  'delivered',
  'generated',
  'optimized',
];

export function calculateHeuristicScore(profileText: string): number {
  let score = 50; // Start at middle

  const lowerText = profileText.toLowerCase();

  // Count metrics (positive)
  const metricMatches = profileText.match(METRIC_PATTERNS);
  const metricCount = metricMatches ? metricMatches.length : 0;
  score += Math.min(metricCount * 3, 20); // +3 per metric, max +20

  // Count action verbs (positive)
  let verbCount = 0;
  for (const verb of ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) verbCount += matches.length;
  }
  score += Math.min(verbCount * 2, 15); // +2 per verb, max +15

  // Count buzzwords (negative)
  let buzzwordCount = 0;
  for (const buzzword of BUZZWORDS) {
    if (lowerText.includes(buzzword.toLowerCase())) {
      buzzwordCount++;
    }
  }
  score -= Math.min(buzzwordCount * 5, 25); // -5 per buzzword, max -25

  // Penalize very long bullets (likely rambling)
  const bullets = profileText.split('\n').filter((line) => line.trim().length > 0);
  const longBullets = bullets.filter((bullet) => bullet.length > 200);
  score -= Math.min(longBullets.length * 3, 15); // -3 per long bullet, max -15

  // Reward concise, structured content
  if (bullets.length >= 5 && bullets.length <= 20) {
    score += 5;
  }

  // Clamp score to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateFinalScore(llmScore: number, heuristicScore: number): number {
  // Blend: 70% LLM, 30% heuristic
  return Math.round(0.7 * llmScore + 0.3 * heuristicScore);
}

export function determineArchetype(score: number, tags: string[]): Archetype {
  if (score >= 85) {
    return 'Legendary';
  } else if (score >= 70) {
    return 'Project Demon';
  } else if (score >= 55) {
    return 'Club Nerd';
  } else {
    // For scores < 55, check tags to distinguish
    const lowerTags = tags.map((t) => t.toLowerCase());
    const hasBuzzwords = lowerTags.some((t) =>
      t.includes('buzzword') || t.includes('jargon')
    );

    if (hasBuzzwords) {
      return 'Buzzword Bard';
    } else {
      return 'High School Student';
    }
  }
}

export const ARCHETYPE_INFO: Record<
  Archetype,
  { oneLiner: string; emoji: string }
> = {
  Legendary: {
    oneLiner: "You're the unicorn recruiters dream about.",
    emoji: '🦄',
  },
  'Project Demon': {
    oneLiner: 'Ships code and crushes deadlines.',
    emoji: '😈',
  },
  'Club Nerd': {
    oneLiner: 'Smart but could use more polish.',
    emoji: '🤓',
  },
  'High School Student': {
    oneLiner: 'Still finding your professional voice.',
    emoji: '🎒',
  },
  'Buzzword Bard': {
    oneLiner: 'Synergizing paradigms since... wait, what?',
    emoji: '🎭',
  },
};

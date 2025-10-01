export type Persona =
  | 'mean_girl'
  | 'startup_ceo'
  | 'billionaire_ceo'
  | 'recruiter'
  | 'comic';

export type Heat = 'light' | 'medium' | 'charred' | 'crisp';

export type Archetype =
  | 'Legendary'
  | 'Project Demon'
  | 'Club Nerd'
  | 'High School Student'
  | 'Buzzword Bard';

export type FeedbackBlock = {
  section: 'Headline' | 'About' | 'Experience' | 'Skills';
  bullets: string[];
};

export type RoastResponse = {
  roast_lines: string[];
  score: number;
  tags: string[];
};

export type ProfilePayload = {
  rawText: string;
  persona: Persona;
  heat: Heat;
};

export type RoastResult = {
  roast_lines: string[];
  score: number;
  tags: string[];
  archetype: Archetype;
};

export const PERSONA_LABELS: Record<Persona, { label: string; description: string }> = {
  mean_girl: {
    label: '💅 Mean Girl',
    description: 'Brutally honest with a side of sass',
  },
  startup_ceo: {
    label: '🚀 Startup CEO',
    description: 'Move fast and roast things',
  },
  billionaire_ceo: {
    label: '💼 Billionaire CEO',
    description: 'Time is money, make it count',
  },
  recruiter: {
    label: '📋 Recruiter',
    description: 'Professional but pointed feedback',
  },
  comic: {
    label: '🎤 Stand-Up Comic',
    description: 'Laugh while you learn',
  },
};

export const HEAT_LABELS: Record<Heat, { label: string; emoji: string }> = {
  light: { label: 'Lightly Toasted', emoji: '🍞' },
  medium: { label: 'Medium Roast', emoji: '☕' },
  charred: { label: 'Charred', emoji: '🔥' },
  crisp: { label: 'Burnt to a Crisp', emoji: '💀' },
};

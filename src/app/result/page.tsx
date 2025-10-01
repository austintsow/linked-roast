'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, TrendingDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { IOSChat } from '@/components/IOSChat';
import { ArchetypeModal } from '@/components/ArchetypeModal';
import { FeedbackPanel } from '@/components/FeedbackPanel';
import {
  RoastResult,
  FeedbackBlock,
  Persona,
  Heat,
  PERSONA_LABELS,
  HEAT_LABELS,
} from '@/lib/types';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<RoastResult & { rawText: string; persona: Persona; heat: Heat } | null>(null);
  const [showArchetype, setShowArchetype] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackBlock[] | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('roastResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleGetFeedback = async () => {
    if (!result) return;

    setIsLoadingFeedback(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: result.rawText,
          persona: result.persona,
          heat: result.heat,
          tags: result.tags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleLowerHeat = async () => {
    if (!result) return;

    const heatLevels: Heat[] = ['light', 'medium', 'charred', 'crisp'];
    const currentIndex = heatLevels.indexOf(result.heat);
    
    if (currentIndex <= 0) {
      alert('Already at the lowest heat level!');
      return;
    }

    const newHeat = heatLevels[currentIndex - 1];
    
    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: result.rawText,
          persona: result.persona,
          heat: newHeat,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to re-roast');
      }

      const roastData = await response.json();
      const newResult = {
        ...roastData,
        rawText: result.rawText,
        persona: result.persona,
        heat: newHeat,
      };

      setResult(newResult);
      sessionStorage.setItem('roastResult', JSON.stringify(newResult));
      setFeedback(null); // Clear old feedback
    } catch (error) {
      console.error('Error re-roasting:', error);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const scoreColor =
    result.score >= 85
      ? 'bg-green-100 text-green-800 border-green-300'
      : result.score >= 70
      ? 'bg-blue-100 text-blue-800 border-blue-300'
      : result.score >= 55
      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
      : 'bg-red-100 text-red-800 border-red-300';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          New Roast
        </Button>

        {/* Header with Score */}
        <Card className="p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Roast Results</h1>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">
                  {PERSONA_LABELS[result.persona].label}
                </Badge>
                <Badge variant="outline">
                  {HEAT_LABELS[result.heat].emoji} {HEAT_LABELS[result.heat].label}
                </Badge>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-xl border-2 ${scoreColor}`}>
              <div className="text-sm font-medium">Profile Score</div>
              <div className="text-4xl font-bold">{result.score}</div>
            </div>
          </div>

          {/* Tags */}
          {result.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {result.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Chat Messages */}
        <Card className="mb-6 bg-white">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">The Roast</h2>
          </div>
          <IOSChat messages={result.roast_lines} showTyping={true} />
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            onClick={() => setShowArchetype(true)}
            size="lg"
            className="flex-1"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Show My Archetype Card
          </Button>

          {!feedback && (
            <Button
              onClick={handleGetFeedback}
              disabled={isLoadingFeedback}
              size="lg"
              variant="secondary"
              className="flex-1"
            >
              {isLoadingFeedback ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Gimme Real Feedback
                </>
              )}
            </Button>
          )}

          {result.heat !== 'light' && (
            <Button
              onClick={handleLowerHeat}
              size="lg"
              variant="outline"
            >
              <TrendingDown className="mr-2 h-5 w-5" />
              Too Harsh?
            </Button>
          )}
        </div>

        {/* Feedback Panel */}
        {feedback && (
          <div className="mb-6">
            <FeedbackPanel feedback={feedback} />
          </div>
        )}

        {/* Archetype Modal */}
        <ArchetypeModal
          open={showArchetype}
          onOpenChange={setShowArchetype}
          archetype={result.archetype}
          score={result.score}
          persona={result.persona}
          heat={result.heat}
        />
      </div>
    </div>
  );
}

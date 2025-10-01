'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { FeedbackBlock } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface FeedbackPanelProps {
  feedback: FeedbackBlock[];
}

export function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(feedback.map((f) => f.section))
  );
  const [copied, setCopied] = useState(false);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyAllFeedback = () => {
    const markdown = feedback
      .map((block) => {
        const bullets = block.bullets.map((bullet) => `  - [ ] ${bullet}`).join('\n');
        return `## ${block.section}\n${bullets}`;
      })
      .join('\n\n');

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Actionable Feedback</h2>
        <Button onClick={copyAllFeedback} variant="outline" size="sm">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {feedback.map((block) => (
          <Card key={block.section} className="overflow-hidden">
            <button
              onClick={() => toggleSection(block.section)}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-left">{block.section}</h3>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.has(block.section) ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSections.has(block.section) && (
              <>
                <Separator />
                <div className="px-6 py-4 space-y-3">
                  {block.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed flex-1">
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

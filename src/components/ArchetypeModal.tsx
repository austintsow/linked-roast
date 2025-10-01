'use client';

import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archetype, Persona, Heat, PERSONA_LABELS, HEAT_LABELS } from '@/lib/types';
import { ARCHETYPE_INFO } from '@/lib/scoring';

interface ArchetypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  archetype: Archetype;
  score: number;
  persona: Persona;
  heat: Heat;
}

export function ArchetypeModal({
  open,
  onOpenChange,
  archetype,
  score,
  persona,
  heat,
}: ArchetypeModalProps) {
  const info = ARCHETYPE_INFO[archetype];

  const handleDownload = () => {
    const params = new URLSearchParams({
      title: archetype,
      score: score.toString(),
      persona: PERSONA_LABELS[persona].label,
      heat: HEAT_LABELS[heat].label,
      blurb: info.oneLiner,
    });

    const url = `/api/card?${params.toString()}`;
    
    // Download the image
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkedroast-${archetype.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your LinkedIn Archetype</DialogTitle>
          <DialogDescription>Share your roast results!</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Preview */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 text-center shadow-lg">
            <div className="text-6xl mb-4">{info.emoji}</div>
            
            <Badge variant="secondary" className="mb-3 text-2xl font-bold px-4 py-2">
              {score}
            </Badge>

            <h3 className="text-2xl font-bold text-blue-400 mb-2">{archetype}</h3>
            
            <p className="text-slate-300 mb-4">{info.oneLiner}</p>

            <div className="flex gap-2 justify-center flex-wrap">
              <Badge variant="outline" className="text-xs">
                {PERSONA_LABELS[persona].label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {HEAT_LABELS[heat].emoji} {HEAT_LABELS[heat].label}
              </Badge>
            </div>
          </div>

          {/* Download Button */}
          <Button onClick={handleDownload} className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Share your archetype card on social media!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileDrop } from '@/components/FileDrop';
import { PasteArea } from '@/components/PasteArea';
import { PersonaPicker } from '@/components/PersonaPicker';
import { HeatPicker } from '@/components/HeatPicker';
import { Persona, Heat } from '@/lib/types';

const SAMPLE_PROFILE = `Senior Product Manager
Passionate team player with 5+ years of experience in product management. Strategic thinker who leverages synergies to drive innovation and disrupt markets. Visionary leader focused on best practices and moving the needle.

Experience:
Product Manager at Tech Company
• Responsible for product roadmap
• Worked with cross-functional teams
• Managed multiple projects
• Collaborated with stakeholders

Skills: Leadership, Strategic Planning, Innovation, Agile, Scrum, Project Management, Team Building`;

export default function RoastPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [persona, setPersona] = useState<Persona>('mean_girl');
  const [heat, setHeat] = useState<Heat>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkedInProfile, setLinkedInProfile] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch LinkedIn profile on component mount
  useEffect(() => {
    const fetchLinkedInProfile = async () => {
      try {
        const res = await fetch('/api/linkedin/profile');
        if (res.ok) {
          const data = await res.json();
          setLinkedInProfile(data.profileText);
        }
      } catch (err) {
        console.error('Failed to fetch LinkedIn profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchLinkedInProfile();
  }, []);

  const handleTrySample = async () => {
    setPastedText(SAMPLE_PROFILE);
    setMode('paste');
    
    // Automatically trigger roast with sample
    setTimeout(() => {
      handleSubmit(SAMPLE_PROFILE);
    }, 100);
  };

  const handleSubmit = async (textOverride?: string) => {
    setError('');
    setIsLoading(true);

    try {
      let rawText = textOverride || pastedText || linkedInProfile;

      // If file mode, extract text first
      if (mode === 'upload' && file && !textOverride) {
        const formData = new FormData();
        formData.append('file', file);

        const extractRes = await fetch('/api/extract', {
          method: 'POST',
          body: formData,
        });

        if (!extractRes.ok) {
          const errorData = await extractRes.json();
          throw new Error(errorData.error || 'Failed to extract text from PDF');
        }

        const extractData = await extractRes.json();
        rawText = extractData.rawText;
      }

      if (!rawText || rawText.length < 50) {
        throw new Error('Please provide at least 50 characters of profile text');
      }

      // Call roast API
      const roastRes = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, persona, heat }),
      });

      if (!roastRes.ok) {
        const errorData = await roastRes.json();
        throw new Error(errorData.error || 'Failed to generate roast');
      }

      const roastData = await roastRes.json();

      // Navigate to results with state
      const state = {
        roast_lines: roastData.roast_lines,
        score: roastData.score,
        tags: roastData.tags,
        archetype: roastData.archetype,
        rawText,
        persona,
        heat,
      };

      sessionStorage.setItem('roastResult', JSON.stringify(state));
      router.push('/result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Can submit if LinkedIn profile is loaded, or if manual text/file is provided
  const canSubmit = linkedInProfile.length >= 50 || pastedText.length >= 50 || file !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="h-12 w-12 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
              linkedRoast
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get your LinkedIn profile roasted by AI, then receive actionable feedback to
            level up. No BS, just results.
          </p>
        </div>

        {/* LinkedIn Profile Status */}
        {isLoadingProfile ? (
          <div className="max-w-md mx-auto mb-6">
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Loading your LinkedIn profile...</AlertDescription>
            </Alert>
          </div>
        ) : linkedInProfile ? (
          <div className="max-w-md mx-auto mb-6">
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✓ LinkedIn profile connected and ready to roast!
              </AlertDescription>
            </Alert>
          </div>
        ) : null}

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Customize Your Roast</h2>
            <div className="space-y-6">
              <PersonaPicker value={persona} onChange={setPersona} />
              <HeatPicker value={heat} onChange={setHeat} />
            </div>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => handleSubmit()}
            disabled={!canSubmit || isLoading}
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Roasting...
              </>
            ) : (
              <>
                <Flame className="mr-2 h-5 w-5" />
                Roast Me
              </>
            )}
          </Button>

          <Button
            onClick={handleTrySample}
            variant="outline"
            size="lg"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Try Sample Profile
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Free forever. Powered by AI. Roasts are humor-only, never harassment.</p>
        </div>
      </div>
    </div>
  );
}

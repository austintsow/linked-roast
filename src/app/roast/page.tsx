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
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'roaster'; text: string }>>([]);

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

      // Call chat roast API
      const roastRes = await fetch('/api/roast-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, persona, heat }),
      });

      if (!roastRes.ok) {
        const errorData = await roastRes.json();
        throw new Error(errorData.error || 'Failed to generate roast');
      }

      const roastData = await roastRes.json();

      // Set messages in state for display
      setMessages(roastData.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Can submit if LinkedIn profile is loaded, or if manual text/file is provided
  const canSubmit = linkedInProfile.length >= 50 || pastedText.length >= 50 || file !== null;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Chat Interface */}
      <div className="flex-1 flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
              linkedRoast
            </h1>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : !linkedInProfile ? (
            <div className="text-center py-8 text-gray-400">
              <p>No LinkedIn profile connected</p>
            </div>
          ) : messages.length === 0 ? (
            <>
              {/* Initial prompt */}
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[70%]">
                  <p className="text-sm">yo check out my linkedin profile 🔥</p>
                </div>
              </div>
              
              {/* Loading state */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[70%]">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Display conversation messages */}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[70%] ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-tr-sm'
                        : 'bg-gray-200 text-gray-900 rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Right Side - Roast Options */}
      <div className="w-96 p-6 bg-white flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Customize Your Roast</h2>
        
        <div className="space-y-6 flex-1">
          <PersonaPicker value={persona} onChange={setPersona} />
          <HeatPicker value={heat} onChange={setHeat} />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => handleSubmit()}
            disabled={!canSubmit || isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Roasting...
              </>
            ) : (
              <>
                <Flame className="mr-2 h-5 w-5" />
                Roast My Profile
              </>
            )}
          </Button>

          <Button
            onClick={handleTrySample}
            variant="outline"
            size="lg"
            disabled={isLoading}
            className="w-full"
          >
            Try Sample Profile
          </Button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Powered by AI. Gen Z humor only 💀</p>
        </div>
      </div>
    </div>
  );
}

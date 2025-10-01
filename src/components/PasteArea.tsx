'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PasteAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSwitchToFile: () => void;
}

export function PasteArea({ value, onChange, onSwitchToFile }: PasteAreaProps) {
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);
    setCharCount(text.length);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="profile-text" className="text-sm font-medium">
          Paste your LinkedIn profile text
        </Label>
        <textarea
          id="profile-text"
          value={value}
          onChange={handleChange}
          placeholder="Paste your LinkedIn profile here... Include your headline, about section, experience, skills, etc."
          className="w-full min-h-[300px] p-4 border border-gray-300 rounded-xl resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{charCount} characters</span>
          {charCount > 0 && charCount < 50 && (
            <span className="text-xs text-amber-600">
              Minimum 50 characters required
            </span>
          )}
        </div>
      </div>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToFile}
          className="text-sm"
        >
          Or upload a PDF instead
        </Button>
      </div>
    </div>
  );
}

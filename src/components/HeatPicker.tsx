'use client';

import { Heat, HEAT_LABELS } from '@/lib/types';
import { Label } from '@/components/ui/label';

interface HeatPickerProps {
  value: Heat;
  onChange: (value: Heat) => void;
}

export function HeatPicker({ value, onChange }: HeatPickerProps) {
  const heatLevels: Heat[] = ['light', 'medium', 'charred', 'crisp'];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Roast level</Label>
      <div className="flex gap-2 flex-wrap">
        {heatLevels.map((heat) => (
          <button
            key={heat}
            type="button"
            onClick={() => onChange(heat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              value === heat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {HEAT_LABELS[heat].emoji} {HEAT_LABELS[heat].label}
          </button>
        ))}
      </div>
    </div>
  );
}

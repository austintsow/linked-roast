'use client';

import { Persona, PERSONA_LABELS } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PersonaPickerProps {
  value: Persona;
  onChange: (value: Persona) => void;
}

export function PersonaPicker({ value, onChange }: PersonaPickerProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="persona" className="text-sm font-medium">
        Choose your roaster
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as Persona)}>
        <SelectTrigger id="persona" className="w-full">
          <SelectValue placeholder="Select a persona" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PERSONA_LABELS).map(([key, { label, description }]) => (
            <SelectItem key={key} value={key}>
              <div className="flex flex-col">
                <span className="font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

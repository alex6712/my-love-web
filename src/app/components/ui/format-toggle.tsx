import { Repeat } from 'lucide-react';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import type { DurationFormat } from '../../utils/date';

const formatLabels: Record<DurationFormat, string> = {
  days: 'дни',
  months: 'месяцы',
  years: 'годы',
};

interface FormatToggleProps {
  availableFormats: DurationFormat[];
  currentFormat: DurationFormat;
  onToggle: () => void;
}

export function FormatToggle({ availableFormats, currentFormat, onToggle }: FormatToggleProps) {
  if (availableFormats.length <= 1) {
    return null;
  }

  const idx = availableFormats.indexOf(currentFormat);
  const nextFormat =
    idx === -1 || idx === availableFormats.length - 1
      ? availableFormats[0]
      : availableFormats[idx + 1];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 cursor-pointer"
          onClick={onToggle}
        >
          <Repeat className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Переключить: {formatLabels[nextFormat]}</p>
      </TooltipContent>
    </Tooltip>
  );
}

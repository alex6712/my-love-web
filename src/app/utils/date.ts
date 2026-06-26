export type DurationFormat = 'days' | 'months' | 'years';

export function toLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function pluralizeDays(count: number): string {
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) {
    return 'дней';
  }
  const mod10 = count % 10;
  if (mod10 === 1) {
    return 'день';
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'дня';
  }
  return 'дней';
}

export function pluralizeYears(count: number): string {
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) {
    return 'лет';
  }
  const mod10 = count % 10;
  if (mod10 === 1) {
    return 'год';
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'года';
  }
  return 'лет';
}

export function pluralizeMonths(count: number): string {
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) {
    return 'месяцев';
  }
  const mod10 = count % 10;
  if (mod10 === 1) {
    return 'месяц';
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'месяца';
  }
  return 'месяцев';
}

export const durationFormatLabels: Record<DurationFormat, string> = {
  days: 'Дней вместе',
  months: 'Месяцев вместе',
  years: 'Лет вместе',
};

export function getDurationBetween(startDate: string, unit: DurationFormat): number {
  const start = parseLocalDate(startDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (unit) {
    case 'days':
      return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    case 'months': {
      const months =
        (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth());
      if (today.getDate() < start.getDate()) {
        return months - 1;
      }
      return months;
    }
    case 'years': {
      let years = today.getFullYear() - start.getFullYear();
      if (
        today.getMonth() < start.getMonth() ||
        (today.getMonth() === start.getMonth() && today.getDate() < start.getDate())
      ) {
        years--;
      }
      return years;
    }
  }
}

export function getAvailableFormats(startDate: string | null): DurationFormat[] {
  if (!startDate) {
    return ['days'];
  }
  const days = getDurationBetween(startDate, 'days');
  if (days < 30) {
    return ['days'];
  }
  if (days < 365) {
    return ['days', 'months'];
  }
  return ['days', 'months', 'years'];
}

export function stepFormat(current: DurationFormat, available: DurationFormat[]): DurationFormat {
  const idx = available.indexOf(current);
  if (idx === -1 || idx === available.length - 1) {
    return available[0];
  }
  return available[idx + 1];
}

export function getDurationCardTooltip(
  availableFormats: DurationFormat[],
  hasDate: boolean,
): string | null {
  if (!hasDate) {
    return null;
  }
  if (availableFormats.length > 1) {
    return 'Здесь отображается время пары вместе. Формат отображения можно поменять. Нажмите на иконку 🔄, чтобы переключить отображение';
  }
  return '💕 Другие форматы будут доступны позже';
}

export function getEffectiveFormat(
  preferred: DurationFormat,
  available: DurationFormat[],
): DurationFormat {
  if (available.includes(preferred)) {
    return preferred;
  }
  return available[0];
}

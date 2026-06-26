export function toLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function pluralizeDays(count: number): string {
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return 'дней';
  const mod10 = count % 10;
  if (mod10 === 1) return 'день';
  if (mod10 >= 2 && mod10 <= 4) return 'дня';
  return 'дней';
}

export function pluralizeYears(count: number): string {
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return 'лет';
  const mod10 = count % 10;
  if (mod10 === 1) return 'год';
  if (mod10 >= 2 && mod10 <= 4) return 'года';
  return 'лет';
}

const formatter = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const shortFormatter = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
});

export function formatDate(date: Date): string {
  return formatter.format(date);
}

export function formatShortDate(date: Date): string {
  return shortFormatter.format(date);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

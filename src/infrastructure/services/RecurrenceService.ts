import { Recurrence } from '../../domain/enums/Recurrence';

export function calcularSiguienteFecha(base: Date, recurrence: Recurrence): Date {
  const next = new Date(base);

  switch (recurrence) {
    case Recurrence.DAILY:
      next.setDate(next.getDate() + 1);
      break;
    case Recurrence.WEEKLY:
      next.setDate(next.getDate() + 7);
      break;
    case Recurrence.MONTHLY:
      next.setMonth(next.getMonth() + 1);
      break;
    case Recurrence.NONE:
    default:
      break;
  }

  return next;
}

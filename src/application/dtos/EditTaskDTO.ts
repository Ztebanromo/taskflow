import { Priority } from '../../domain/enums/Priority';
import { Recurrence } from '../../domain/enums/Recurrence';

export interface EditTaskDTO {
  id: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  priority?: Priority;
  category?: string;
  recurrence?: Recurrence;
  dueDate?: Date;
  autoRenew?: boolean;
}

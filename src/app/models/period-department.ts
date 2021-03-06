import { MongoidId } from './mongoid-id';
import {
  PeriodDepartmentItemParams,
  PeriodDepartmentItem,
} from './period-department-item';

interface PeriodDepartmentPartials {
  name?: string;
}

export interface PeriodDepartmentParams extends PeriodDepartmentPartials {
  period_department_items?: PeriodDepartmentItemParams[];
}

export interface PeriodDepartment extends MongoidId, PeriodDepartmentPartials {
  period_department_items?: PeriodDepartmentItem[];
}

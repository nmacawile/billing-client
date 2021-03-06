import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Template } from '../models/template';
import { Department } from '../models/department';
import { DepartmentItem } from '../models/department-item';
import { ItemsService } from './items.service';
import { Item } from '../models/item';
import { DateHelpers } from '../lib/date-helpers';
import { Billing } from '../models/billing';
import { Period } from '../models/period';
import { PeriodDepartment } from '../models/period-department';
import { PeriodDepartmentItem } from '../models/period-department-item';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  private items: Item[];

  constructor(private fb: FormBuilder, private itemsService: ItemsService) {
    this.itemsService.getItems().subscribe((items) => (this.items = items));
  }

  newBillingForm(data: {
    template?: Template;
    client_name: string;
  }): FormGroup {
    const templateId = data.template?._id.$oid;
    const clientName = data.template?.client_name || data.client_name;
    const departments: Department[] = data.template?.departments || [];

    return this.fb.group({
      template: [{ value: templateId, disabled: true }],
      client_name: clientName,
      client_address: data.template?.client_address,
      _format: data.template?._format,
      start_date: [{ value: '', disabled: true }],
      end_date: [{ value: '', disabled: true }],
      total: 0,
      discount: 0,
      periods: this.fb.array([this.newPeriodForm(departments)]),
    });
  }

  rebuildBillingForm(billing: Billing): FormGroup {
    const {
      created_at,
      updated_at,
      periods,
      _id,
      template_id,
      start_date,
      end_date,
      ...billingParams
    } = billing;
    const templateId = template_id?.$oid;

    return this.fb.group({
      template: [{ value: templateId, disabled: true }],
      start_date: [{ value: start_date, disabled: true }],
      end_date: [{ value: end_date, disabled: true }],
      ...billingParams,
      periods: this.fb.array(this.rebuildPeriodForms(periods)),
    });
  }

  rebuildPeriodForms(periods: Period[]): FormGroup[] {
    return periods.map((p) => {
      return this.fb.group({
        start_date: p.start_date,
        end_date: p.end_date,
        days_off: [p.days_off],
        period_departments: this.fb.array(
          this.rebuildPeriodDepartmentForms(p.period_departments || []),
        ),
      });
    });
  }

  rebuildPeriodDepartmentForms(
    periodDepartments: PeriodDepartment[],
  ): FormGroup[] {
    return periodDepartments.map((pd) => {
      return this.fb.group({
        name: pd.name,
        period_department_items: this.fb.array(
          this.rebuildPeriodDepartmentItemForms(
            pd.period_department_items || [],
          ),
        ),
      });
    });
  }

  rebuildPeriodDepartmentItemForms(
    period_department_items: PeriodDepartmentItem[],
  ): FormGroup[] {
    return period_department_items.map((pdi) => {
      return this.fb.group({
        days: pdi.days,
        days_off: [pdi.days_off],
        name: pdi.name,
        price: pdi.price,
        quantity: pdi.quantity,
        total_copies: pdi.total_copies,
        amount: pdi.amount,
        total_deductions: pdi.total_deductions,
      });
    });
  }

  newPeriodForm(
    departments: Department[] = [],
    dateRange?: { start_date: Date; end_date: Date },
  ): FormGroup {
    const periodDepartmentForms =
      departments.length > 0
        ? departments?.map((department) =>
            this.newPeriodDepartmentForm({ department }),
          )
        : [this.newPeriodDepartmentForm()];

    const _dateRange = dateRange || DateHelpers.getPrevious(new Date());

    return this.fb.group({
      start_date: _dateRange?.start_date,
      end_date: _dateRange?.end_date,
      days_off: [[]],
      period_departments: this.fb.array(periodDepartmentForms),
    });
  }

  newPeriodDepartmentForm(data?: {
    department?: Department;
    days_off?: Date[];
  }): FormGroup {
    const department = data?.department;
    const days_off = data?.days_off;
    const departmentItems =
      department && department.department_items
        ? department.department_items.map((departmentItem) =>
            this.newPeriodDepartmentItemForm({ departmentItem, days_off }),
          )
        : [this.newPeriodDepartmentItemForm({ days_off })];

    return this.fb.group({
      name: department?.name,
      period_department_items: this.fb.array(departmentItems),
    });
  }

  newPeriodDepartmentItemForm(data?: {
    departmentItem?: DepartmentItem;
    days_off?: Date[];
  }): FormGroup {
    const departmentItem = data?.departmentItem;
    const days_off = data?.days_off;
    const item = this.findItem(departmentItem);

    return this.fb.group({
      name: item?.name,
      price: departmentItem?.price || item?.price,
      days: departmentItem?.days || '',
      quantity: departmentItem?.quantity,
      total_copies: '',
      amount: [{ value: '', disabled: true }],
      total_deductions: '',
      days_off: [days_off || []],
    });
  }

  private findItem(di?: DepartmentItem): Item | undefined {
    let item;
    if (di) {
      item = this.items.find((i) => i['_id']['$oid'] == di['item_id']['$oid']);
    }
    return item;
  }
}

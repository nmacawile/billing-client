import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-period-department',
  templateUrl: './period-department.component.html',
  styleUrls: ['./period-department.component.scss'],
})
export class PeriodDepartmentComponent implements OnInit {
  @Input('department_form') department_form: FormGroup;
  @Output() delete = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  deleteDepartment(): void {
    this.delete.emit();
  }

  get period_department_items(): FormArray {
    return this.department_form.get('period_department_items') as FormArray;
  }
}

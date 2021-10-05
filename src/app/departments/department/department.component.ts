import { Component, Input, OnInit } from '@angular/core';
import { Department, DepartmentParams } from '../../models/department';
import { DepartmentsService } from '../../services/departments.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent implements OnInit {
  @Input('departments') departments: Department[];
  @Input('department') department: Department;
  @Input('templateId') templateId: string;

  constructor(private departmentsService: DepartmentsService) {}

  ngOnInit(): void {
    this.department.department_items = this.department.department_items || [];
  }

  saveDepartment(department: Department): void {
    const { department_items, ...deptParams } = department;
    this.departmentsService
      .updateDepartment(this.templateId, this.id, deptParams)
      .subscribe();
  }

  deleteDepartment(): void {
    this.departmentsService.deleteDepartment(
      this.templateId,
      this.id,
    ).subscribe(() => {
      const index = this.departments.indexOf(this.department);
      this.departments.splice(index, 1);
    });
  }

  get id(): string {
    return this.department['_id']['$oid'];
  }
}

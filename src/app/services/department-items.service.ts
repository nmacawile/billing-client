import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service';
import { DepartmentItemParams } from '../models/department-item';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentItemsService {
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
  ) {}

  updateDepartmentItem(
    templateId: string,
    departmentId: string,
    id: string,
    department_item: DepartmentItemParams,
  ): Observable<void> {
    return this.http
      .patch<void>(this.departmentItemsPath(templateId, departmentId, id), {
        department_item,
      })
      .pipe(
        tap(
          () =>
            this.notificationService.notify('Department Item has been saved.'),
          (err) =>
            this.notificationService.notify(
              'Error ' + err.status + ': ' + err.error.message,
            ),
        ),
      );
  }

  createDepartmentItem(
    templateId: string,
    departmentId: string,
    department_item: DepartmentItemParams,
  ): Observable<{ id: string }> {
    return this.http
      .post<{ id: string }>(
        this.departmentItemsPath(templateId, departmentId),
        { department_item },
      )
      .pipe(
        tap(
          () =>
            this.notificationService.notify(
              'Department Item has been created.',
            ),
          (err) =>
            this.notificationService.notify(
              'Error ' + err.status + ': ' + err.error.message,
            ),
        ),
      );
  }

  deleteDepartmentItem(
    templateId: string,
    departmentId: string,
    id: string,
  ): Observable<void> {
    return this.http
      .delete<void>(this.departmentItemsPath(templateId, departmentId, id))
      .pipe(
        tap(
          () =>
            this.notificationService.notify(
              'Department Item has been deleted.',
            ),
          (err) =>
            this.notificationService.notify(
              'Error ' + err.status + ': ' + err.error.message,
            ),
        ),
      );
  }

  private departmentItemsPath(
    templateId: string,
    departmentId: string,
    p: string = '',
  ): string {
    return (
      environment.serverUrl +
      'templates/' +
      templateId +
      '/departments/' +
      departmentId +
      '/department_items/' +
      p
    );
  }
}

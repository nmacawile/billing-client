import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { TemplatesService } from '../services/templates.service';
import { Template } from '../models/template';
import { BillingsService } from '../services/billings.service';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BillingTemplateResolver implements Resolve<any> {
  constructor(
    private templatesService: TemplatesService,
    private billingsService: BillingsService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    const billingId: string = route.params.billing_id;

    return this.billingsService.getBilling(billingId).pipe(
      mergeMap(
        (billing) => {
          const templateId = billing?.template_id?.$oid;
          if (templateId) return this.templatesService.getTemplate(templateId);
          return of(null);
        },
        (billing, template) => ({ billing, template }),
      ),
    );
  }
}

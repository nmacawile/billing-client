import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormGroup } from '@angular/forms';
import { Template } from '../../models/template';
import { BillingsService } from '../../services/billings.service';
import { FormBuilderService } from '../../services/form-builder.service';

@Component({
  selector: 'app-billings-form',
  templateUrl: './billings-form.component.html',
  styleUrls: ['./billings-form.component.scss'],
})
export class BillingsFormComponent implements OnInit {
  billingForm: FormGroup;
  template: Template;
  templateId: string;

  constructor(
    private route: ActivatedRoute,
    private billingsService: BillingsService,
    private fbs: FormBuilderService,
  ) {}

  ngOnInit(): void {
    this.template = this.route.snapshot.data.template;
    this.templateId = this.template?._id.$oid;
    const client_name = this.route.snapshot.queryParams.client_name;

    this.billingForm = this.fbs.billingForm({
      template: this.template,
      client_name: client_name,
    });
  }

  onFormSubmit(): void {
    const billingData = this.billingForm.getRawValue();
    this.billingsService.createBilling(billingData).subscribe();
  }

  get periodsFormArray(): FormArray {
    return this.billingForm.get('periods') as FormArray;
  }
}

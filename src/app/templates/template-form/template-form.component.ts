import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateParams } from '../../models/template';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss'],
})
export class TemplateFormComponent implements OnInit {
  templateForm: FormGroup;
  @Output() formSubmit = new EventEmitter<TemplateParams>();
  @Input('title') title: string;
  @Input('template') template: TemplateParams = {
    name: '',
    client: {
      name: '',
    },
    _paper_size: 'short',
    split: true,
  };
  @Input('submitLabel') submitLabel: string;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.templateForm = this.fb.group({
      name: [this.template.name, [Validators.required]],
      split: [this.template.split],
      _paper_size: [this.template._paper_size],
      client: this.fb.group({
        name: [this.template.client.name, [Validators.required]],
        address: [this.template.client.address],
      }),
    });
  }

  onSubmit(): void {
    const params: TemplateParams = this.templateForm.getRawValue();
    this.formSubmit.emit(params);
  }
}

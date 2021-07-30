import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../templates.service';
import { TemplateParams } from '../../models/template';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.scss'],
})
export class NewTemplateComponent implements OnInit {
  constructor(
    private templatesService: TemplatesService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  createTemplate(templateParams: TemplateParams): void {
    this.templatesService
      .createTemplate(templateParams)
      .subscribe(() => this.router.navigate(['/templates']));
  }
}

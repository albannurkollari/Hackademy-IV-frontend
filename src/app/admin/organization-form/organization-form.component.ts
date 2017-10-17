import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { REGEXES as regexes } from './organization-form.constants';
import { DataService } from '../services/data.service';
import { LocalizationService } from '../services/localization.service';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss']
})

export class OrganizationFormComponent implements OnInit {
  strings: Object = {};
  pageHeader = 'organizationNew';
  formControls = {
    orgNumber:    new FormControl('', [Validators.required, Validators.pattern(regexes.organizationName)]),
    name:         new FormControl('', [Validators.required]),
    address:      new FormControl('', [Validators.required]),
    contactName:  new FormControl('', [Validators.required]),
    contactPhone: new FormControl('', [Validators.required]),
    contactEmail: new FormControl('', [Validators.required, Validators.pattern(regexes.email)]),
    bankAccount:  new FormControl('', [Validators.required, Validators.pattern(regexes.bankAccount)]),
    city:         new FormControl('', [Validators.required, Validators.pattern(regexes.city)]),
    zipCode:      new FormControl('', [Validators.required, Validators.pattern(regexes.zipCode)]),
    description:  new FormControl('', [Validators.required])
  };

  ngOnInit() {
    this._localization.setHeaders(this.strings, this.pageHeader);
  }

  constructor(private _localization: LocalizationService, private _dataService: DataService) { }
}

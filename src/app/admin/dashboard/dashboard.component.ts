import { Component, OnInit } from '@angular/core';

// Services
import { LocalizationService } from '../services/localization.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  strings: Object = {};
  errors: any[] = [];
  pageHeader = 'dashboard';

  ngOnInit() {
    this._localization.setHeaders(this.strings, this.pageHeader);
  }

  constructor(private _localization: LocalizationService) { }
}

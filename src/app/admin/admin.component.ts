import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { DataService } from './services/data.service';
import { LocalizationService } from './services/localization.service';

// Constants
import * as CONSTANTS from './admin.links';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
  links = CONSTANTS.LINKS;
  strings: Object = {};
  localLng = 'us';
  header: string;
  errors: any[] = [];

  ngOnInit() {
    // We load all strings of selected language in this block of code.
    this._localization.loadLng(this.localLng).subscribe(
      strings => {
        if (strings !== undefined && typeof strings === 'object' && Object.keys(strings).length > 0) {
          this.strings = strings;
          this._localization.storeLng(strings);

          // We load header title specific to the router-outlet inside admin page by subscribing to an observable shared on a service.
          this._localization.header.subscribe(
            header => {
              this.header = header;
            },
            error => this.errors.push(error)
          );

          const _adminPath = this._router.url.endsWith('admin');

          if (_adminPath) {
            this._router.navigateByUrl('/admin/dashboard');
          }
        }
      },
      error => this.errors.push(error)
    );
  }

  constructor(private _router: Router, private _localization: LocalizationService) { }
}

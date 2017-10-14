import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  header: string;

  constructor(private _router: Router, private _adminFetcher: DataService) {
    _adminFetcher.observables.header.subscribe(
      header => {
        this.header = header;
      }
    );
  }

  ngOnInit() {
    const _adminPath = this._router.url.endsWith('admin');

    if (_adminPath) {
      this._router.navigateByUrl('/admin/dashboard');
    }
  }
}

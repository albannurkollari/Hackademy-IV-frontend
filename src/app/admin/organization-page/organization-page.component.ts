import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Organization } from '../interface/organization';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-organization-page',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.scss']
})

export class OrganizationPageComponent implements OnInit {
  private _organizationId = 0;
  private _organization: any;
  errors: any[] = [];

  get organizationId(): number {
    return this._organizationId;
  }

  set organizationId(value: number) {
    this._organizationId = value;

    if (value > 0) {
      this._dataService.getOrganizations().subscribe(
        organizations => this.organization = organizations.filter((v, k) => v.id === value)[0],
        error => this.errors.push(error)
      );
    }
  }

  get organization(){
    return this._organization;
  }

  set organization(value: Organization){
    this._organization = value;

    this._dataService.getProjects().subscribe(
      projects => this._organization.projects = projects.filter((v, k) => v.organizationId === value.id),
      error => this.errors.push(error)
    );
  }

  ngOnInit() {
    this.organizationId = +this.route.snapshot.paramMap.get('id');
  }

  constructor(public route: ActivatedRoute, public router: Router, private _dataService: DataService) {
    _dataService.setObservables('_headerSource', 'organization overview');
  }
}

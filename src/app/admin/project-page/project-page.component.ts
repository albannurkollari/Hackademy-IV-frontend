import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { DataService } from '../services/data.service';

// Interfaces
import { Project } from '../interface/project';
import { LocalizationService } from '../services/localization.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})

export class ProjectPageComponent implements OnInit {
  private _projectId: number;
  private _project: any;
  strings: Object = {};
  pageHeader = 'projectOverview';
  errors: any[] = [];

  get project(){
    return this._project;
  }

  set project(value: Project) {
    this._project = value;

    if (value.organizationId > 0 ) {
      this._dataService.getOrganizations().subscribe(
        res => {
          this._project.organization = res.filter((v, k) => v.id === value.organizationId)[0];
          console.log('Fetched Organization', this._project.organization);
        },
        error => this.errors.push(error)
      );
    } else {
      this._project.organization = null;
    }
  }

  get projectId(): number{
    return this._projectId;
  }

  set projectId(value: number) {
    this._projectId = value;

    if (value > 0) {
      this._dataService.getProjects().subscribe(
        res => {
          this.project = res.filter((v, k) => v.id === value)[0];
        },
        error => {
          this.errors.push(error);
        }
      );
    }
  }

  ngOnInit() {
    this._localization.setHeaders(this.strings, this.pageHeader);
    this.projectId = +this.route.snapshot.paramMap.get('id');
  }

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private _localization: LocalizationService,
    private _dataService: DataService
  ) { }
}

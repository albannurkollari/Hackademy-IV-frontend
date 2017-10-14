import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';
import { MatSort } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

// Services
import { DataService } from '../services/data.service';

// Interfaces
import { Project } from '../interface/project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})

export class ProjectListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  color = 'primary';
  mode = 'determinate';
  proList: any[];
  projectId = 0;
  project: any;
  errors: any[] = [];
  dataSource: ProjectDataSource | null;
  displayedColumns = ['picture', 'projectName', 'fromDate', 'toDate', 'goal', 'funded'];

  handleRowClick(row) {
    this._router.navigateByUrl('/admin/projects/view/' + row.id);
  }

  ngOnInit() {
    this.dataSource = new ProjectDataSource(this._dataService, this.sort);
    console.log('this.datasource', this.dataSource);
  }

  constructor(private _dataService: DataService, private _router: Router ) {
    _dataService.setObservables('_headerSource', 'project list');
  }
}

export class ProjectDataSource extends DataSource<any> {
  errors: any[] = [];
  orgList: Project[];

  constructor(private _serviceFetch: DataService, private _sorter: MatSort) {
    super();
  }


  subject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  connect(): Observable<Project[]> {

    const displayDataChanges = [
      this.subject,
      this._sorter.sortChange
    ];

    if (!this.subject.isStopped) {
      this._serviceFetch.getProjects()
        .subscribe(res => {
          console.log('Value', this.subject);
          this.subject.next(res);
        });
      return Observable.merge(...displayDataChanges).map(() => {
        return this.getSortedData();
      });
    }
  }

  disconnect() {
    this.subject.complete();
    this.subject.observers = [];
    console.log('disconnected!');
  }

  getSortedData(): Project[] {
    const data = this.subject.value.slice();

    if (!this._sorter.active || this._sorter.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sorter.active) {
        case 'id':          [propertyA, propertyB] = [a.id, b.id]; break;
        case 'todate':      [propertyA, propertyB] = [a.toDate, b.toDate]; break;
        case 'projectName': [propertyA, propertyB] = [a.projectName, b.projectName]; break;
        case 'address':     [propertyA, propertyB] = [a.address, b.address]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sorter.direction === 'asc' ? 1 : -1);
    });
  }
}

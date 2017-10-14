import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

// Services
import { DataService } from '../services/data.service';

// Interfaces
import { Organization } from '../interface/organization';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})

export class OrganizationListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  dataSource: OrganizationDataSource | null;
  displayedColumns = ['id', 'name', 'address', 'person', 'phone'];

  handleRowClick(row) {
    this._router.navigateByUrl('/admin/organizations/view/' + row.id);
  }

  ngOnInit() {
    this.dataSource = new OrganizationDataSource(this._dataService, this.sort);
  }

  constructor(private _dataService: DataService, private _router: Router ) {
    _dataService.setObservables('_headerSource', 'organization list');
  }
}

export class OrganizationDataSource extends DataSource<any> {
  errors: any[] = [];
  orgList: Organization[];

  constructor(private _serviceFetch: DataService, private _sorter: MatSort) {
    super();
  }


  subject: BehaviorSubject<Organization[]> = new BehaviorSubject<Organization[]>([]);

  connect(): Observable<Organization[]> {
    const displayDataChanges = [
      this.subject,
      this._sorter.sortChange
    ];

    if (!this.subject.isStopped) {
      this._serviceFetch.getOrganizations()
        .subscribe(res => {
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
  }

  getSortedData(): Organization[] {
    const data = this.subject.value.slice();

    if (!this._sorter.active || this._sorter.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sorter.active) {
        case 'id':      [propertyA, propertyB] = [a.id, b.id]; break;
        case 'orgId':   [propertyA, propertyB] = [a.orgId, b.orgId]; break;
        case 'name':    [propertyA, propertyB] = [a.name, b.name]; break;
        case 'address': [propertyA, propertyB] = [a.address, b.address]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sorter.direction === 'asc' ? 1 : -1);
    });
  }
}

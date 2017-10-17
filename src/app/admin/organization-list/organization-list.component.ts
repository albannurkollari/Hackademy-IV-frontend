import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

// Services
import { LocalizationService } from '../services/localization.service';
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

  strings: Object = {};
  pageHeader = 'organizationList';
  dataSource: OrganizationDataSource | null;
  displayedColumns = []; // ['id', 'name', 'address', 'person', 'phone'];
  columns: Object = {};
  allColumns: Object[] = [];

  handleRowClick(row) {
    this._router.navigateByUrl('/admin/organizations/view/' + row.id);
  }

  setAllColumns: Function = (data: any): any[] => {
    if (data !== undefined && data.length > 0) {
      data = data[0];
      const tempArray = [];

      for (const _col in data) {
        if (data.hasOwnProperty(_col)) {
          let _validate = false;
          let newCol = {};

          switch (_col) {
            case 'orgId':
            case 'name':
            case 'address':
            case 'contact':
              _validate = true;
              break;
            default:
              break;
          }

          newCol = {
            label: _col,
            value: this.strings[_col],
            show: _validate
          };

          if (_col === 'contact') {
            const contact = data[_col];

            for (const key in contact) {
              if (contact.hasOwnProperty(key)) {
                switch (key) {
                  case 'email':
                    _validate = false;
                    break;
                  default:
                    _validate = true;
                    break;
                }

                newCol = {
                  label: key,
                  value: this.strings[key],
                  show: _validate
                };

                tempArray.push(newCol);
              }
            }
          } else {
            tempArray.push(newCol);
          }
        }
      }

      return tempArray;
    }
  }

  setPageStrings: Function = (): void => {
    this._localization.lng.subscribe(
      strings => {
        this.strings = strings;

        if (strings !== undefined && Object.keys(strings).length > 0) {
          this._dataService.getOrganizations().subscribe(
            orgs => {
              this.allColumns = this.setAllColumns(orgs);

              if (this.allColumns !== undefined && Object.keys(this.allColumns).length > 0) {
                if (this.displayedColumns.length <= 0) {
                  for (const col of this.allColumns) {
                    if (col['show']) {
                      this.displayedColumns.push(col['label']);
                    }
                  }
                } else {
                  // this.ref.detectChanges();
                }

                this.dataSource = new OrganizationDataSource(this._dataService, this.sort);
              }
            }
          );
        }
      }
    );
  }

  insertValues: Function = (label: string, row: any): string => {
    if (label === undefined || typeof label !== 'string' || label.trim().length <= 0 || row === undefined) {
      return;
    }

    let _value = '';

    switch (label) {
      case 'person':
      case 'phone':
        _value = row.contact[label];
        break;
      default:
        _value = row[label];
        break;
    }

    return _value;
  }

  ngOnInit() {
    this._localization.setHeaders(this.strings, this.pageHeader);

    if (localStorage.getItem('localization') && this.setPageStrings !== undefined) {
      this.setPageStrings();
    }
  }

  constructor(
    private ref: ChangeDetectorRef,
    private _localization: LocalizationService, private _dataService: DataService, private _router: Router) { }
}

export class OrganizationDataSource extends DataSource<any> {
  errors: any[] = [];
  orgList: Organization[];
  subject: BehaviorSubject<Organization[]> = new BehaviorSubject<Organization[]>([]);

  getSortedData: Function = (): Organization[] => {
    const data = this.subject.value.slice();

    if (!this._sorter.active || this._sorter.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sorter.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'orgId': [propertyA, propertyB] = [a.orgId, b.orgId]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'address': [propertyA, propertyB] = [a.address, b.address]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sorter.direction === 'asc' ? 1 : -1);
    });
  }

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

  constructor(private _serviceFetch: DataService, private _sorter: MatSort) {
    super();
  }
}

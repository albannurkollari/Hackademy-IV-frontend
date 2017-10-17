import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';


// Interfaces
import { Organization, NewOrganization } from '../interface/organization';
import { Project, NewProject } from '../interface/project';

@Injectable()
export class DataService {
  private _headerSource: Subject<string> = new BehaviorSubject<string>('');

  private _paths = {
    root: '../../../assets/mockdata/',
    organizations: 'organizations.json',
    newOrganizations: 'newOrganizations.json',
    projects: 'projects.json',
    newProjects: 'newProjects.json'
  };

  observables = {
    header: this._headerSource.asObservable()
  };

  setObservables(obs: string, value: string) {
    const _validate = obs === undefined || typeof obs !== 'string' || obs.length <= 0 ||
    value === undefined || typeof value !== 'string' || value.length <= 0;

    if (_validate) {
      return;
    }

    if (this.observables !== undefined) {
      this[obs].next(value);
    }
  }

  // Updated!
  // Doesn't break code which calls this function.
  private _get(path: string, options?: Object): Observable<any> {
    if (path === undefined) {
      return;
    }

    // In this snippet we call specified request of HTTP where we include 'params' property of options
    // in GET call. This way we can get a specific record of the data for instance getOrganization({id: 1})
    // will grab that database record where organization id is 1 and no other.
    // 'options' parameter is optional so it can be skipped therefore we let user do a full data query to the database
    // or the path given.
    if (options !== undefined && Object.keys(options).length > 0) {
      const params = new HttpParams();

      for (const option in options) {
        if (options.hasOwnProperty(option)) {
          const value = options[option];
          params.set(option, value);
        }
      }

      return this.http.get(path, {
        params: params
      })
      .do((data: Response) => {
        return data !== undefined ? data : [];
      })
      .catch((error: Response) => {
        console.log(error['message']);
        return Observable.throw(error || 'Server error');
      });
    } else {
      return this.http.get(path)
      .do((data: Response) => {
        return data !== undefined ? data : [];
      })
      .catch((error: Response) => {
        console.log(error['message']);
        return Observable.throw(error || 'Server error');
      });
    }
  }

  private _set(path: string, data: any): boolean {
    // tslint:disable-next-line:prefer-const
    let _inserted = false;

    return _inserted;
  }

  // DEPRICATED!
  // Use either of getOrganizations/getProjects/getOrganization(arg)/getProject(arg)!
  // tslint:disable-next-line:member-ordering
  get = {
    organizations: (): any => {
      return this._get(this._paths.root + this._paths.organizations);
    },
    projects: (): any => {
      return this._get(this._paths.root + this._paths.projects);
    }
  };

  // Get all Organizations records data from the path. Requires no arguments to input.
  // Returns a set of Organization (interface) Observable.
  getOrganizations(): Observable<Organization[]> {
    return this._get(this._paths.root + this._paths.organizations);
  }

  getNewOrganizations(): Observable<NewOrganization[]> {
    return this._get(this._paths.root + this._paths.newOrganizations);
  }

  // Get only 1 Organization record data with parameterized query. options is an Object argument which
  // should have at least 1 property + value.
  // Returns a Organization (interface) Observable.
  getOrganization(options: Object): Observable<Organization> {
    if (options === undefined || typeof options === 'object' || Object.keys(options).length <= 0) {
      return;
    }

    return this._get(this._paths.root + this._paths.organizations, options);
  }

  // Get all Projects records data from the path. Requires no arguments to input.
  // Returns a set of Project (interface) Observable.
  getProjects(): Observable<Project[]> {
    return this._get(this._paths.root + this._paths.projects);
  }
  getNewProjects(): Observable<NewProject[]> {
    return this._get(this._paths.root + this._paths.newProjects);
  }
  // Get only 1 Project record data with parameterized query. options is an Object argument which
  // should have at least 1 property + value.
  // Returns a Project (interface) Observable.
  getProject(options: Object): Observable<Project> {
    if (options === undefined || typeof options === 'object' || Object.keys(options).length <= 0) {
      return;
    }

    return this._get(this._paths.root + this._paths.projects, options);
  }

  getClosedProjects(list: any[], options: Object): any {
    if (list === undefined) {
      return;
    }

    this._get(this._paths.root + this._paths.projects).subscribe(
      res => {
        if (res !== undefined && res.length > 0) {
          list = res.filter((v, k) => {
            return v.open === 'false';
          });
        }
      },
      error => console.log(error)
    );

    return list;
  }

  constructor(private http: HttpClient) { }
}

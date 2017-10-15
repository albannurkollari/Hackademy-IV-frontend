import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { DataService } from './data.service';

@Injectable()
export class LocalizationService {
  private _stringsSource: Subject<Object> = new BehaviorSubject<Object>({});
  private _paths = {
    root: '../../../assets/localization/',
    all: 'languages_all.json',
    sq: 'sq.json',
    sv: 'sv.json',
    us: 'us.json'
  };

  functions: LocalizationFunctions = new LocalizationFunctions(this.client, this._paths);
  loadLng     = this.functions.fetchStrings;
  storeLng    = this.functions.storeStrings;
  setHeaders  = this.functions.setHeaders;
  lng         = this.functions.lng;
  header      = this.functions.header;

  constructor(private client: HttpClient) { }
}

class LocalizationFunctions {
  private _lng: Subject<Object>           = new BehaviorSubject<Object>({});
  private _headerSource: Subject<string>  = new BehaviorSubject<string>('');

  lng: Observable<Object>                 = this._lng.asObservable();
  header: Observable<string>              = this._headerSource.asObservable();

  // Functions/Methods
  private _get(path: string, options?: Object): Observable<any> {
    if (path === undefined || typeof path !== 'string' || path.trim().length <= 0) {
      return;
    }

    if (options !== undefined && Object.keys(options).length > 0) {
      const params = new HttpParams();

      for (const option in options) {
        if (options.hasOwnProperty(option)) {
          const value = options[option];
          params.set(option, value);
        }
      }

      return this._http.get(path, { params: params }).do(
        (data: Response) => {
          return data !== undefined ? data : [];
        }).catch(
        (error: Response) => {
          return Observable.throw(error || 'Server error');
        });
    } else {
      return this._http.get(path).do(
        (data: Response) => {
          return data !== undefined ? data : [];
        }).catch(
        (error: Response) => {
          return Observable.throw(error || 'Server error');
        });
    }
  }

  fetchStrings = (lng: string = 'us'): Observable<Object> => {
    return this._get(this._paths.root + this._paths[lng]);
  }

  storeStrings = (data: Object) => {
    this._lng.next(data);
  }

  setHeaders = (strings: Object, _header: string) => {
    if (_header === undefined || typeof _header !== 'string' || _header.trim().length <= 0) {
      return;
    }

    this.lng.subscribe(
      res => {
        strings = res;

        if (strings !== undefined) {
          if (strings.hasOwnProperty(_header)) {
            this._headerSource.next(strings[_header]);
          }
        }
      }
    );
  }

  constructor(private _http: HttpClient, private _paths: any) { }
}

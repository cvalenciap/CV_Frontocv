import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Response} from '../interfaces/';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';

@Injectable()
export class VisaService {

  constructor(private http: HttpClient, private API: ApiService) {
  }

  sessionVISA(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.getSessionVisa, data);
  }

}

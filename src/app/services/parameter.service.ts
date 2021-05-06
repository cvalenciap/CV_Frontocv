import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {Response} from '../interfaces/';

@Injectable()
export class ParameterService {

  constructor(private http: HttpClient, private API: ApiService) {
  }

  listParameters(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.listParameters, data);
  }

  addParameter(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.addParameter, data);
  }

  editParameter(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.editParameter, data);
  }

}

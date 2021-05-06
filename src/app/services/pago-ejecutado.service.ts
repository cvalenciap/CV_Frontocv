import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {Response} from '../interfaces/';

@Injectable()
export class PagoEjecutadoService {

  constructor(private http: HttpClient, private API: ApiService) {
  }

  getPayResult(body: any): Observable<Response> {
    return this.http.post<Response>(this.API.getPayResult, body);
  }

  /* init intermediate screen */
  getPaySuccessData(body: any): Observable<Response> {
    return this.http.post<Response>(this.API.getPaySuccessData, body);
  }
  /* end intermediate screen */

}

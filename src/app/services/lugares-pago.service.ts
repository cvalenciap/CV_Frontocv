import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {Response} from '../interfaces/';
import {Observable} from 'rxjs';

@Injectable()
export class LugaresPagoService {

  constructor(private http: HttpClient, private API: ApiService) {
  }

  lstLugaresPagoAgencias(): Observable<Response> {
    return this.http.get<Response>(this.API.listAgencies);
  }

  lstLugaresPagoSucursales(body: any): Observable<Response> {
    return this.http.post<Response>(this.API.listBranches, body);
  }
  
}

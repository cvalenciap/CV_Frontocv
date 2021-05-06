import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {Response} from '../interfaces/';
import {Observable} from 'rxjs';

@Injectable()
export class SupplyService {

  constructor(private http: HttpClient, private API: ApiService) {
  }

  listSupplies(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.listSupplies, data);
  }

  detailSupply(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.detailSupply, data);
  }

  obtenerGrafico(element: any): Observable<Response> {
    return this.http.post<Response>(this.API.historicalConsumption, element);
  }

}

import {Injectable} from '@angular/core';
import {Response} from '../interfaces';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnchufateService {

  constructor(private http: HttpClient, private API: ApiService) {
  }

  generarLiquidacion(dataEnchufate: any): Observable<Response> {
    return this.http.post<Response>(this.API.genLiquidation, dataEnchufate);
  }

  /*actualizacion mastercard*/
  generarLiquidacion2(dataEnchufate: any): Observable<Response> {
    return this.http.post<Response>(this.API.genLiquidation2, dataEnchufate);
  }

}

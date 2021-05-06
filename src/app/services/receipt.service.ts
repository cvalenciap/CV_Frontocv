import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {Response} from '../interfaces/';
import {Observable} from 'rxjs';
import {ReciboPDF} from '../models';

@Injectable()
export class ReceiptService {

  constructor(private http: HttpClient, private API: ApiService) {
  }

  listPendingReceipts(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.pendingReceipts, data);
  }

  listPaidReceipts(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.paidReceipts, data);
  }

  viewReceipt(element: ReciboPDF): Observable<Response> {
    return this.http.post<Response>(this.API.viewReceipt, element);
  }

  validateReceipt(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.validateReceipt, data);
  }

  detailReceipt(element: any): Observable<Response> {
    return this.http.post<Response>(this.API.detailReceipt, element);
  }

  detailPagos(element: any): Observable<Response> {
    return this.http.post<Response>(this.API.detailPagos, element);
  }

}

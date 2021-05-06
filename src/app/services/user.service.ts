import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiService} from './api.service';
import {Response} from '../interfaces/';
import {Observable} from 'rxjs';



@Injectable()
export class UserService {
  headers: HttpHeaders;

  constructor(private http: HttpClient, private API: ApiService) {
    this.headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Access-Control-Allow-Headers', 'Content-Type')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods', 'POST')
    .set('Access-Control-Allow-Credentials', 'true');
  }

  verifySuministro(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.verifySupply, data);
  }

  verifyReferencias(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.verifyReferences, data);
  }

  verifyDocumento(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.verifyDocument, data);
  }

  createUser(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.createUser, data);
  }

  updateUser(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.updateUser, data);
  }

  infoUser(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.infoUser, data);
  }

  confirmAccount(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.confirmAccount, data);
  }

  forgotPassword(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.forgotPassword, data);
  }

  updatePassword(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.updatePassword, data);
  }
  
  sendConfirmation(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.sendConfirmation, data);
  }

  sendCodeVerify(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.sendCodeVerify, data);
  }

}

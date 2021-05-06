import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ApiService} from './api.service';
import {Response} from '../interfaces/';
import {catchError, map} from 'rxjs/operators';
import {empty, Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class MainService {

  constructor(private http: HttpClient, private API: ApiService, private route: Router) {
  }

  public async verifyToken(force = true) {
    if (localStorage.getItem(environment.initialToken) && force) {
      const session = JSON.parse(localStorage.getItem(environment.initialToken));
      if (new Date().getTime() > session.expires_at) {
        await this.setToken();
      }
    } else {
      await this.setToken();
    }
    return;
  }

  public getInitialData(): Promise<Response> {
    return this.http.get<Response>(this.API.initialData).toPromise();
  }

  public getDatosImagenes(): Observable<Response> {
    const body = {
      categoria: 'DATOS_IMAGENES'
    };
    return this.http.post<Response>(this.API.getParametersCat, body);
  }

  getTitulos(): Observable<Response> {
    return this.http.get<Response>(this.API.getTittles);
  }

  private setToken(): Promise<Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http
      .post<Response>(
        this.API.login,
        `username=${environment.login.username}&password=${
          environment.login.password
          }`,
        httpOptions
      )
      .pipe(
        map(response => {
          if (response.nRESP_SP) {
            this.setSession(response.bRESP);
          }
          return response;
        }), catchError(err => {
          if (!this.route.url.includes('error')) {
            this.route.navigate(['/error']);
          }
          return empty();
        })
      ).toPromise();
  }

  private setSession(session: any): void {
    session.expires_at = 1000 * 60 * 60 + new Date().getTime();
    /*let temp = session;
    delete temp.user["admin_com"];
    delete temp.user["admin_etic"];*/
    localStorage.setItem(environment.initialToken, JSON.stringify(session));
  }

}

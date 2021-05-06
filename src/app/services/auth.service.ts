import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {ApiService} from './api.service';
import {Response} from '../interfaces/';
import {Observable} from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private API: ApiService) {
  }

  login(data: any): Observable<Response> {
    const loginURL = this.API.loginNewUser;
    return this.http
      .post<Response>(loginURL, data)
      .pipe(
        map(response => {
          if (response.nRESP_SP === 1 && response.bRESP.flagRespuesta !== 'B') {
            localStorage.setItem('suministro', response.bRESP.nis_rad);
            this.setSession({user: response.bRESP, correo: data.correo});
          }
          /*add storage for code verify*/
          else if(response.nRESP_SP === 2 && response.bRESP.flag_respuesta === 'B') {
            localStorage.setItem('suministro', response.bRESP.nis_rad);
            this.setSession({user: response.bRESP, correo: data.correo});
          }
          /**/
          return response;
        })
      );
  }

  logout() {
    /*defina user opt*/
    var userOpt = localStorage.getItem("userOptional");
    localStorage.removeItem(environment.appname);
    localStorage.clear();
    /*set user opt*/
    localStorage.setItem("userOptional", userOpt);
  }

  getUser(): any {
    if (localStorage.getItem(environment.appname)) {
      const session = JSON.parse(localStorage.getItem(environment.appname));
      return session.user;
    } else {
      return null;
    }
  }

  getCorreo(): any {
    if (localStorage.getItem(environment.appname)) {
      const session = JSON.parse(localStorage.getItem(environment.appname));
      return session.correo;
    } else {
      return null;
    }
  }

  public isAuthenticated(): boolean {
    if (localStorage.getItem(environment.appname)) {
      const session = JSON.parse(localStorage.getItem(environment.appname));
      return new Date().getTime() < session.expires_at;
    } else {
      return false;
    }
  }

  private setSession(session: any): void {
    session.expires_at = 1000 * 60 * 60 + new Date().getTime();
    /*let temp = session;
    this.globals.admin_com = temp.user.admin_com;
    this.globals.admin_etic = temp.user.admin_etic;
    delete temp.user["admin_com"];
    delete temp.user["admin_etic"];*/
    localStorage.setItem(environment.appname, JSON.stringify(session));
    /*add optative session*/
    localStorage.setItem("userOptional", session.correo);
  }

  /*add verify code*/
  verifyCode(data: any): Observable<Response> {
    return this.http.post<Response>(this.API.verifyCode, data);
  }
}

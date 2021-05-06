import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {Response} from '../interfaces/';
import {Observable} from 'rxjs';

@Injectable()
export class IncidenciasService {

  constructor(private http: HttpClient, private API: ApiService) {
  }

  listMunicipiosAfectados(): Observable<Response> {
    return this.http.get<Response>(this.API.affectedTown);
  }

  listIncidenciasSuministro(dataSuministro: any): Observable<Response> {
    return this.http.post<Response>(this.API.incidencesSupply, dataSuministro);
  }

  getSuministroAfectado(dataSuministro) : Observable<Response> {
    return this.http.post<Response>(this.API.affectedSupply, dataSuministro)
  }

}

import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Incidencia, Municipio} from '../../models';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {AuthService, IncidenciasService} from '../../services';
import {MarcadorMunicipio} from '../../models/marcador-municipio';
import {MarcadorGeneral} from '../../models/marcador-general';
import {MapaGeneralComponent} from './mapa-general/mapa-general.component';
import {MatDialog} from '@angular/material';
import {MunicipioMapaComponent} from './municipio-mapa/municipio-mapa.component';
import {IncidenciaMapaComponent} from './incidencia-mapa/incidencia-mapa.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.scss']
})

export class IncidenciasComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  width = '60%';
  private _mobileQueryListener: () => void;
  municipios: Municipio[];
  incidencias: Incidencia[];
  marcadores: MarcadorMunicipio[];
  @BlockUI() blockUI: NgBlockUI;
  error = '';
  loading = true;
  showMunicipios = true;
  mensajeError: string = 'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.';
  overMapa: Array<any>;
  over: Array<any>;
  nom_municipio: string;

  constructor(private incidenciasService: IncidenciasService,
              private authService: AuthService,
              private router: Router,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              public dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (this.mobileQuery.matches) {
      this.width = '95%';
    }
    let user = this.authService.getUser();
    this.blockUI.start('Cargando información');
    if (user.admin_etic > 0 || user.admin_com > 0) {
      this.incidenciasService.listMunicipiosAfectados().subscribe(
        response => {
          if (response.nRESP_SP) {
            this.municipios = response.bRESP;
            this.overMapa = new Array(this.municipios.length);
            this.overMapa.fill(false);
            this.over = new Array(this.municipios.length);
            this.over.fill(false);
          } else {
            this.error = response.cRESP_SP;
          }
          this.blockUI.stop();
        },
        () => {
          this.loading = false;
          this.error = this.mensajeError;
          this.blockUI.stop();
        }
      );
    } else {
      let sum_sesion = localStorage.getItem('suministro');
      let nis_rad;
      if (sum_sesion != undefined && sum_sesion != ''){
        nis_rad = sum_sesion;
      } else {
        nis_rad = this.authService.getUser().nis_rad;
      }
      const body = {
        //nis_rad: this.authService.getUser().nis_rad
        nis_rad: nis_rad
      };
      this.incidenciasService.listIncidenciasSuministro(body).subscribe(
        response => {
          if (response.nRESP_SP) {
            this.municipios = response.bRESP;
            this.overMapa = new Array(this.municipios.length);
            this.overMapa.fill(false);
            this.over = new Array(this.municipios.length);
            this.over.fill(false);
          } else {
            this.error = response.cRESP_SP;
          }
          this.blockUI.stop();
        },
        () => {
          this.loading = false;
          this.error = this.mensajeError;
          this.blockUI.stop();
        }
      );
    }
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  OpenMapaGeneral() {
    this.marcadores = new Array<MarcadorMunicipio>();
    this.blockUI.start();
    this.municipios.forEach((m) => {
      m.incidencias.forEach((i) => {
        let marcador = new MarcadorGeneral();
        marcador.draggable = true;
        marcador.label = 'A';
        marcador.lat = i.latitud;
        marcador.lng = i.longitud;
        marcador.nom_municipio = m.nom_municipio;
        marcador.nom_incidencia = i.nom_incidencia;
        marcador.tipo_incidencia = i.tipo_incidencia;
        marcador.fecha_incidencia = i.fecha_inicio;
        marcador.fecha_estimada_sol = i.fecha_estimada_sol;
        this.marcadores.push(marcador);
      });
    });
    if (this.marcadores.length > 0) {
      this.dialog.open(MapaGeneralComponent, {
        width: this.width,
        data: {markers: this.marcadores}
      });
    }
    this.blockUI.stop();
  }

  OpenMapaMunicipio(municipio: Municipio) {
    this.marcadores = new Array<MarcadorMunicipio>();
    municipio.incidencias.forEach((e) => {
      let marcador = new MarcadorMunicipio();
      marcador.draggable = true;
      marcador.label = 'A';
      marcador.lat = e.latitud;
      marcador.lng = e.longitud;
      marcador.nom_incidencia = e.nom_incidencia;
      marcador.tipo_incidencia = e.tipo_incidencia;
      marcador.fecha_incidencia = e.fecha_inicio;
      marcador.fecha_estimada_sol = e.fecha_estimada_sol;
      this.marcadores.push(marcador);
    });
    if (this.marcadores.length > 0) {
      this.dialog.open(MunicipioMapaComponent, {
        width: this.width,
        data: {municipality: municipio, markers: this.marcadores}
      });
    }
  }

  OpenMapaIncidencia(incidencia: Incidencia) {
    this.dialog.open(IncidenciaMapaComponent, {
      width: this.width,
      data: {incidence: incidencia, distrito: this.nom_municipio}
    });
  }

  viewDetail(municipio: Municipio) {
    this.showMunicipios = false;
    this.nom_municipio = municipio.nom_municipio;
    this.incidencias = municipio.incidencias;
  }

}

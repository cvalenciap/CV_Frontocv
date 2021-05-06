import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ToastrService} from 'ngx-toastr';
import {LugaresPagoService} from '../../services/lugares-pago.service';
import {Agencia} from '../../models/agencia';
import {Sucursal} from '../../models/sucursal';
import {Marcador} from '../../models/marcador';
import {MatDialog} from '@angular/material';
import {SucursalMapaComponent} from './sucursal-mapa/sucursal-mapa.component';
import {AgenciaMapaComponent} from './agencia-mapa/agencia-mapa.component';
import {MediaMatcher} from '@angular/cdk/layout';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-lugares-pago',
  templateUrl: './lugares-pago.component.html',
  styleUrls: ['./lugares-pago.component.scss']
})

export class LugaresPagoComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  error = '';
  @BlockUI() blockUI: NgBlockUI;
  mensajeError: string = 'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.';
  loading = false;
  success = false;
  agenciasPago: Agencia[];
  agenciaPago: Agencia;
  sucursalesPago: Sucursal[];
  sucursalesPago2: Sucursal[];
  sucursalPago: Sucursal;
  selectedRow = -1;
  marcadores: Marcador[];
  width = '60%';
  private _mobileQueryListener: () => void;

  constructor(
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private service: LugaresPagoService,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (this.mobileQuery.matches) {
      this.width = '95%';
    }
    this.agenciasPago = new Array<Agencia>();
    this.agenciaPago = new Agencia();
    this.blockUI.start();
    this.service.lstLugaresPagoAgencias().subscribe(
      response => {
        if (response.nRESP_SP) {
          this.agenciasPago = response.bRESP;
          this.agenciaPago = this.agenciasPago[0];
          const body = {
            cod_agencia: this.agenciasPago[0].cod_agencia
          };
          this.service.lstLugaresPagoSucursales(body).subscribe(
            response => {
              if (response.nRESP_SP) {
                this.sucursalesPago = response.bRESP;
              } else {
                this.error = response.cRESP_SP;
              }
              this.blockUI.stop();
            },
            error => {
              this.loading = false;
              this.error = this.mensajeError;
              this.blockUI.stop();
            }
          );
          this.success = true;
        } else {
          this.error = response.cRESP_SP;
        }
        this.blockUI.stop();
      },
      error => {
        this.loading = false;
        this.error = this.mensajeError;
        this.blockUI.stop();
      }
    );
  }

  OnSelectRow(index: number, agenciaPago: Agencia) {
    var elementoshtml = document.getElementById('tabla_agencias').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    this.selectedRow = index;
    this.agenciaPago = agenciaPago;
    for (var i = 0; i < elementoshtml.length; i++) {
      elementoshtml[i].className = '';
    }
    elementoshtml[index].className = 'selected-agency';
    //this.sucursalesPago = new Array<Sucursal>();
    this.sucursalPago = new Sucursal();
    this.blockUI.start();
    const body = {
      cod_agencia: this.agenciaPago.cod_agencia
    };
    this.service.lstLugaresPagoSucursales(body).subscribe(
      response => {
        if (response.nRESP_SP) {
          this.sucursalesPago = response.bRESP;
        } else {
          this.error = response.cRESP_SP;
        }
        this.blockUI.stop();
      },
      error => {
        this.loading = false;
        this.error = this.mensajeError;
        this.blockUI.stop();
      }
    );
  }

  OnMuestraMapaPrincipal(agenciaPago: Agencia) {
    this.sucursalesPago2 = new Array<Sucursal>();
    this.marcadores = new Array<Marcador>();
    this.blockUI.start();
    const body = {
      cod_agencia: agenciaPago.cod_agencia
    };
    this.service.lstLugaresPagoSucursales(body).subscribe(
      response => {
        if (response.nRESP_SP) {
          this.sucursalesPago2 = response.bRESP;
          this.sucursalesPago2.forEach((e) => {
              let marcador = new Marcador();
              marcador.draggable = true;
              marcador.label = 'A';
              marcador.lat = e.latitud;
              marcador.lng = e.longitud;
              marcador.dir_recaudador = e.dir_recaudador;
              marcador.nom_recaudador = e.nom_recaudador;
              marcador.distrito = e.distrito;
              this.marcadores.push(marcador);
            }
          );
          if (this.marcadores.length > 0) {
            this.dialog.open(AgenciaMapaComponent, {
              width: this.width,
              data: {agency: agenciaPago, markers: this.marcadores}
            });
          }
        } else {
          this.error = response.cRESP_SP;
        }
        this.blockUI.stop();
      },
      error => {
        this.loading = false;
        this.error = this.mensajeError;
        this.blockUI.stop();
      }
    );

  }

  OpenMapaPrincipal(sucursalPago: Sucursal) {
    this.dialog.open(SucursalMapaComponent, {
      width: this.width,
      data: {branch: sucursalPago}
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SupplyService} from '../../services/supply.service';
import {ReceiptService} from '../../services/receipt.service';
import {environment} from '../../../environments/environment';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material';
import {HistoricoConsumoComponent} from './historico-consumo/historico-consumo.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService, AuthService} from '../../services';
import {OpenDialogDirective} from '../../directives';
import {PagoEjecutadoService} from '../../services/pago-ejecutado.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-suministro',
  templateUrl: './suministro.component.html',
  styleUrls: ['./suministro.component.scss']
})
export class SuministroComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  token: string;
  suministros: any[];
  suministro: any;
  selected: any;
  success = false;
  estado: string;
  direccion: string;
  admin_etic: number;
  admin_com: number;
  deuda_total: string;
  nom_cliente: string;
  anterior: number;
  width = '70%';
  height = null;
  form: FormGroup;
  suministroFound = false;
  mensajePago: string;
  showSuministro = true;
  @ViewChild(OpenDialogDirective) openDialog;
  recibos: any;
  nis_rad: any;
  navigationSubscription;
  mobileQuery: MediaQueryList;
  cargaListas = false;
  mostratMsj: false;
  msj= "";

  correo: string;
  /* inicio cvalenciap */
  flagChannel: number;
  flagMultiple: number;

  private _mobileQueryListener: () => void;

  constructor(private supplyService: SupplyService,
              private receiptService: ReceiptService,
              private userService: UserService,
              private toastr: ToastrService,
              public dialog: MatDialog,
              private paidService: PagoEjecutadoService,
              private router: Router,
              private actRoute: ActivatedRoute,
              private authService: AuthService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && this.showSuministro === false) {
        this.showSuministro = true;
        this.ngOnInit();
      }
    });
    this.form = new FormGroup({
      suministro: new FormControl(
        '',
        [Validators.required, Validators.pattern('^[0-9]{7}$')]//,
        //this.verifySuministro.bind(this)
      )
    });
    /*inicio intermediate screen*/
    if (this.router.url.includes('consulta-recibos')) {
      this.actRoute.params.subscribe(params => {
        this.token = params['token'];
      });
    }
    /* if(this.router.url.includes('respuesta-operacion')){
      this.actRoute.params.subscribe(params => {
        this.token = params['token']
      });
    } */
    /*fin intermediate screen*/
  }

  ngOnInit() {
    /* add flagChannel */
    this.flagChannel = Number.parseInt(environment.flagChannel);
    if (this.mobileQuery.matches) {
      this.width = '80%';
      this.height = '70%';
    }
    if (this.token !== undefined) {
      this.paidService.getPayResult({
        trxID: this.token
      }).subscribe(response => {
        if (response.nRESP_SP === 1) {
          if (response.bRESP.cod_visa === 0 && response.bRESP.cod_enchufate !== 0) {
            this.mensajePago = 'Ocurrió un error al ejecutar el pago de tu recibo. Por favor, contactate con nosotros.';
          } else {
            this.mensajePago = response.cRESP_SP;
          }
          let src = 'resultPaymentError';
          if (response.bRESP.cod_visa === 0 && response.bRESP.cod_enchufate === 0) {
            src = 'resultPaymentOK';
            this.mensajePago = 'Transacción de pago completada con éxito. Se remitió el detalle de la operación a la dirección de correo consignada durante el proceso.';
          }
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: src,
            mensaje: this.mensajePago
          });
        } else {
          /*this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'resultPaymentError',
            mensaje: response.cRESP_SP
          });*/
        }
      }, error => {
        return;
      });
    }
    const session = JSON.parse(localStorage.getItem(environment.appname));
    this.admin_etic = session.user.admin_etic;
    this.admin_com = session.user.admin_com;
    if (this.admin_etic == 1 || this.admin_com == 1) {
      let sum_sesion = localStorage.getItem('suministro');
      if (sum_sesion != undefined && sum_sesion != ''){
        this.form.get('suministro').patchValue(sum_sesion);
      }
    }
    /* inicio cvalenciap */
    this.correo = this.authService.getCorreo();    
    const body = {
      nis_rad: this.form.value.suministro === '' ? session.user.nis_rad : this.form.value.suministro,
      auth_correo : this.correo
      /* add flagChannel */
      ,flagChannel : this.flagChannel
    };
    /* const body = {
      nis_rad: this.form.value.suministro === '' ? session.user.nis_rad : this.form.value.suministro
    }; */
    //this.admin_etic = this.globals.admin_etic;
    this.suministros = new Array<any>();
    //if (this.admin_etic === 0) {
    
    this.getSuministros(body);
    //}
  }

  getSuministros(body) {
    if (body.nis_rad === '' || !(/^[0-9]{7}$/).test(body.nis_rad)) {
      this.suministroFound = false;
      this.blockUI.stop();
      return {notFound: true};
    }
    this.blockUI.start();
    this.supplyService.listSupplies(body).subscribe(
      response => {
        if (response.nRESP_SP) {
          this.success = true;
          this.suministros = response.bRESP;
          this.selected = parseInt(body.nis_rad, 10);
          /* inicio */
          /* this.getSupplyInfo(this.selected); */
          this.getSupplyInfo(this.selected, null);
          this.cargaListas = true;
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    );
  }

  getSupplyInfo(supply: any, flagMultiple: any) {
    if (supply === '' || !(/^[0-9]{7}$/).test(supply)) {
      this.suministroFound = false;
      this.blockUI.stop();
      return {notFound: true};
    }
    this.success = false;
    this.estado = '';
    this.direccion = '';
    this.nom_cliente = '';
    this.deuda_total = '0.00';
    const body = {
      nis_rad: supply,
      /* inicio cvalenciap */
      auth_correo: this.correo,
      flag_multiple: flagMultiple
      /* add flag channel */
      ,flagChannel : this.flagChannel
    };
    this.blockUI.start();
    this.supplyService.detailSupply(body).subscribe(
      response => {
        if (response.nRESP_SP) {
          if (response.bRESP.nom_cliente != undefined) {
            this.success = true;
          } else {
            this.success = false;
          }
          this.estado = response.bRESP.est_sum;
          this.direccion = response.bRESP.direccion;
          this.nom_cliente = response.bRESP.nom_cliente;
          this.deuda_total = response.bRESP.total_deuda;
        }
      },
      error => {
        this.blockUI.stop();
        this.success = false;
      }
    );
  }

  verifySuministro() {
    this.blockUI.start();
    let nis_rad = this.form.value.suministro;
    if (nis_rad === '' || !(/^[0-9]{7}$/).test(nis_rad)) {
      this.suministroFound = false;
      this.blockUI.stop();
      return {notFound: true};
    }
    this.userService.verifySuministro({nis_rad: nis_rad}).subscribe(
      response => {
        if (response.nRESP_SP) {
          this.NewSuministro(nis_rad);
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.toastr.warning(response.cRESP_SP, 'Error', {closeButton: true});
        }
      });
  }

  OnChangeSuministro(suministro: number) {
    if (suministro != undefined) {
      if (suministro.toString().length == 7 && suministro != this.anterior) {
        this.selected = suministro;
        this.anterior = suministro;
        /* inicio cvalenciap */
        this.flagMultiple = 1;
        localStorage.setItem('suministro', suministro.toString());
        /* this.getSupplyInfo(this.selected); */
        this.getSupplyInfo(this.selected, this.flagMultiple);
      }
    }
  }

  NewSuministro(suministro: number) {
    if (suministro != undefined) {
      if (suministro.toString().length == 7 && suministro != this.anterior) {
        this.selected = suministro;
        this.anterior = suministro;
        localStorage.setItem('suministro', suministro.toString());
        /* inicio cvalenicap */
        /* this.getSupplyInfo(this.selected); */
        this.getSupplyInfo(this.selected, null);
        const body = {
          nis_rad: suministro,
          /*inicio cvalenciap*/
          auth_correo : this.correo
          /* add flagChannel */
          ,flagChannel : this.flagChannel
        };
        this.getSuministros(body);
      }
    }
  }

  viewHistoricoConsumo() {
    if (this.success) {
      this.blockUI.start();
      this.dialog.open(HistoricoConsumoComponent, {
        height: this.height,
        width: this.width,
        data: {nis_rad: this.selected, estado: this.estado, direccion: this.direccion}
      });
    } else {
      this.toastr.error('No se ha seleccionado un suministro o no es correcto', 'Confirmación', {closeButton: true});
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  mostrarResumen(event) {
    (async () => {
      this.recibos = event.data.recibos;
      this.nis_rad = event.data.nis_rad;
      this.mostratMsj = event.data.mostrarMsj;
      this.msj = event.data.msj;
      this.blockUI.start();
      await this.delay(2000);
      this.blockUI.stop();
      this.showSuministro = false;
    })();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  stripText(control: FormControl) {
    control.setValue(control.value.replace(/[^0-9]/g, ''));
  }
}

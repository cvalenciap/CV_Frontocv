import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SupplyService} from '../../services/supply.service';
import {ReceiptService} from '../../services/receipt.service';
import {environment} from '../../../environments/environment';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material';
import {HistoricoConsumoComponent} from './../suministro/historico-consumo/historico-consumo.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService, AuthService} from '../../services';
import {OpenDialogDirective} from '../../directives';
import {PagoEjecutadoService} from '../../services/pago-ejecutado.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html',
  styleUrls: ['./operacion.component.scss']
})
export class OperacionComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  token: string;
  width = '70%';
  height = null;
  mensajePago: string;
  /* responseOK = false;
  responseERROR = false; */
  responseService: number;
  @ViewChild(OpenDialogDirective) openDialog;  
  mobileQuery: MediaQueryList;
  num_operacion: any;
  num_tarjeta: any;
  fecha_hora: any;
  cod_trx: any;
  monto: any;
  num_liquidacion: any;
  numero_soporte: any;
  correo_soporte: any;

  mailPay: string;


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
    /* this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && this.responseOK === false) {
        this.responseOK = false;
        this.ngOnInit();
      }
    }); */
    if(this.router.url.includes('respuesta-operacion')){
      this.actRoute.params.subscribe(params => {
        this.token = params['token'];
        this.mailPay = params['correo'];
      });
    }
  }

  ngOnInit() {
    if (this.mobileQuery.matches) {
      this.width = '80%';
      this.height = '70%';
    }
    this.blockUI.start();
    let src = 'resultPaymentError';
    this.mensajePago = 'Ocurrió un error al ejecutar el pago de tu recibo. Por favor, contáctate con nosotros.';
    if (this.token !== undefined) {
      this.paidService.getPayResult({
        trxID: this.token
        /* trxID: '0a558bfe-21e2-4085-b388-71e59a8bc723' */
      }).subscribe(response => {
        this.correo_soporte = response.bRESP.correo_soporte;
        this.numero_soporte = response.bRESP.numero_soporte;
        if (response.nRESP_SP === 1) {
          /* if (response.bRESP.cod_visa === 0 && response.bRESP.cod_enchufate === 0) { */
          if (response.bRESP.cod_visa === 0) {
            /* this.responseOK = true;
            this.responseERROR = false; */
            this.responseService = 1;
            this.paidService.getPaySuccessData({
              trxID: this.token
              /* trxID: '0a558bfe-21e2-4085-b388-71e59a8bc723' */
            }).subscribe(response => {
              if(response.nRESP_SP === 1){
                src = 'resultPaymentOK';
                this.mensajePago = response.cRESP_SP;
                console.log("respuesta");
                console.log(response.bRESP);
                /*set values*/
                this.num_operacion = response.bRESP.numOperacion;
                this.num_tarjeta = response.bRESP.numTarjeta;
                this.fecha_hora = response.bRESP.fechaHora;
                debugger;
                this.monto = this.numberWithCommas(parseFloat(response.bRESP.monto).toFixed(2));
                this.num_liquidacion = response.bRESP.numLiquidacion;
                this.cod_trx = response.bRESP.trxId;
                this.blockUI.stop();
                /**/
              }
              /* this.openDialog.onClick({
                dialogType: 'content',
                dialogSRC: src,
                mensaje: this.mensajePago
              }); */
            }, error => {
              return;
            });
          } else {
            /* this.responseERROR = true;
            this.responseOK = false; */
            if(response.bRESP.cod_visa && response.bRESP.cod_visa !== null) {
              this.responseService = 2;
            } else {
              this.responseService = 3;
            }
            this.blockUI.stop();
            /* this.openDialog.onClick({
              dialogType: 'content',
              dialogSRC: src,
              mensaje: this.mensajePago
            }); */
          }          
        } else {
          /* this.responseERROR = true;
          this.responseOK = false; */
          this.responseService = 3;
          this.blockUI.stop();
          /* this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: src,
            mensaje: this.mensajePago
          }); */
        }
      }, error => {
        return;
      });
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* mostrarResumen(event) {
    (async () => {
      this.recibos = event.data.recibos;
      this.nis_rad = event.data.nis_rad;
      this.mostratMsj = event.data.mostrarMsj;
      this.msj = event.data.msj;
      this.blockUI.start();
      await this.delay(2000);
      this.blockUI.stop();
    })();
  } */

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  regresar() {
    this.router.navigate(['/consulta-recibos']);
  } 

  numberWithCommas(x) {
      return x.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  
}

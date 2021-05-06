import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ApiService, EnchufateService, VisaService, AuthService} from '../../../services';
import {environment} from '../../../../environments/environment';
import {OpenDialogDirective} from '../../../directives';
import {ToastrService} from 'ngx-toastr';
import {LocationStrategy} from '@angular/common';
import {ContentDialogComponent} from '../../shared';
import {MatDialog} from '@angular/material';
import {DetallePagosComponent} from '../lista-recibo/detalle-pagos/detalle-pagos.component';
/*inicio cvalenciap*/
//import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
/* fin cvAlenciap */


@Component({
  selector: 'app-resumen-pago',
  templateUrl: './resumen-pago.component.html',
  styleUrls: ['./resumen-pago.component.scss']
})
export class ResumenPagoComponent implements OnInit, OnDestroy {

  @Input() recibos: any;  
  @Input() nis_rad: any;
  @Input() mostrarMsj: any;
  @Input() msj: any;
  @BlockUI() blockUI: NgBlockUI;
  subtotal: number = 0;
  comisionVisa: number = 0;
  /*actualizacion mastercard*/
  liquidacion: any;
  liquidacionEnchufate: any;
  liquidacionJob: any;
  /**/
  total: number = 0;
  documentos = new Array<any>();
  session: any;
  merchantId: any;
  scriptJS: any;
  filtersLoaded: Promise<boolean>;
  purchaseNumber: number;
  urlPOST: string;
  /*inicio cvalenciap*/
  validComision : boolean;
  validarButton : boolean;
  /*fin cvalenciap*/
  /*set parameter audit*/
  correo: string;
  flagChannel: number;
  /**/
  /*adecuacion proceso pago*/
  listaRegistros: any;
  @ViewChild(OpenDialogDirective) openDialog;
  @Output() Regresar = new EventEmitter();

  constructor(private visaService: VisaService,
              private toastr: ToastrService,
              private enchufateService: EnchufateService,
              private authService: AuthService,
              private apiURL: ApiService,
              private locationStrategy: LocationStrategy,
              public dialog: MatDialog) {
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }

  ngOnInit() {
    this.validarButton = true;
    this.preventBackButton();
    /*adecuacion mastercard*/
    /* this.urlPOST = this.apiURL.getPayResultVISA2; */
    this.urlPOST = this.apiURL.getPayResultVISA;
    /**/
    this.blockUI.start();
    /*set parameter log audit*/
    this.correo = this.authService.getCorreo();
    this.flagChannel =Number.parseInt(environment.flagChannel);
    /**/
    this.recibos.forEach(receipt => {
      let documento = {
        numeroDoc: receipt.recibo,
        fechaEmision: receipt.f_fact,
        fechaVencimiento: receipt.vencimiento,
        deuda: receipt.deuda
      };
      this.subtotal += (receipt.deuda);
      this.documentos.push(documento);
    });
    const datosVisa = {
      amount: Number.parseFloat(this.subtotal.toFixed(2))
    };
    this.visaService.sessionVISA(datosVisa).subscribe(response => {
      if (response.nRESP_SP == 1) {
        const body = {
          nis_rad: this.nis_rad,
          documentos: this.documentos
        };
        /* actualizacion mastercard */
        this.enchufateService.generarLiquidacion(body).subscribe(responseGenLiq => {
        /* this.enchufateService.generarLiquidacion2(body).subscribe(responseGenLiq => { */
          debugger;
          if (responseGenLiq.nRESP_SP == 1) {
            /*actualizacion mastercard*/
            this.liquidacion = responseGenLiq.bRESP.numeroLiquidacion;
            /* this.liquidacionEnchufate = responseGenLiq.bRESP.numeroLiquidacionEnchufate;
            this.liquidacionJob = responseGenLiq.bRESP.numeroLiquidacionJob; */
            /**/
            this.nis_rad = this.nis_rad;
            this.session = response.bRESP.sessionKey;
            this.merchantId = response.bRESP.merchantId;
            this.scriptJS = environment.scriptVisa;
            this.comisionVisa = Number.parseFloat(response.bRESP.comision);
            /*adecuacion proceso pago*/
            debugger;
            this.listaRegistros = encodeURI(responseGenLiq.bRESP.listaRegistros);
            /*inicio cvalenciap*/
            if(this.comisionVisa > 0){
              this.validComision = true;
            }else{
              this.validComision = false;
            }
            /*fin cvalenciap*/
            this.total = Number.parseFloat(this.subtotal.toFixed(2)) + this.comisionVisa;
            this.filtersLoaded = Promise.resolve(true);
            /*actualizacion mastercard*/
            this.purchaseNumber = this.liquidacion;
            /* this.purchaseNumber = Number.parseFloat(this.liquidacionEnchufate) === 0 ? this.liquidacionJob : this.liquidacionEnchufate; */
            /**/
            this.blockUI.stop();
            //this.toastr.warning('Recuerde no cerrar la página o navegador hasta completar el pago.', 'Advertencia', {closeButton: true, disableTimeOut: true});
            this.dialog.open(ContentDialogComponent, {
              maxWidth: 600,
              disableClose: false,
              data:{dialogType: 'content',
              dialogSRC: 'mensajePago'}
            });
          } else {
            this.blockUI.stop();
            this.openDialog.onClick({
              dialogType: 'content',
              dialogSRC: 'errorPago',
              mensaje: responseGenLiq.cRESP_SP
            });
          }
        }, errorGenLiq => {
          console.log('error generación liquidación');
          this.blockUI.stop();
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'errorPago',
            mensaje: 'Ocurrió un error en la aplicación. \n Vuelva a intentar más tarde.'
          });
        });
      } else {
        this.blockUI.stop();
        this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'errorPago',
            mensaje: response.cRESP_SP
          });
      }
    }, error => {
      console.log('error session');
      this.blockUI.stop();
      this.openDialog.onClick({
        dialogType: 'content',
        dialogSRC: 'errorPago',
        mensaje: 'Ocurrió un error en la aplicación. \n Vuelva a intentar más tarde.'
      });
    });
  }

  ngOnDestroy() {
    this.blockUI.start();
    // @ts-ignore
    VisanetCheckout = null;
    document.getElementById('visaNetWrapper').remove();
  }

  regresar() {
      this.Regresar.emit();
  }

  onSubmit() {
    console.log("entra submit resumen-pago");
    //this.blockUI.start();
  }

  /*inicio cvalenciap*/
  ngAfterViewInit(){
    $("formVisa").submit(function(event){
      console.log("entra a la validacion del submit de resumen-pago");
      this.blockUI.start();
    });
  }

}

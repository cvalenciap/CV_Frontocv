import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService, EnchufateService, VisaService, AuthService} from '../../../services';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-pagovisa',
  templateUrl: './pagovisa.html',
  styleUrls: ['./pagovisa.component.scss']
})
export class PagoVisaComponent implements OnInit {

  session: any;
  merchantId: any;
  scriptJS: any;
  filtersLoaded: Promise<boolean>;
  datosVisa: any;
  purchaseNumber: number;
  comision: number;
  montoFinal: number;
  /* actualizacion mastercard */
  liquidacion: number;
  liquidacionEnchufate: any;
  liquidacionJob: any;
  urlPOST: string;
  correo: string;
  flagChannel: number;
  subtotal: number = 0;
  comisionVisa: number = 0;
  total: number = 0;
  listaRegistros: any;
  validComision : boolean;
  documentos2 = new Array<any>();
  @Input() nis_rad: number;
  @Input() recibos: any;
  @Input() documentos = new Array<String>();
  @Input() ammount: any;
  @Output() GenerarLiquidacion = new EventEmitter();
  @BlockUI() blockUI: NgBlockUI;

  constructor(private visaService: VisaService,
              private apiURL: ApiService,
              private enchufateService: EnchufateService,
              private authService: AuthService) {
  }

  /*actualizacion mastercard*/
  ngOnInit() {
    this.blockUI.start();
    this.datosVisa = {
      amount: Number.parseFloat(this.ammount.toFixed(2))
    };
    this.visaService.sessionVISA(this.datosVisa).subscribe(response => {
      const body = {
        nis_rad: this.nis_rad,
        documentos: this.documentos
      };
      this.enchufateService.generarLiquidacion(body).subscribe(responseGenLiq => {
        this.liquidacion = responseGenLiq.bRESP.numeroLiquidacion;
        this.nis_rad = this.nis_rad;
        this.session = response.bRESP.session;
        this.merchantId = response.bRESP.merchantId;
        this.scriptJS = environment.scriptVisa;
        this.comision = Number.parseFloat(response.bRESP.comision);
        this.montoFinal = Number.parseFloat(this.ammount.toFixed(2)) + this.comision;
        this.filtersLoaded = Promise.resolve(true);
        this.purchaseNumber = Math.floor(Math.random() * 90000) + 10000;
        this.GenerarLiquidacion.emit({liquidacion: this.liquidacion, comision: this.comision});

        this.blockUI.stop();
      }, errorGenLiq => {
        console.log('error generación liquidación');
      });
    }, error => {
      console.log('error session');
    });
  }
  /* ngOnInit() {
    this.urlPOST = this.apiURL.getPayResultVISA2;
    this.blockUI.start();
    this.correo = this.authService.getCorreo();
    this.flagChannel =Number.parseInt(environment.flagChannel);
    this.recibos.forEach(receipt => {
      let documento = {
        numeroDoc: receipt.recibo,
        fechaEmision: receipt.f_fact,
        fechaVencimiento: receipt.vencimiento,
        deuda: receipt.deuda
      };
      this.subtotal += (receipt.deuda);
      this.documentos2.push(documento);
    });
    const datosVisa = {
      amount: Number.parseFloat(this.subtotal.toFixed(2))
    };
    this.visaService.sessionVISA(datosVisa).subscribe(response => {
      if (response.nRESP_SP == 1) {
        const body = {
          nis_rad: this.nis_rad,
          documentos: this.documentos2
        };
        this.enchufateService.generarLiquidacion2(body).subscribe(responseGenLiq => {
          debugger;
          if (responseGenLiq.nRESP_SP == 1) {
            this.liquidacionEnchufate = responseGenLiq.bRESP.numeroLiquidacionEnchufate;
            this.liquidacionJob = responseGenLiq.bRESP.numeroLiquidacionJob;
            this.nis_rad = this.nis_rad;
            this.session = response.bRESP.sessionKey;
            this.merchantId = response.bRESP.merchantId;
            this.scriptJS = environment.scriptVisa;
            this.comisionVisa = Number.parseFloat(response.bRESP.comision);
            this.listaRegistros = encodeURI(responseGenLiq.bRESP.listaRegistros);
            if(this.comisionVisa > 0){
              this.validComision = true;
            }else{
              this.validComision = false;
            }
            this.total = Number.parseFloat(this.subtotal.toFixed(2)) + this.comisionVisa;
            this.filtersLoaded = Promise.resolve(true);
            this.purchaseNumber = Number.parseFloat(this.liquidacionEnchufate) === 0 ? this.liquidacionJob : this.liquidacionEnchufate;
            this.GenerarLiquidacion.emit({liquidacionEnchufate: this.liquidacionEnchufate, liquidacionJob: this.liquidacionJob, comision: this.comision});
            this.blockUI.stop();
          } else {
            console.log(responseGenLiq.cRESP_SP);
          }
        }, errorGenLiq => {
          console.log('Ocurrió un error en la aplicación. \n Vuelva a intentar más tarde.');
        });
      } else {
        console.log(response.cRESP_SP);
      }
    }, error => {
      console.log('Ocurrió un error en la aplicación. \n Vuelva a intentar más tarde.');
    });
  } */

}

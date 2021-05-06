import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ReceiptService} from '../../../../services/receipt.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import {OpenDialogDirective} from '../../../../directives';
/*inicio cvalenciap*/
import {MainService} from '../../../../services/main.service';
/*fin cvalenciap*/

@Component({
  selector: 'app-detalle-recibo',
  templateUrl: './detalle-recibo.component.html',
  styleUrls: ['./detalle-recibo.component.scss']
})
export class DetalleReciboComponent implements OnInit {

  mensajeError: string = 'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.';
  @BlockUI() blockUI: NgBlockUI;
  detalleConceptosPago: any;
  diasVencidos: number = 0;
  detallePagosRecibo: any;
  fechaDia = new Date();
  totalDetalle: any;
  success: boolean;
  loading: boolean;
  error: any;
  documentos = new Array<any>();
  mostrarPagar: boolean = false;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  showInfo = false;
  info = "";
  @ViewChild(OpenDialogDirective) openDialog;
  comisionVisa: number;

  constructor(public dialogRef: MatDialogRef<DetalleReciboComponent>,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              /*inicio cvalenciap*/
              private mainService : MainService,
              /*fin cvalenciap*/
              @Inject(MAT_DIALOG_DATA) public data: any, private receiptService: ReceiptService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.totalDetalle = 0;
    this.blockUI.start();
    this.documentos.push(this.data.receipt);
    /* inicio cvalenciap */
    this.comisionVisa = this.data.comisionVisa;
    /* fin cvalenciap */
    this.receiptService.detailReceipt(this.data.receipt).subscribe(
      response => {
        if (response.nRESP_SP) {
          this.success = true;
          this.receiptService.detailPagos(this.data.receipt).subscribe(
            response => {
              if (response.nRESP_SP == 1) {
                this.success = true;
                this.detallePagosRecibo = response.bRESP;
                this.detallePagosRecibo.forEach(e => {
                  this.totalDetalle = this.totalDetalle + e.monto_pago;
                });
                let info = this.data.receipt;
                info.nis_rad = this.data.nis_rad;
                if (this.data.pendiente) {
                  this.receiptService.validateReceipt(info).subscribe(
                    response => {
                      if (response.bRESP) {
                        this.mostrarPagar = true;
                        if (response.cRESP_SP2 !== null) {
                          this.showInfo = true;
                          this.info = response.cRESP_SP2;
                          /* inicio cvalenciap */
                          this.comisionVisa = response.comisionVisa;
                        }
                      }
                      this.blockUI.stop();
                    },
                    error => {
                      this.blockUI.stop();
                      this.dialogRef.close();
                    }
                  );
                } else {
                  this.blockUI.stop();
                }
              } else {
                this.error = response.cRESP_SP;
              }
              /*if (!this.data.pendiente) {
                this.blockUI.stop();
              }*/
            },
            () => {
              this.loading = false;
              this.error = this.mensajeError;
              this.dialogRef.close();
              this.blockUI.stop();
            }
          );
          this.detalleConceptosPago = response.bRESP;
          if (this.data.pendiente) {
            this.OnVencido(this.data.receipt.vencimiento);
          }
        } else {
          this.error = response.cRESP_SP;
          this.blockUI.stop();
        }
      },
      () => {
        this.loading = false;
        this.error = this.mensajeError;
        this.dialogRef.close();
        if (!this.data.pendiente) {
          this.blockUI.stop();
        }
      }
    );
  }

  OnVencido(fechaVencimiento: string) {
    var oneDay = 24 * 60 * 60 * 1000;
    var fechaVcto = (new Date(fechaVencimiento)).getTime();
    var fechaHoy = this.fechaDia.getTime();
    if (fechaVcto < fechaHoy) {
      this.diasVencidos = Math.round(Math.abs(fechaVcto - fechaHoy) / (oneDay));
    }
  }

  pagarRecibo() {
    /* inicio cvalenciap */
    if(!this.verifyNavigator()){
      this.mainService.getInitialData().then(response => {
        if(response.nRESP_SP && response.bRESP){
          let listaMensajes = response.bRESP.lImagenes;
          this.openDialog.onClick({
            dialogType : 'content',
            dialogSRC : 'navigatorVersion',
            mensaje : response.bRESP.lImagenes.ODESC5
          });
        }
      });        
    }else{
      if(this.comisionVisa > 0){
        this.openDialog.onClick({
          dialogType: 'content',
          dialogSRC: 'confirmPayment',
          comision: this.comisionVisa,
          onEvent: (data: any) => {
            if (data === '1') {
              this.dialogRef.close(this.documentos);
            }
          }
        });
      }else{
        this.dialogRef.close(this.documentos);
      }
    }

    /* this.openDialog.onClick({
      dialogType: 'content',
      dialogSRC: 'confirmPayment',
      comision: this.comisionVisa,
      onEvent: (data: any) => {
        if (data === '1') {
          this.dialogRef.close(this.documentos);
        }
      }
    }); */
    /* fin cvalenciap */
  }

  /* inicio cvalenciap */
  verifyNavigator() : boolean{ 
    let temp, navigator;
    let valid = window.navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(valid[1])) {
        temp = /\brv[ :]+(\d+)/g.exec(window.navigator.userAgent) || [];
        if(Number.parseFloat(temp[1]) <= 11){
          console.log("navegador ie version " + temp);
          return false;
        }else{
          return true;
        }
    }
    valid = valid[2] ? [valid[1], valid[2]] : [navigator.appName, navigator.appVersion, '-?'];
    
    if (!valid[1] && (valid = window.navigator.userAgent.match(/version\/(\d+)/i)) != null) {
      valid.splice(1, 1, temp[1]);
    }

    if(Number.parseFloat(valid[1]) <= 11){
      console.log("navegador " + valid[0] + " version " + valid[1]);
      return false
    }
    return true;
  }
  /* fin cvalenciap */

}

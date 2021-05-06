import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ReceiptService} from '../../../../services/receipt.service';
import {VisaService} from '../../../../services/visa.service';
import {ApiService} from '../../../../services/api.service';
/*inicio cvalenciap*/
import {MainService} from '../../../../services/main.service';
/*fin cvalenciap*/
import {MatDialog, MatPaginator} from '@angular/material';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {SelectionModel} from '@angular/cdk/collections';
import {ReciboPendiente} from '../../../../models/recibo-pendiente';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DetalleReciboComponent} from '../detalle-recibo/detalle-recibo.component';
import {ToastrService} from 'ngx-toastr';
import {DetallePagosComponent} from '../detalle-pagos/detalle-pagos.component';
import {MediaMatcher} from '@angular/cdk/layout';
import {OpenDialogDirective} from '../../../../directives';

class PeriodicElement {
}

@Component({
  selector: 'app-recibos-pendientes',
  templateUrl: './recibos-pendientes.component.html',
  styleUrls: ['./recibos-pendientes.component.scss']
})
export class RecibosPendientesComponent implements OnInit, OnChanges, OnDestroy {
  selection = new SelectionModel<PeriodicElement>(true, []);
  recibosSeleccionados: ReciboPendiente[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @BlockUI() blockUI: NgBlockUI;
  checkedAll: boolean = false;
  selectedRow: number = -1;
  datos: ReciboPendiente[];
  @Input() supply: number;
  totalCheck: number = 0;
  dato: ReciboPendiente;
  totalPago: number = 0;
  fechaDia = new Date();
  modal: NgbModalRef;
  verRecibo = false;
  success = false;
  limit = 10;
  total = 0;
  widthDetalle = '50%';
  widthPagos = '70%';
  height = null;
  page = 1;
  tienePendientes = true;
  @Output() CargarPendientes = new EventEmitter();
  @Output() PagarMultiple = new EventEmitter();
  mobileQuery: MediaQueryList;
  showInfo = false;
  info = "";
  private _mobileQueryListener: () => void;
  @ViewChild(OpenDialogDirective) openDialog;
  comisionVisa: number;

  constructor(private receiptService: ReceiptService,
              private visaService: VisaService,
              private apiService: ApiService,
              private toastr: ToastrService,
              public dialog: MatDialog,
              /*inicio cvalenciap*/
              private mainService : MainService,
              /*fin cvalenciap*/
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (this.mobileQuery.matches) {
      this.widthDetalle = '80%';
      this.widthPagos = '80%';
      this.height = '70%';
    }
    this.dato = new ReciboPendiente();
    this.datos = new Array<ReciboPendiente>();
      this.getRecibosPendientes(this.page);
  }

  getRecibosPendientes(pagina: number, close = false) {
    if (this.supply == undefined) {
      return;
    }
    const body = {
      nis_rad: this.supply,
      page_num: pagina,
      page_size: 10
    };
    this.blockUI.start('Cargando Recibos Pendientes');
    this.totalCheck = 0;
    this.checkedAll = false;
    this.receiptService.listPendingReceipts(body).subscribe(
      response => {
        if (response.nRESP_SP) {
          this.success = true;
          this.datos = response.bRESP;
          this.total = response.total;
          if (this.datos.length === 0) {
            this.tienePendientes = false;
          } else {
            this.tienePendientes = true;
          }
          if (close) {
            this.blockUI.stop();
          }
          this.CargarPendientes.emit();
        } else {
          this.CargarPendientes.emit();
          //this.toastr.warning('No se encontraron recibos pendientes', 'Error', {closeButton: true});
        }
        this.page = pagina;
        //this.blockUI.stop();
      },
      error => {
        //this.toastr.error(error, 'Error', {closeButton: true});
        this.blockUI.stop();
        this.CargarPendientes.emit();
      }
    );
  }

  OnVencido(fechaVencimiento: string) {
    let fechaVcto = (new Date(fechaVencimiento)).getTime();
    let fechaHoy = this.fechaDia.getTime();
    if (fechaVcto < fechaHoy) {
      let oneDay = 24 * 60 * 60 * 1000;
      return Math.round(Math.abs(fechaVcto - fechaHoy) / (oneDay));
    }
    return 0;
  }

  ngOnChanges() {
    this.page = 1;
    this.total = 0;
    this.dato = new ReciboPendiente();
    this.datos = new Array<ReciboPendiente>();
    this.getRecibosPendientes(this.page);
  }

  goToPage(n: number): void {
    this.getRecibosPendientes(n, true);
  }

  onNext(): void {
    this.getRecibosPendientes(this.page + 1, true);
  }

  onPrev(): void {
    this.getRecibosPendientes(this.page - 1, true);
  }

  selectRow(index, item: ReciboPendiente) {
    //var elementoshtml = document.getElementById('tabla-pendientes').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    this.verRecibo = true;
    this.selectedRow = index;
    this.dato = item;
    /*for (var i = 0; i < elementoshtml.length; i++) {
      elementoshtml[i].style.background = 'white';
    }
    elementoshtml[index].style.background = '#b2d0ee';
    */
  }

  OnCheck(event, i, dato: ReciboPendiente) {
    let validar = false;
    if (i == 0) {
      validar = true;
    } else {
      if (!this.datos[i - 1].select) {
        validar = true;
      }
    }
    let monto = Number((dato.deuda).toFixed(2));

    if (dato.select) {
      if (validar) {
        this.blockUI.start();
        dato.nis_rad = this.supply;
        this.receiptService.validateReceipt(dato).subscribe(
          response => {
            if (response.bRESP != false) {
              this.success = true;
              this.totalCheck++;
              this.totalPago = Number((this.totalPago + monto).toFixed(2));
              this.comisionVisa = response.comisionVisa;
              if (i == 0 && response.cRESP_SP2 !== null) {
                this.showInfo = true;
                this.info = response.cRESP_SP2;
              }
            } else {
              dato.select = false;
              this.datos[i].select = false;
              this.toastr.warning(response.cRESP_SP, 'Advertencia', {closeButton: true});
            }
            this.blockUI.stop();
          },
          error => {
            //this.toastr.error(error, 'Error', {closeButton: true});
            this.blockUI.stop();
          }
        );
      } else {
        this.success = true;
        this.totalCheck++;
        this.totalPago = Number((this.totalPago + monto).toFixed(2));
      }
    } else {
      this.totalCheck = this.totalCheck - 1;
      this.showInfo = false;
      this.totalPago = Number((this.totalPago - monto).toFixed(2));
      let x = this.datos.length - 1;
      while (x >= i) {
        if (this.datos[x].select == true) {
          this.datos[x].select = false;
          this.totalCheck = this.totalCheck - 1;
          this.totalPago = Number((this.totalPago - this.datos[x].deuda).toFixed(2));
        }
        x--;
      }
    }
  }

  checkAll() {
    this.totalCheck = 0;
    this.totalPago = 0;
    if (this.checkedAll) {
      this.blockUI.start();
      this.datos[0].nis_rad = this.supply;
      this.receiptService.validateReceipt(this.datos[0]).subscribe(
        response => {
          if (response.bRESP) {
            for (let dato of this.datos) {
              dato.select = this.checkedAll;
              this.totalPago = Number((this.totalPago + dato.deuda).toFixed(2));
            }
            this.totalCheck = this.datos.length;
            if (response.cRESP_SP2 !== null) {
              this.showInfo = true;
              this.info = response.cRESP_SP2;
              this.comisionVisa = response.comisionVisa;
            }
          } else {
            this.checkedAll = false;
            this.toastr.warning(response.cRESP_SP, 'Advertencia', {closeButton: true});
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.warning(error, 'Error', {closeButton: true});
          this.blockUI.stop();
        }
      );
    } else {
      this.showInfo = false;
      for (const dato of this.datos) {
        dato.select = this.checkedAll;
      }
    }
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

  pagarMultiple() {
    if (this.totalPago > 0 && this.totalCheck > 0) {
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
          /* inicio cvalenciap */
          /* (data : any) => {
            if(data === '1'){ */
              this.recibosSeleccionados = [];
              for(let dato of this.datos){
                if(dato.select){
                  this.recibosSeleccionados.push(dato);
                }
              }
            /* }
          } */
          if(this.comisionVisa > 0){
            this.openDialog.onClick({
              dialogType : 'content',
              dialogSRC : 'confirmPayment',
              comision : this.comisionVisa,
              onEvent : (data: any) => {
                if(data === '1'){
                  this.PagarMultiple.emit({recibos: this.recibosSeleccionados, nis_rad: this.supply, mostrarMsj: this.showInfo, msj: this.info});
                }
              },
            });
          }else{
            this.PagarMultiple.emit({recibos: this.recibosSeleccionados, nis_rad: this.supply, mostrarMsj: this.showInfo, msj: this.info});
          }
          /* this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'confirmPayment',
            comision: this.comisionVisa,
            onEvent: (data: any) => {
              if (data === '1') {
                this.recibosSeleccionados = [];
                for (let dato of this.datos) {
                  if (dato.select) {
                    this.recibosSeleccionados.push(dato);
                  }
                }
                this.PagarMultiple.emit({recibos: this.recibosSeleccionados, nis_rad: this.supply, mostrarMsj: this.showInfo, msj: this.info});
              }
            }
          }); */
          /* fin cvalenciap */
        
      }
    } else {
      this.toastr.warning('No se han seleccionado recibos, por favor verifique', 'Advertencia', {closeButton: true});
    }
  }

  viewDetalle() {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado recibo', 'Advertencia', {closeButton: true});
    } else {
      const dialogDetail = this.dialog.open(DetalleReciboComponent, {
        height: this.height,
        width: this.widthDetalle,
        /* inicio cvalenciap */
        data: {receipt: this.dato, nis_rad: this.supply, pendiente: true, comisionVisa : this.comisionVisa}
        /* fin cvalenciap */
      });
      dialogDetail.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.PagarMultiple.emit({recibos: result, nis_rad: this.supply});
        }
        /*// @ts-ignore
        VisanetCheckout = null;
        document.getElementById('visaNetWrapper').remove();*/
      });
    }
  }

  viewPagos() {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado recibo', 'Advertencia', {closeButton: true});
    } else {
      this.receiptService.detailPagos(this.dato).subscribe(
        response => {
          if (response.nRESP_SP == 1) {
            if (response.bRESP.length > 0) {
              this.dialog.open(DetallePagosComponent, {
                height: this.height,
                width: this.widthPagos,
                data: {receipt: this.dato}
              });
            } else {
              this.toastr.warning('No se ha encontrado información de pagos', 'Atención', {closeButton: true});
            }
          } else {
            this.toastr.warning('No se ha encontrado información de pagos', 'Atención', {closeButton: true});
          }
          this.blockUI.stop();
        },
        () => {
          this.blockUI.stop();
          this.toastr.error('Error al traer información', 'Error', {closeButton: true});
        }
      );
    }
  }

  viewRecibo(element: ReciboPendiente): void {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado recibo', 'Advertencia', {closeButton: true});
    } else {
      this.blockUI.start();
      element.nis_rad = this.supply;
      this.receiptService.viewReceipt(element).subscribe(
        response => {
          if (response.bRESP != null && response.nRESP_SP == 1) {
            this.success = true;
            this.total = response.total;
            //this.toastr.info('Documento generado', 'Confirmación', {closeButton: true});
            this.downloadPDF(response.bRESP, element.recibo, element.f_fact);
          } else {
            this.toastr.warning(response.cRESP_SP, 'Advertencia', {closeButton: true});
          }
          this.blockUI.stop();
        },
        () => {
          this.blockUI.stop();
          this.toastr.error('No se puede descargar recibo', 'Error', {closeButton: true});
        }
      );
    }
  }

  downloadPDF(pdf, recibo, f_fact) {
    this.blockUI.start();
    const fileName = 'recibo-' + recibo.toString() + '-' + f_fact.toString() + '.pdf';

    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent)

    if (isIEOrEdge) {
      var byteCharacters = atob(pdf);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var blob = new Blob([byteArray], {type: 'application/pdf'});
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {

      const linkSource = 'data:application/pdf;base64,' + pdf;
      const downloadLink = document.createElement('a');
      downloadLink.download = fileName;
      downloadLink.href = linkSource;
      downloadLink.click();
      //downloadLink.remove();
    }
    this.getRecibosPendientes(this.page);
    this.blockUI.stop();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

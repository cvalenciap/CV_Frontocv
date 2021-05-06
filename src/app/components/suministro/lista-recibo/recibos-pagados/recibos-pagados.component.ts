import {
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {ReceiptService} from '../../../../services/receipt.service';
import {MatDialog, MatPaginator} from '@angular/material';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ReciboPagado} from '../../../../models/recibo-pagado';
import {ReciboPDF} from '../../../../models/recibo-pdf';
import {ToastrService} from 'ngx-toastr';
import {DetalleReciboComponent} from '../detalle-recibo/detalle-recibo.component';
import {DetallePagosComponent} from '../detalle-pagos/detalle-pagos.component';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-recibos-pagados',
  templateUrl: './recibos-pagados.component.html',
  styleUrls: ['./recibos-pagados.component.scss']
})
export class RecibosPagadosComponent implements OnInit, OnChanges, OnDestroy {
  datos: ReciboPagado[];
  dato: ReciboPagado;
  total = 0;
  page = 1;
  limit = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() supply: string;
  @BlockUI() blockUI: NgBlockUI;
  loading = false;
  success = false;
  error = '';
  mensajeError: string = 'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.';
  selectedRow: number = -1;
  verRecibo = false;
  widthDetalle = '50%';
  widthPagos = '70%';
  height = null;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  @Output() CargarPagados = new EventEmitter();

  constructor(private receiptService: ReceiptService,
              private toastr: ToastrService,
              public dialog: MatDialog,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.selectedRow = -1;
  }

  ngOnInit() {
    if (this.mobileQuery.matches) {
      this.widthDetalle = '80%';
      this.widthPagos = '80%';
      this.height = '70%';
    }
    this.dato = new ReciboPagado();
    this.datos = new Array<ReciboPagado>();
    this.getRecibosPagados(this.page);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getRecibosPagados(pagina: number) {
    if (this.supply == undefined) {
      return;
    }
    const body = {
      nis_rad: this.supply,
      page_num: pagina,
      page_size: 10
    };
    this.blockUI.start('Cargando Recibos Pagados');
    this.receiptService.listPaidReceipts(body).subscribe(
      response => {
        if (response.nRESP_SP) {
          this.success = true;
          this.datos = response.bRESP;
          this.total = response.total;
          this.CargarPagados.emit();
        } else {
          this.CargarPagados.emit();
          this.error = response.cRESP_SP;
        }
        //this.blockUI.stop();
      },
      () => {
        this.CargarPagados.emit();
        this.loading = false;
        this.error = this.mensajeError;
      }
    );
  }

  ngOnChanges() {
    this.page = 1;
    this.total = 0;
    this.dato = new ReciboPagado();
    this.datos = new Array<ReciboPagado>();
    this.getRecibosPagados(this.page);
  }

  goToPage(n: number): void {
    this.page = n;
    this.getRecibosPagados(this.page);
  }

  onNext(): void {
    this.page++;
    this.getRecibosPagados(this.page);
  }

  onPrev(): void {
    this.page--;
    this.getRecibosPagados(this.page);
  }

  selectRow(index, item: ReciboPagado) {
    //var elementoshtml = document.getElementById('tabla-pagados').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    this.verRecibo = true;
    this.selectedRow = index;
    this.dato = item;
    /*for (var i = 0; i < elementoshtml.length; i++) {
      elementoshtml[i].style.background = 'white';
    }
    elementoshtml[index].style.background = '#b2d0ee';*/
  }

  viewDetalle() {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado recibo', 'Error', {closeButton: true});
    } else {
      this.dialog.open(DetalleReciboComponent, {
        height: this.height,
        width: this.widthDetalle,
        data: {receipt: this.dato, nis_rad: this.supply, pendiente: false}
      });
    }
  }

  viewPagos() {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado recibo', 'Error', {closeButton: true});
    } else {
      this.blockUI.start();
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

  viewRecibo(element: ReciboPagado): void {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado recibo', 'Atención', {closeButton: true});
    } else {
      let envio = new ReciboPDF();
      envio.nis_rad = element.nis_rad;
      envio.sec_nis = element.sec_nis;
      envio.sec_rec = element.sec_rec;
      envio.f_fact = new Date(element.f_fact).toISOString().substr(0, 10);

      this.blockUI.start();
      this.receiptService.viewReceipt(envio).subscribe(
        response => {
          if (response.bRESP != null || response.nRESP_SP == 1) {
            this.success = true;
            this.total = response.total;
            //this.toastr.info('Documento generado', 'Confirmación', {closeButton: true});
            this.downloadPDF(response.bRESP, envio.nis_rad, envio.f_fact);
          } else {
            this.toastr.warning(response.cRESP_SP, 'Error', {closeButton: true});
            this.error = response.cRESP_SP;
          }
          this.blockUI.stop();
        },
        error => {
          this.loading = false;
          this.error = this.mensajeError;
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
    this.getRecibosPagados(this.page);
    this.blockUI.stop();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}

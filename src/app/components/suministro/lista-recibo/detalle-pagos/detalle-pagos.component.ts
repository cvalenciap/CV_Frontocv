import {Component, Inject, OnInit} from '@angular/core';
import {ReceiptService} from '../../../../services/receipt.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ToastrService} from 'ngx-toastr';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-detalle-pagos',
  templateUrl: './detalle-pagos.component.html',
  styleUrls: ['./detalle-pagos.component.scss']
})
export class DetallePagosComponent implements OnInit{

  mensajeError: string = 'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.';
  @BlockUI() blockUI: NgBlockUI;
  detallePagosRecibo: any;
  totalDetalle: any;
  success: boolean;
  loading: boolean;
  error: any;

  constructor(public dialogRef: MatDialogRef<DetallePagosComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private receiptService: ReceiptService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.totalDetalle = 0;
    this.blockUI.start();
    this.receiptService.detailPagos(this.data.receipt).subscribe(
      response => {
        if (response.nRESP_SP == 1) {
          this.success = true;
          this.detallePagosRecibo = response.bRESP;
          this.detallePagosRecibo.forEach(e => {
            this.totalDetalle = this.totalDetalle + e.monto_pago;
          });
          if (this.detallePagosRecibo.length > 0) {
          } else {
            this.error = response.cRESP_SP;
            this.toastr.warning('No se ha encontrado información de pagos', 'Atención', {closeButton: true});
          }
        } else {
          this.error = response.cRESP_SP;
          this.toastr.warning('No se ha encontrado información de pagos', 'Atención', {closeButton: true});
        }
        this.blockUI.stop();
      },
      error => {
        this.loading = false;
        this.error = this.mensajeError;
        this.blockUI.stop();
        this.dialogRef.close();
        //this.toastr.error('Error al traer información', 'Error', {closeButton: true});
      }
    );
  }
}

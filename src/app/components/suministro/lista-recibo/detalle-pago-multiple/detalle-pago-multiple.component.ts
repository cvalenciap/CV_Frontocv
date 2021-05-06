import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-detalle-pago-multiple',
  templateUrl: './detalle-pago-multiple.component.html',
  styleUrls: ['./detalle-pago-multiple.component.scss']
})
export class DetallePagoMultipleComponent implements OnInit {

  totalPagar: number = 0;
  documentos = new Array<String>();

  constructor(public dialogRef: MatDialogRef<DetallePagoMultipleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    for (let recibo of this.data.selected) {
      this.totalPagar += recibo.deuda;
      this.documentos.push(recibo.recibo);
    }
  }
}

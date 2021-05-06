import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-content-dialog',
  templateUrl: './content-dialog.component.html',
  styleUrls: ['./content-dialog.component.scss']
})
export class ContentDialogComponent {
  @Output() ConfirmarPago = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

}

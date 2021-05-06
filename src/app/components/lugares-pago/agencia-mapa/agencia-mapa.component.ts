import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-agencia-mapa',
  templateUrl: './agencia-mapa.component.html',
  styleUrls: ['./agencia-mapa.component.scss']
})
export class AgenciaMapaComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AgenciaMapaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

}

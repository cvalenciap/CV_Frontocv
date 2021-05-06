import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-sucursal-mapa',
  templateUrl: './sucursal-mapa.component.html',
  styleUrls: ['./sucursal-mapa.component.scss']
})
export class SucursalMapaComponent implements OnInit {

  zoom: number = 18;

  constructor(public dialogRef: MatDialogRef<SucursalMapaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

}

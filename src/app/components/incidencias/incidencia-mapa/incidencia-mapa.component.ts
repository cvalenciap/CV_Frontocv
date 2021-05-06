import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-incidencia-mapa',
  templateUrl: './incidencia-mapa.component.html',
  styleUrls: ['./incidencia-mapa.component.scss']
})
export class IncidenciaMapaComponent implements OnInit {

  zoom: number = 16;

  constructor(public dialogRef: MatDialogRef<IncidenciaMapaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

}

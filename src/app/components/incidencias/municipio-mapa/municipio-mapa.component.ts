import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-municipio-mapa',
  templateUrl: './municipio-mapa.component.html',
  styleUrls: ['./municipio-mapa.components.scss']
})
export class MunicipioMapaComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MunicipioMapaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

}

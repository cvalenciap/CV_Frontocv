import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTabChangeEvent} from '@angular/material';
import {SupplyService} from '../../../services/supply.service';
import {DataGrafico} from '../../../models';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {OpenDialogDirective} from '../../../directives';

@Component({
  selector: 'app-historico-consumo',
  templateUrl: './historico-consumo.component.html',
  styleUrls: ['./historico-consumo.component.scss']
})
export class HistoricoConsumoComponent implements OnInit {
  labelAxisYSoles: string = "Soles";
  labelAxisYMetros: string = "Metros Cúbicos";
  labelAxisX: string = "Meses";

  @BlockUI() blockUI: NgBlockUI;
  dataGrafico: DataGrafico[];
  tabIndex = 0;
  @ViewChild(OpenDialogDirective) openDialog;

  public barChartLabels: string[] = [''];
  public barChartColors: Array<any> = [
    {backgroundColor: 'rgba(0,100,200,0.5)'}
  ];
  public barChartOptionsSoles: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {ticks: {min: 0}},
        {scaleLabel: {display: true,
          labelString: this.labelAxisYSoles}}
      ],
      xAxes: [
        {scaleLabel: {display: true,
          labelString: this.labelAxisX}}
      ]
    }
  };

  public barChartOptionsMetros: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {ticks: {min: 0}},
        {scaleLabel: {display: true,
          labelString: this.labelAxisYMetros}}
      ],
      xAxes: [
        {scaleLabel: {display: true,
          labelString: this.labelAxisX}}
      ]
    }
  };

  public barChartSolesData: ChartDataSets[] = [
    {data: [], label: 'Importe de Consumo'}
  ];

  public barChartMetrosData: ChartDataSets[] = [
    {data: [], label: 'Consumo Metros Cubicos'}
  ];

  constructor(public dialogRef: MatDialogRef<HistoricoConsumoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public supplyService: SupplyService) {
  }

  ngOnInit() {
    /* this.labelAxisYSoles = "Soles";
    this.labelAxisYMetros = "Metros Cúbicos";
    this.labelAxisX = "Meses"; */
    const body = {
      nis_rad: this.data.nis_rad
    };
    this.blockUI.start();
    this.supplyService.obtenerGrafico(body).subscribe(
      response => {
        if (response.nRESP_SP) {
          this.dataGrafico = response.bRESP;
          if (this.dataGrafico.length < 1) {
            this.openDialog.onClick({
              dialogType: 'content',
              dialogSRC: 'error',
              error: 'No se encontró información de consumo en los últimos 12 meses'
            });
            this.dialogRef.close();
          } else{
            const clone_data = JSON.parse(JSON.stringify(this.barChartSolesData));
            const clone_data_2 = JSON.parse(JSON.stringify(this.barChartMetrosData));
            const data = [];
            const data_2 = [];
            const etiqueta = [];
            this.dataGrafico.forEach(e => {
              data.unshift(e.monto);
              data_2.unshift(e.volumen);
              let mes = Number.parseInt(e.mes_fact.substr(4, 2)) - 1;
              let anio = Number.parseInt(e.mes_fact.substr(0, 4));
              etiqueta.unshift(new Date(anio, mes).toLocaleString('es-pe', {month: 'short'}) + ' ' + anio);
            });
            clone_data[0].data = data;
            clone_data_2[0].data = data_2;
            this.barChartSolesData = clone_data;
            this.barChartMetrosData = clone_data_2;            
            this.barChartLabels = etiqueta;
          }
        }
        this.blockUI.stop();
      }, () => {
        this.blockUI.stop();
        this.dialogRef.close();
      }
    );
  }

  downloadCanvas() {
    this.blockUI.start();
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute("id", "downloadGraphic");
    let canvas: HTMLCanvasElement;
    if (this.tabIndex === 0) {
      downloadLink.download = 'historico_importe_consumo_' + this.data.nis_rad + '.png';
      canvas = <HTMLCanvasElement>document.getElementById('canvasSoles');
    } else {
      downloadLink.download = 'historico_consumo_metros_' + this.data.nis_rad + '.png';
      canvas = <HTMLCanvasElement>document.getElementById('canvasMetros');
    }
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent)

    if (isIEOrEdge) {
      // @ts-ignore
      var blob = canvas.msToBlob();
      window.navigator.msSaveBlob(blob, downloadLink.download);
    } else {
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.click();
      downloadLink.remove();
    }
    this.blockUI.stop();
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.tabIndex = tabChangeEvent.index;
  };

}

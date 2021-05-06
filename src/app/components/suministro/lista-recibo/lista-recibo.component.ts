import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {MatTabGroup} from '@angular/material';

@Component({
  selector: 'app-lista-recibo',
  templateUrl: './lista-recibo.component.html',
  styleUrls: ['./lista-recibo.component.scss']
})
export class ListaReciboComponent implements OnChanges {

  @Input() selectedSupply: string;
  @BlockUI() blockUI: NgBlockUI;
  terminoPendientes = false;
  @Output() PagarRecibos = new EventEmitter;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor() {
  }

  ngOnChanges() {
    this.tabGroup.selectedIndex = 0;
    this.terminoPendientes = false;
  }

  finishPendientes() {
    if(!this.terminoPendientes)
    {
      this.blockUI.stop();
      this.terminoPendientes = true;
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  pagar(event) {
    this.PagarRecibos.emit({data: event});
  }

  terminoPagados() {
    this.blockUI.stop();
  }

}

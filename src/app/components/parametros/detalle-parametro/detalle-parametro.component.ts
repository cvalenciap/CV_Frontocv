import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ParameterService} from '../../../services';
import {OpenDialogDirective} from '../../../directives';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-detalle-parametro',
  templateUrl: './detalle-parametro.component.html',
  styleUrls: ['./detalle-parametro.component.scss']
})
export class DetalleParametroComponent implements OnInit {

  @ViewChild(OpenDialogDirective) openDialog;
  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;
  habilitar: boolean;
  mostrar: boolean;
  error = '';
  titulo: string;
  activo: boolean;
  paramCom: boolean;
  admin_etic: number;
  admin_com: number;

  constructor(public dialogRef: MatDialogRef<DetalleParametroComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private parameterService: ParameterService) {
    this.form = new FormGroup({
      categoria: new FormControl('', [Validators.required]),
      clase: new FormControl('', [Validators.required]),
      fAlta: new FormControl(''),
      valor: new FormControl('', [Validators.required]),
      activo: new FormControl(''),
      paramCom: new FormControl('')
    });
    this.form.get('activo').valueChanges.subscribe(value => {
      this.activo = value;
    });
    this.form.get('paramCom').valueChanges.subscribe(value => {
      this.paramCom = value;
    });
  }

  ngOnInit() {
    const session = JSON.parse(localStorage.getItem(environment.appname));
    this.admin_etic = session.user.admin_etic;
    this.admin_com = session.user.admin_com;
    switch (this.data.tipo) {
      case 'detail': {
        this.titulo = 'Detalle de Parámetro';
        this.form.get('categoria').patchValue(this.data.parameter.categoria);
        this.form.get('clase').patchValue(this.data.parameter.clase);
        this.form.get('fAlta').patchValue(this.data.parameter.f_alta);
        this.form.get('valor').patchValue(this.data.parameter.valor);
        this.form.get('activo').patchValue(this.data.parameter.flag);
        this.form.get('paramCom').patchValue(this.data.parameter.modulo === 'OCV_COM');
        this.habilitar = false;
        this.mostrar = true;
        break;
      }
      case 'register': {
        this.titulo = 'Registrar Parámetro';
        this.habilitar = true;
        this.mostrar = false;
        break;
      }
      case 'edit': {
        this.titulo = 'Editar Parámetro';
        this.form.get('categoria').patchValue(this.data.parameter.categoria);
        this.form.get('clase').patchValue(this.data.parameter.clase);
        this.form.get('fAlta').patchValue(this.data.parameter.f_alta);
        this.form.get('valor').patchValue(this.data.parameter.valor);
        this.form.get('activo').patchValue(this.data.parameter.flag);
        this.form.get('paramCom').patchValue(this.data.parameter.modulo === 'OCV_COM');
        this.habilitar = true;
        this.mostrar = false;
        break;
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Por favor, ingrese correctamente todos los datos.';
      return;
    }
    this.blockUI.start();
    this.error = '';
    let module = '';
    if (this.admin_com === 1 && this.admin_etic === 0) {
      module = 'OCV_COM';
    } else {
      module = this.form.value.paramCom ? 'OCV_COM' : 'OCV';
    }
    const body = {
      clase: this.form.value.clase,
      categoria: this.form.value.categoria,
      valor: this.form.value.valor,
      flag: this.form.value.activo,
      modulo: module
    };
    console.log('body', body);
    switch (this.data.tipo) {
      case 'register': {
        this.parameterService.addParameter(body).subscribe(
          response => {
            this.dialogRef.close(response);
            if (response.nRESP_SP) {
              this.openDialog.onClick({
                dialogType: 'content',
                dialogSRC: 'addParameterOK',
                mensaje: response.cRESP_SP
              });
            } else {
              this.openDialog.onClick({
                dialogType: 'content',
                dialogSRC: 'error',
                error: response.cRESP_SP
              });
            }
          },
          error => {
            this.openDialog.onClick({
              dialogType: 'content',
              dialogSRC: 'error',
              error:
                'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.'
            });
            this.dialogRef.close();
          }
        );
        break;
      }
      case 'edit': {
        this.parameterService.editParameter(body).subscribe(
          response => {
            this.dialogRef.close(response);
            if (response.nRESP_SP) {
              this.openDialog.onClick({
                dialogType: 'content',
                dialogSRC: 'addParameterOK',
                mensaje: response.cRESP_SP
              });
            } else {
              this.openDialog.onClick({
                dialogType: 'content',
                dialogSRC: 'error',
                error: response.cRESP_SP
              });
            }
          },
          error => {
            this.dialogRef.close();
            this.openDialog.onClick({
              dialogType: 'content',
              dialogSRC: 'error',
              error:
                'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.'
            });
          }
        );
        break;
      }
    }

  }
}

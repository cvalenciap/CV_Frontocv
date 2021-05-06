import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService, UserService} from '../../../../services';
import {OpenDialogDirective} from '../../../../directives';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-code-confirm',
  templateUrl: './code-confirm.component.html',
  styleUrls: ['./code-confirm.component.scss']
})
export class CodeConfirmComponent implements OnInit {

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

  constructor(public dialogRef: MatDialogRef<CodeConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
              private authService: AuthService,
              private userService: UserService) {
    this.form = new FormGroup({
      codeVerify1: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{1,1}')
      ]),
      codeVerify2: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{1,1}')
      ]),
      codeVerify3: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{1,1}')
      ]),
      codeVerify4: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{1,1}')
      ])
    });
    
  }

  ngOnInit() {
    this.titulo = 'Código de Verificación';
    this.habilitar = true;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Por favor, ingrese correctamente el código de verificación.';
      return;
    }
    this.blockUI.start();
    this.error = '';
    const body = {
      codeVerify: this.form.value.codeVerify1+this.form.value.codeVerify2+this.form.value.codeVerify3+this.form.value.codeVerify4,
      correo: this.data.correo
    };
    console.log('body', body);
    this.authService.verifyCode(body).subscribe(
      response => {
        this.blockUI.stop();
        this.dialogRef.close(response);
        if (response.nRESP_SP && response.nRESP_SP === 1) {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'confirmOk',
            email: response.bRESP.correo,
            mensajeCab: response.cRESP_SP.split('|')[0],
            mensajeDesc: response.cRESP_SP.split('|')[1]
          });
          /* this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'verifyCodeOK',
            mensaje: response.cRESP_SP
          }); */
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

  }

  /*reenvio codigo verificacion*/
  reenviar(){
    this.blockUI.start();
    const body = {correo : this.data.correo};
    this.userService.sendCodeVerify(body).subscribe(
      response => {
        this.blockUI.stop();
        if (response.nRESP_SP) {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'registrationOK',
            email: this.data.correo,
            mensajeCab: response.cRESP_SP.split('|')[0],
            mensajeDesc: response.cRESP_SP.split('|')[1]
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
        this.blockUI.stop();
        this.openDialog.onClick({
          dialogType: 'content',
          dialogSRC: 'error',
          error:
            'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.'
        });
      }
    );
  }
}

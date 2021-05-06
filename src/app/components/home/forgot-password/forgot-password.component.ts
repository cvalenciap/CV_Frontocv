import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ReCaptchaV3Service} from 'ngx-captcha';
import {MainService, UserService} from '../../../services/';
import {OpenDialogDirective} from '../../../directives/';
import {environment, imagenes} from '../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';
  token = null;

  @ViewChild(OpenDialogDirective) openDialog;

  constructor(
    private mainService: MainService,
    private userService: UserService,
    //private reCaptchaV3Service: ReCaptchaV3Service,
    private router: Router
  ) {
    this.form = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email])
    });
  }

  ngOnInit() {
    if (document.location.hostname !== 'localhost') {
      /*this.reCaptchaV3Service.execute(
        environment.reCaptchaKey,
        'registro',
        token => {
          this.token = token;
        }
      );*/
    }
  }

  getImagenes() {
    return imagenes;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.error = 'Por favor, ingrese correctamente todos los datos.';
      return;
    }
    this.error = '';
    this.loading = true;
    const body = {
      correo: this.form.value.correo
    };
    await this.mainService.verifyToken(false);
    this.userService.forgotPassword(body).subscribe(
      response => {
        this.loading = false;
        if (response.nRESP_SP) {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'resetPasswordOK',
            email: this.form.value.correo,
            mensajeCab: response.cRESP_SP.split('|')[0],
            mensajeDesc: response.cRESP_SP.split('|')[1]
          });
          this.router.navigate(['/']);
        } else {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'error',
            error: response.cRESP_SP
          });
        }
      },
      error => {
        this.loading = false;
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

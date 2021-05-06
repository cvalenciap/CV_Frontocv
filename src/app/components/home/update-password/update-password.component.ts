import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MainService, UserService} from '../../../services/';
import {OpenDialogDirective} from '../../../directives/';
import {imagenes} from '../../../../environments/environment';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';
  email: String;

  @ViewChild(OpenDialogDirective) openDialog;

  constructor(
    private mainService: MainService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      contrasena: new FormControl('', [
        Validators.required,
        Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,18}')
      ]),
      contrasena2: new FormControl(),
    });

    this.form
      .get('contrasena2')
      .setValidators([
        Validators.required,
        Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,18}'),
        this.matchPassword.bind(this.form)
      ]);
  }

  matchPassword(control: FormControl): { [s: string]: boolean } {
    const form: any = this;
    if (control.value !== form.controls['contrasena'].value) {
      return {
        matchPassword: false
      };
    }
    return null;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params.token) {
        this.verifyToken(params.token);
      } else {
        this.goHome();
      }
    });
  }

  async verifyToken(token: string) {
    decodeURIComponent(token);
    await this.mainService.verifyToken(false);
    this.userService.confirmAccount({token, flag_act: 1}).subscribe(
      response => {
        if (response.nRESP_SP && response.nRESP_SP !== 0) {
          this.email = response.bRESP.correo;
        } else {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'error',
            error: response.cRESP_SP,
            onClose: this.goHome()
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

  async onSubmit() {
    if (this.form.invalid) {
      this.error = 'Por favor, ingrese correctamente todos los datos.';
      return;
    }
    this.error = '';
    this.loading = true;
    const body = {
      correo: this.email,
      clave: this.form.value.contrasena
    };
    await this.mainService.verifyToken(false);
    this.userService.updatePassword(body).subscribe(
      response => {
        this.loading = false;
        if (response.nRESP_SP) {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'updatePasswordOK',
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

  goHome() {
    this.router.navigate(['/']);
  }

  getImagenes() {
    return imagenes;
  }
}

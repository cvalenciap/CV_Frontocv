import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Documento} from '../../../interfaces/';
import {MainService, UserService} from '../../../services/';
import {OpenDialogDirective} from '../../../directives/';
import {ReCaptcha2Component} from 'ngx-captcha';
import {environment, imagenes} from '../../../../environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  form: FormGroup;
  documentos: Documento[];
  suministroFound = false;
  msgSuministro = '';
  referenciasFound = 0;
  referenciasError = '';
  validateTerminos = false;
  validateNotificaciones = false;
  isRUC = false;
  loading = false;
  error = '';
  maxNroDoc = 8;
  siteKey = environment.reCaptchaKey;
  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'es';
  public type: 'image' | 'audio';

  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  @ViewChild(OpenDialogDirective) openDialog;

  constructor(
    private mainService: MainService,
    private userService: UserService,
    private router: Router
  ) {
    this.loadInitialData();

    this.form = new FormGroup({
      suministro: new FormControl(
        '',
        [Validators.required, Validators.pattern('[0-9]{7,7}')],
        this.verifySuministro.bind(this)
      ),
      referencia: new FormControl(
        '',
        [Validators.required, Validators.pattern('[0-9]{10,10}')],
        this.verifyReferencia.bind(this)
      ),
      tipodoc: new FormControl('', [Validators.required]),
      nrodoc: new FormControl(
        '',
        [Validators.required],
        this.verifyDocumento.bind(this)
      ),
      correo: new FormControl('', [Validators.required, Validators.email]),
      apellido1: new FormControl(),
      apellido2: new FormControl(),
      nombres: new FormControl(),
      direccion: new FormControl(),
      telefono1: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{7,10}')
      ]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,18}')
      ]),
      contrasena2: new FormControl(),
      terminos: new FormControl(false, [
        Validators.required,
        Validators.requiredTrue
      ]),
      notificaciones: new FormControl(),
      reCaptcha: new FormControl('', [Validators.required])
    });

    this.form
      .get('contrasena2')
      .setValidators([
        Validators.required,
        Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,18}'),
        this.matchPassword.bind(this.form)
      ]);
  }

  ngOnInit() {
    this.form.get('suministro').valueChanges.subscribe(value => {
      if (value.length < 7) {
        this.suministroFound = false;
        this.referenciasFound = 0;
      }
    });
    this.form.get('suministro').statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        this.suministroFound = false;
        this.referenciasFound = 0;
      }
    });
    this.form.get('referencia').valueChanges.subscribe(value => {
      if (value.length < 10) {
        this.referenciasFound = 0;
      }
    });
    this.form.get('tipodoc').valueChanges.subscribe(value => {
      this.updateByDocumentType(value);
    });
    /*validate constant*/
    this.form.get('correo').markAsTouched();
  }

  async loadInitialData() {
    this.documentos = [];
    await this.mainService.verifyToken(false);
    this.mainService.getInitialData().then(response => {
      if (response.nRESP_SP && response.bRESP) {
        this.documentos = response.bRESP.listaTipoDocumentos;
      }
    });
  }

  verifySuministro(control: FormControl): Observable<any> {
    return this.userService.verifySuministro({nis_rad: control.value}).pipe(
      map(response => {
        this.msgSuministro = response.cRESP_SP;
        if (response.nRESP_SP) {
          this.suministroFound = true;
          return null;
        } else {
          this.suministroFound = false;
          return {notFound: true};
        }
      })
    );
  }

  verifyReferencia(): Observable<any> | Promise<any> {
    return this.userService.verifyReferencias({
      nis_rad: this.form.get('suministro').value,
      ref_cobro: this.form.get('referencia').value
    }).pipe(
      map(response => {
        this.referenciasError = response.cRESP_SP;
        if (response.nRESP_SP) {
          this.referenciasFound = 2;
          return null;
        } else {
          this.referenciasFound = 1;
          return {notFound: true};
        }
      })
    );
  }

  updateByDocumentType(id_TipoDocumento: number) {
    switch (id_TipoDocumento) {
      case 6:
        this.form
          .get('nrodoc')
          .setValidators([
            Validators.required,
            Validators.pattern('[0-9]{8,8}')
          ]);
        this.isRUC = false;
        this.maxNroDoc = 8;
        this.form.get('apellido1').patchValue('');
        this.form.get('apellido2').patchValue('');
        this.form.get('nombres').patchValue('');
        break;
      case 7:
      case 9:
        this.form
          .get('nrodoc')
          .setValidators([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9]{8,12}')
          ]);
        this.isRUC = false;
        this.maxNroDoc = 12;
        break;
      case 10:
        this.form
          .get('nrodoc')
          .setValidators([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9]{8,15}')
          ]);
        this.isRUC = false;
        this.maxNroDoc = 15;
        break;
      case 8:
        this.form
          .get('nrodoc')
          .setValidators([
            Validators.required,
            Validators.pattern('[0-9]{11,11}')
          ]);
        this.isRUC = true;
        this.maxNroDoc = 11;
        this.form.get('apellido1').patchValue('');
        this.form.get('apellido2').patchValue('');
        this.form.get('nombres').patchValue('');
        break;
    }
    this.form.get('nrodoc').updateValueAndValidity();
  }

  verifyDocumento(control: FormControl): Observable<any> | Promise<any> {
    if (this.form.get('tipodoc').valid) {
      const tipodoc = this.form.get('tipodoc').value;
      return this.userService
        .verifyDocumento({
          tipo_doc: tipodoc,
          nro_doc: control.value,
          nis_rad: this.form.value.suministro
        })
        .pipe(
          map(response => {
            if (response.nRESP_SP && response.bRESP) {
              if (tipodoc === 8) {
                this.form.get('apellido1').patchValue(response.bRESP.apellido1 + ' ' + response.bRESP.apellido2 + ' ' + response.bRESP.nombres);
              } else {
                this.form.get('apellido1').patchValue(response.bRESP.apellido1);
                this.form.get('apellido2').patchValue(response.bRESP.apellido2);
                this.form.get('nombres').patchValue(response.bRESP.nombres);
                this.form.get('telefono1').patchValue(response.bRESP.telefono1);
              }
            }
            return null;
          })
        );
    } else {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }
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

  acceptTermsConditions(data: any) {
    if (data) {
      this.form.get('terminos').setValue(data === '1');
    }
  }

  async onSubmit() {
    this.validateTerminos = !this.form.value.terminos;
    this.validateNotificaciones = !this.form.value.notificaciones;
    if (this.form.invalid) {
      this.error = 'Por favor, ingrese correctamente todos los datos.';
      return;
    }
    this.error = '';
    this.loading = true;
    const body = {
      nis_rad: this.form.value.suministro,
      ref_cobro: this.form.value.referencia,
      tipo_doc: this.form.value.tipodoc,
      nro_doc: this.form.value.nrodoc,
      apellido1: this.form.value.apellido1,
      apellido2: this.form.value.apellido2,
      nombres: this.form.value.nombres,
      correo: this.form.value.correo,
      telefono1: this.form.value.telefono1,
      acepta_terminos: this.validateTerminos ? 0 : 1,
      acepta_noti: this.validateNotificaciones ? 0 : 1,
      clave: this.form.value.contrasena,
      captcha: this.form.value.reCaptcha
      /*add flagChannel*/
      ,flagChannel: environment.flagChannel
    };
    await this.mainService.verifyToken(false);
    this.userService.createUser(body).subscribe(
      response => {
        this.loading = false;
        if (response.nRESP_SP) {
          /* init intermediate screen */
          /* this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'registrationOK',
            email: this.form.value.correo,
            mensajeCab: response.cRESP_SP.split('|')[0],
            mensajeDesc: response.cRESP_SP.split('|')[1]
          }); */
          /* this.router.navigate(['/']); */
          this.router.navigate(['/iniciar-sesion/registro-completo', this.form.value.correo]);
          /* end intermediate screen */
          this.captchaElem.reloadCaptcha();
        } else {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'error',
            error: response.cRESP_SP
          });
          this.captchaElem.reloadCaptcha();
        }
      },
      error => {
        this.loading = false;
        this.captchaElem.reloadCaptcha();
        this.openDialog.onClick({
          dialogType: 'content',
          dialogSRC: 'error',
          error:
            'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.'
        });
      }
    );
  }

  getImagenes() {
    return imagenes;
  }
}

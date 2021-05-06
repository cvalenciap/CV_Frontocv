import {Component, OnInit, ViewChild} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {AuthService, MainService, UserService} from '../../services';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Distrito, Documento, Solicitante} from '../../interfaces';
import {OpenDialogDirective} from '../../directives';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-actualizar-datos',
  templateUrl: './actualizar-datos.component.html',
  styleUrls: ['./actualizar-datos.component.scss']
})
export class ActualizarDatosComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  loading = false;
  success = false;
  error = '';
  form: FormGroup;
  solicitantes: Solicitante[];
  documentos: Documento[];
  distritos: Distrito[];
  isRUC = false;
  maxNroDoc = 8;
  validateNotificaciones = false;
  idCliente: number;

  @ViewChild(OpenDialogDirective) openDialog;

  constructor(private userService: UserService, private mainSevice: MainService, private authService: AuthService) {
    this.loadInitialData();
    this.form = new FormGroup({
      tiposol: new FormControl(),
      tipodoc: new FormControl(),
      nrodoc: new FormControl(
        '',
        [],
        this.verifyDocumento.bind(this)
      ),
      apellido1: new FormControl(),
      apellido2: new FormControl(),
      nombres: new FormControl(),
      telefono1: new FormControl('', [
        Validators.pattern('[0-9]{7,10}'),
        Validators.required
      ]),
      telefono2: new FormControl('', [
        Validators.pattern('[0-9]{7,10}')
      ]),
      sexo: new FormControl(),
      distrito: new FormControl(),
      direccion: new FormControl(),
      nacimiento: new FormControl(),
      notificaciones: new FormControl()
    });
  }

  ngOnInit() {
    this.blockUI.start();
    this.idCliente = this.authService.getUser().id_cliente;
    const body = {
      id_cliente: this.idCliente
    };
    this.userService.infoUser(body).subscribe(
      response => {
        this.loading = false;
        if (response.nRESP_SP) {
          this.form.get('tiposol').patchValue(response.bRESP.tipo_soli);
          this.form.get('tipodoc').patchValue(response.bRESP.tipo_docu);
          this.form.get('nrodoc').patchValue(response.bRESP.nro_doc);
          this.form.get('apellido1').patchValue(response.bRESP.apellido1);
          this.form.get('apellido2').patchValue(response.bRESP.apellido2);
          this.form.get('nombres').patchValue(response.bRESP.nombres);
          this.form.get('sexo').patchValue(response.bRESP.sexo);
          this.form.get('distrito').patchValue(Number(response.bRESP.distrito));
          this.form.get('direccion').patchValue(response.bRESP.direccion);
          const date = response.bRESP.fecha_nac;
          if (date !== null && date !== '') {
            const year = Number(date.substring(0, 4));
            const mes = Number(date.substring(5, 7)) - 1;
            const dia = Number(date.substring(8, 10));
            this.form.get('nacimiento').patchValue(new Date(year, mes, dia));
          } else {
            //this.form.get('nacimiento').patchValue(new Date());
          }
          this.form.get('telefono1').patchValue(response.bRESP.telefono1);
          this.form.get('telefono2').patchValue(response.bRESP.telefono2);
          this.form.get('notificaciones').patchValue(Number(response.bRESP.acepta_noti) === 1);

          this.blockUI.stop();
        } else {
          this.blockUI.stop();
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
        this.blockUI.stop();
      }
    );

    this.form.get('tipodoc').valueChanges.subscribe(value => {
      this.updateByDocumentType(value);
    });
  }

  loadInitialData() {
    this.blockUI.start();
    this.solicitantes = [];
    this.documentos = [];
    this.distritos = [];
    this.mainSevice.getInitialData().then(response => {
      if (response.nRESP_SP && response.bRESP) {
        this.solicitantes = response.bRESP.listaTipoSolicitantes;
        this.documentos = response.bRESP.listaTipoDocumentos;
        this.distritos = response.bRESP.listaDistritos;
      }
    });
    this.blockUI.stop();
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
    if (this.form) {
      if (this.form.get('tipodoc').value) {
        const tipodoc = this.form.get('tipodoc').value;
        return this.userService
          .verifyDocumento({
            tipo_doc: tipodoc,
            nro_doc: control.value,
            nis_rad: this.authService.getUser().nis_rad
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
    } else {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }
  }

  onSubmit() {
    this.validateNotificaciones = !this.form.value.notificaciones;
    if (this.form.invalid) {
      this.error = 'Por favor, ingrese correctamente los datos.';
      return;
    }
    this.error = '';
    this.loading = true;
    let fNac = this.form.value.nacimiento;
    if (fNac !== null && fNac !== '') {
      fNac =
        fNac.getFullYear() +
        '-' +
        ('0' + (fNac.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + fNac.getDate()).slice(-2);
    }
    const body = {
      id_cliente: this.idCliente,
      tipo_solicitante: this.form.value.tiposol,
      tipo_doc: this.form.value.tipodoc,
      nro_doc: this.form.value.nrodoc,
      apellido1: this.form.value.apellido1,
      apellido2: this.form.value.apellido2,
      nombres: this.form.value.nombres,
      sexo: this.form.value.sexo,
      distrito: this.form.value.distrito,
      direccion: this.form.value.direccion,
      fecha_nac: fNac,
      telefono1: this.form.value.telefono1,
      telefono2: this.form.value.telefono2,
      acepta_noti: this.validateNotificaciones ? 0 : 1
    };
    this.blockUI.start();
    this.userService.updateUser(body).subscribe(
      response => {
        this.loading = false;
        if (response.nRESP_SP) {
          this.blockUI.stop();
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'updateOK',
            mensajeCab: response.cRESP_SP.split('|')[0],
            mensajeDesc: response.cRESP_SP.split('|')[1]
          });
        } else {
          this.blockUI.stop();
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'error',
            error: response.cRESP_SP
          });
        }
      },
      error => {
        this.loading = false;
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

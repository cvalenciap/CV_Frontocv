import {ChangeDetectorRef, Component, ViewChild, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService, MainService, UserService} from '../../../services/';
import {OpenDialogDirective} from '../../../directives/';
import {Globals} from '../../../globals';
import {imagenes} from '../../../../environments/environment';
import {environment} from '../../../../environments/environment';
import {MatDialog} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import {CodeConfirmComponent} from './code-confirm/code-confirm.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
/* add verify code */
/* export class LoginComponent  { */
export class LoginComponent implements OnInit, OnDestroy {
/**/
  form: FormGroup;
  loading = false;
  error = '';
  correo: string;
  alertCorreo: string;
  @ViewChild(OpenDialogDirective) openDialog;
  /*dialog confirm*/
  width = '35%';
  height = null;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  /**/

  constructor(private authService: AuthService, 
              private router: Router,
              private mainService: MainService,
              private userService: UserService,
              /* add code verify */
              public dialog: MatDialog,
              media: MediaMatcher,
              changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              /**/
              private globals: Globals) {
    this.form = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required])
    });
    /*verify user optional*/
    if(localStorage.getItem("userOptional") && localStorage.getItem("userOptional") != null &&  localStorage.getItem("userOptional") != ""){
      this.correo = localStorage.getItem("userOptional");
    }
    /* dialog confirm */
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
         // trick the Router into believing it's last link wasn't previously loaded
         this.router.navigated = false;
         // if you need to scroll back to top, here is the right place
         window.scrollTo(0, 0);
      }
  });
    /**/
  }

  /* add verify code */
  ngOnInit() {
    if (this.mobileQuery.matches) {
      this.width = '80%';
      this.height = '70%';
    }
  }
  /**/

  async onSubmit() {
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Por favor, ingrese correctamente las credenciales';
      return;
    }
    this.loading = true;
    const body = {
      correo: this.form.value.correo,
      clave: this.form.value.contrasena
      /* add flagChannel */
      ,flagChannel: environment.flagChannel
    };
    await this.mainService.verifyToken(false);
    this.authService.login(body).subscribe(
      response => {
        this.loading = false;
        /* cambio modal reenvio*/
        if (response.nRESP_SP) {
          if(response.nRESP_SP === 2){
            /* add cod verify */
            const dialogRef = this.dialog.open(CodeConfirmComponent, {
              height: this.height,
              width: this.width,
              data: {data: response.bRESP, correo: response.cRESP_SP2}
            });
            dialogRef.afterClosed().toPromise().then(result => {
              if (result !== undefined && result.nRESP_SP === 1) {
                /* this.globals.admin_com = response.bRESP.admin_com;
                this.globals.admin_etic = response.bRESP.admin_etic;
                this.router.navigate(['../'], {relativeTo: this.route}); */
                this.redirectInitOK(response);
              } else {
                this.authService.logout();
              }
            });
            /**/
            /* this.alertCorreo = response.cRESP_SP2; 
            this.openDialog.onClick({
              dialogType: 'content',
              dialogSRC: 'alertLogin',
              alertMsg: response.cRESP_SP,
              onEvent : (data: any) => {
                this.reenviar();
              },
            }); */
            /**/
            /**/
          }else if (response.bRESP.flagRespuesta === 'A') {
            this.openDialog.onClick({
              dialogType: 'content',
              dialogSRC: 'loginError',
              title: 'Correo incorrecto',
              error: response.cRESP_SP,
              links: true,
              onEvent: (data: any) => {
                if (data === '1') {
                  this.router.navigate(['/iniciar-sesion/registro']);
                }
              }
            });
          } else {
            this.globals.admin_com = response.bRESP.admin_com;
            this.globals.admin_etic = response.bRESP.admin_etic;
            this.router.navigate(['/']);
          }
        } else {
          this.loading = false;
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'error',
            error: response.cRESP_SP,
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

  async redirectInitOK(response){
    this.globals.admin_com = response.bRESP.admin_com;
    this.globals.admin_etic = response.bRESP.admin_etic;
    /* await this.mainService.verifyToken(); */
    this.router.navigate(['/']);
  }

  getImagenes() {
    return imagenes;
  }

  /*reenvio confirmacion*/
  reenviar(){
    const body = {correo : this.alertCorreo};
    this.userService.sendConfirmation(body).subscribe(
      response => {
        this.loading = false;
        if (response.nRESP_SP) {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'registrationOK',
            email: this.correo,
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

  /* add verify code */
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  /* */
}

import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material';
import {UserService, AuthService} from '../../../services';
import {OpenDialogDirective} from '../../../directives';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {imagenes} from '../../../../environments/environment';

@Component({
  selector: 'app-registration-end',
  templateUrl: './registration-end.component.html',
  styleUrls: ['./registration-end.component.scss']
})
export class RegistrationEndComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  token: string;
  width = '70%';
  height = null;
  mensajePago: string;
  responseOK = false;
  responseERROR = false;
  @ViewChild(OpenDialogDirective) openDialog;  
  mobileQuery: MediaQueryList;
  loading = false;
  correo: any;

  mailPay: string;


  private _mobileQueryListener: () => void;

  constructor(private userService: UserService,
              public dialog: MatDialog,
              private router: Router,
              private actRoute: ActivatedRoute,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    if(this.router.url.includes('registro-completo')){
      this.actRoute.params.subscribe(params => {
        this.correo = params['correo'];
      });
    }
  }

  ngOnInit() {
    if (this.mobileQuery.matches) {
      this.width = '80%';
      this.height = '70%';
    }
    /* this.blockUI.start();
    let src = 'resultPaymentError';
    this.mensajePago = 'Ocurrió un error al ejecutar el pago de tu recibo. Por favor, contáctate con nosotros.' */
    
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getImagenes() {
    return imagenes;
  }

  reenviar(){
    const body = {correo : this.correo};
    /* this.userService.sendConfirmation(body).subscribe( */
    this.userService.sendCodeVerify(body).subscribe(
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

  cerrar() {
    this.router.navigate(['/']);
  } 
  
}

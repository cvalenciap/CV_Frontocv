import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService, IncidenciasService, MainService} from '../../services/';
import {OpenDialogDirective} from '../../directives/';
import {MediaMatcher} from '@angular/cdk/layout';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {imagenes, titulos} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  })
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild(OpenDialogDirective) openDialog;
  user: any;
  route: string;
  mobileQuery: MediaQueryList;
  @BlockUI() blockUI: NgBlockUI;
  admin_etic: number;
  admin_com: number;
  token = '';
  showFiller = true;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService,
              private mainService: MainService, private router: Router, private actRoute: ActivatedRoute,
              private incidenceService: IncidenciasService, private toastr: ToastrService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    if (this.authService.isAuthenticated()) {
      if (titulos.titulo === '') {
        this.setTitulos();
      }
      if (imagenes.urlBase === '') {
        this.setImagenes();
      }
      let url = this.router.url;
      if (this.router.url.includes('consulta-recibos')) {
        this.actRoute.params.subscribe(params => {
          this.token = params['token'];
          url = url.replace('/' + this.token, '');
        });
      }
      this.route = url.replace('/', '');
    } else {
      this.router.navigate(['/iniciar-sesion']);
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.user = this.authService.getUser();
      this.admin_etic = this.user.admin_etic;
      this.admin_com = this.user.admin_com;
      let body = {
        nis_rad: this.user.nis_rad
      };
      this.incidenceService.getSuministroAfectado(body).subscribe(
        response => {
          if (response.bRESP) {
            this.toastr.error('Estimado usuario, vuestro servicio puede verse afectado por la incidencia "' +
              response.bRESP.nom_incidencia + '" y la fecha probable de solución será ' +
              response.bRESP.fecha_estimada_sol + '. Para mayor información consultar la sección de <a class="link-incidencia" href="#/incidencias">incidencias</a>',
              'Alerta', {closeButton: true, disableTimeOut: true, enableHtml: true, tapToDismiss: false});
          }
        });
      if (this.admin_etic === 0 && this.admin_com === 0 && this.route === 'parametros') {
        this.router.navigate(['']);
      }
    } else {
      this.router.navigate(['/inciar-sesion']);
    }
  }

  toggle(snav: any) {
    snav.toggle();
  }

  setTitulos() {
    this.mainService.getTitulos().subscribe(
      response => {
        if (response.nRESP_SP) {
          response.bRESP.forEach(e => {
            switch (e.nombre) {
              case 'TITULO':
                titulos.titulo = e.descripcion;
                break;
              case 'SUBTI1':
                titulos.subtitulo1 = e.descripcion;
                break;
              case 'SUBTI2':
                titulos.subtitulo2 = e.descripcion;
                break;
              default:
                titulos.marquesina = e.descripcion;
                break;
            }
          });
        }
      }
    );
  }

  setImagenes() {
    this.mainService.getDatosImagenes().subscribe(response => {
      imagenes.urlBase = response.bRESP.base_url;
      imagenes.carpetaImagenes = response.bRESP.carpeta_imagenes;
      imagenes.logo = response.bRESP.logo_sedapal_png;
      imagenes.background = response.bRESP.inicio_imagen;
      imagenes.carousel1 = response.bRESP.carusel_1_svg;
      imagenes.carousel2 = response.bRESP.carusel_2_svg;
      imagenes.carousel3 = response.bRESP.carusel_3_svg;
      imagenes.carousel4 = response.bRESP.carusel_4_svg;
      imagenes.banner = response.bRESP.fondo_banner;
      imagenes.sidenav = response.bRESP.fondo_sidenav;
    }, () => {
      this.openDialog.onClick({
        dialogType: 'content',
        dialogSRC: 'error',
        error: 'Tenemos problemas en nuestro servidor. Por favor, actualice la página y vuelva a intentar.'
      });
    });
  }

  toggleSidenav(){
    this.showFiller = !this.showFiller;
  }

  getImagenes() {
    return imagenes;
  }
}

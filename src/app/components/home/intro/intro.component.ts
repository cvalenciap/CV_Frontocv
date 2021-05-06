import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MainService} from '../../../services';
import {OpenDialogDirective} from '../../../directives';
import {imagenes} from '../../../../environments/environment';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
  @Output() CargarImagenes = new EventEmitter();
  @ViewChild(OpenDialogDirective) openDialog;
  items: any;

  constructor(private mainService: MainService) {
  }

  async ngOnInit() {
    if (imagenes.urlBase !== '' && this.items !== undefined) {
      return;
    }
    await this.mainService.verifyToken(false);
    this.mainService.getInitialData().then(response => {
      if (response.nRESP_SP && response.bRESP) {
        debugger;
        let listaImagenes = response.bRESP.lImagenes;
        imagenes.urlBase = listaImagenes.base_url;
        imagenes.carpetaImagenes = listaImagenes.carpeta_imagenes;
        imagenes.logo = listaImagenes.logo_sedapal_png;
        imagenes.background = listaImagenes.inicio_imagen;
        imagenes.carousel1 = listaImagenes.carusel_1_png;
        imagenes.carousel2 = listaImagenes.carusel_2_png;
        imagenes.carousel3 = listaImagenes.carusel_3_png;
        imagenes.carousel4 = listaImagenes.carusel_4_png;
        imagenes.descCarousel1 = listaImagenes.ODESC1;
        imagenes.descCarousel2 = listaImagenes.ODESC2;
        imagenes.descCarousel3 = listaImagenes.ODESC3;
        imagenes.descCarousel4 = listaImagenes.ODESC4;
        imagenes.banner = listaImagenes.fondo_banner;
        imagenes.sidenav = listaImagenes.fondo_sidenav;
        imagenes.logo_color = listaImagenes.logo_sedapal_color;
        this.items = [
          {
            image: imagenes.urlBase + imagenes.carpetaImagenes + imagenes.carousel2,
            //image: 'assets/img/carusel_2_svg.png',
            text: imagenes.descCarousel2//'Podrás ver el detalle de tus recibos, cada mes.'
          },
          {
            image: imagenes.urlBase + imagenes.carpetaImagenes + imagenes.carousel3,
            //image: 'assets/img/carusel_3_svg.png',
            text: imagenes.descCarousel3//'Podrás pagar tus recibos de manera rápida y segura.'
          },
          {
            image: imagenes.urlBase + imagenes.carpetaImagenes + imagenes.carousel4,
            //image: 'assets/img/carusel_4_svg.png',
            text: imagenes.descCarousel4//'Recibirás notificaciones de cortes y alertas de pago.'
          }
        ];
        this.CargarImagenes.emit();
      }
    }, error => {
      this.mainService.verifyToken();
    });
  }

  getImagenes() {
    return imagenes;
  }

}

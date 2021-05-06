import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Sanitizer, SecurityContext} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {AuthService} from '../../../services';
import {Router} from '@angular/router';
import {imagenes, titulos} from '../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

export class BannerComponent implements OnDestroy, OnInit {

  @Output() Toggler = new EventEmitter();
  @Output() Toggler2 = new EventEmitter();
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  banner: any;
  correo: string;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService, private router: Router, private sanitizer: DomSanitizer) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.correo = this.authService.getCorreo();
  }

  toggle() {
    this.Toggler.emit();
  }

  toggle2() {
    this.Toggler2.emit();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }

  getTitulos() {
    return titulos;
  }

  getImagenes() {
    return imagenes;
  }

  getBanner() {
    return this.sanitizer.bypassSecurityTrustStyle('url(' + imagenes.urlBase + imagenes.carpetaImagenes + imagenes.banner + ') round');
  }

}

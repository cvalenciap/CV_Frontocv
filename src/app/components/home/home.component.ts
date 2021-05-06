import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {environment, imagenes} from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  route: string;
  initToken: any;
  mostrar = false;

  constructor(private router: Router) {
    this.initToken = localStorage.getItem(environment.initialToken);
    this.route = this.router.url.replace('/', '');
    this.route = this.route.split('/')[0];
    if (imagenes.urlBase != "") {
      this.mostrar = true;
    }
  }

  finsihImagenes() {
    this.mostrar = true;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

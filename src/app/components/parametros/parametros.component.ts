import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ParameterService} from '../../services/parameter.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ToastrService} from 'ngx-toastr';
import {Parametro} from '../../models/parametro';
import {MatDialog} from '@angular/material';
import {DetalleParametroComponent} from './detalle-parametro/detalle-parametro.component';
import {AuthService} from '../../services';
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  @BlockUI() blockUI: NgBlockUI;
  selectedRow: number = -1;
  datos: Parametro[];
  dato: Parametro;
  limit = 10;
  total = 0;
  page = 1;
  width = '35%';
  height = null;
  private _mobileQueryListener: () => void;

  constructor(private parameterService: ParameterService,
              private toastr: ToastrService,
              public dialog: MatDialog,
              private authService: AuthService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (this.mobileQuery.matches) {
      this.width = '80%';
      this.height = '70%';
    }
    this.dato = new Parametro();
    this.datos = new Array<Parametro>();
    this.getParametros(this.page);
  }

  getParametros(pagina: number) {
    let user = this.authService.getUser();
    if (user.admin_etic > 0 || user.admin_com > 0) {
      this.blockUI.start();
      const body = {
        page_num: pagina,
        page_size: 10,
        correo: this.authService.getCorreo()
      };
      this.parameterService.listParameters(body).subscribe(
        response => {0
          if (response.nRESP_SP == -1) {
            this.blockUI.stop();
            this.router.navigate([''])
          } else {
            if (response.nRESP_SP > 0) {
              this.datos = response.bRESP;
              this.total = response.total;
            } else {
              this.toastr.warning('No se encontraron parametros', 'Error', {closeButton: true});
            }
            this.blockUI.stop();
          }
        },
        error => {
          this.blockUI.stop();
        }
      );
    } else {
      this.router.navigate([''])
    }
  }

  selectRow(index, item: Parametro) {
    //var elementoshtml = document.getElementById('tabla-parametros').getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    this.selectedRow = index;
    this.dato = item;
    /*for (var i = 0; i < elementoshtml.length; i++) {
      elementoshtml[i].style.background = 'white';
    }
    elementoshtml[index].style.background = '#b2d0ee';*/
  }

  goToPage(n: number): void {
    this.page = n;
    this.getParametros(this.page);
  }

  onNext(): void {
    this.page++;
    this.getParametros(this.page);
  }

  onPrev(): void {
    this.page--;
    this.getParametros(this.page);
  }

  viewDetalle() {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado parametro', 'Error', {closeButton: true});
    } else {
      this.dialog.open(DetalleParametroComponent, {
        height: this.height,
        width: this.width,
        data: {parameter: this.dato, tipo: 'detail'}
      });
    }
  }

  edit() {
    if (this.selectedRow == -1) {
      this.toastr.warning('No se ha seleccionado parametro', 'Error', {closeButton: true});
    } else {
      const dialogRef = this.dialog.open(DetalleParametroComponent, {
        height: this.height,
        width: this.width,
        data: {parameter: this.dato, tipo: 'edit'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined && result.nRESP_SP === 1) {
          this.getParametros(this.page);
        }
      });
    }
  }

  add() {
    const dialogRef = this.dialog.open(DetalleParametroComponent, {
      height: this.height,
      width: this.width,
      data: {parameter: this.dato, tipo: 'register'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.getParametros(this.page);
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}

import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgxCaptchaModule} from 'ngx-captcha';
import {ChartsModule} from 'ng2-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule, CurrencyPipe, registerLocaleData} from '@angular/common';
import {AgmCoreModule} from '@agm/core';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

import localeEs from '@angular/common/locales/es';
import {APP_ROUTING} from './app.routes';

import {
  ApiService,
  AuthGuardInsideService,
  AuthGuardService,
  AuthService,
  EnchufateService,
  ErrorDialogService,
  IncidenciasService,
  LugaresPagoService,
  MainService,
  PagoEjecutadoService,
  UserService,
  VisaService
} from './services';

import {BasicAuthInterceptor, ErrorInterceptor} from './helpers';

import {DisableControlDirective, OpenDialogDirective} from './directives/';

import {AppComponent} from './app.component';
import {ContentDialogComponent, ImageDialogComponent, TogglePasswordComponent} from './components/shared/';
import {HomeComponent} from './components/home/home.component';
import {IntroComponent} from './components/home/intro/intro.component';
import {LoginComponent} from './components/home/login/login.component';
import {RegistrationComponent} from './components/home/registration/registration.component';
import {ForgotPasswordComponent} from './components/home/forgot-password/forgot-password.component';
import {UpdatePasswordComponent} from './components/home/update-password/update-password.component';
import {TermsConditionsComponent} from './components/home/registration/terms-conditions/terms-conditions.component';
import {ConfirmComponent} from './components/confirm/confirm.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {BannerComponent} from './components/dashboard/banner/banner.component';
import {SuministroComponent} from './components/suministro/suministro.component';
/*init intermediate screen*/
import {OperacionComponent} from './components/operacion/operacion.component';
import {RegistrationEndComponent} from './components/home/registation-end/registration-end.component';
/*end intermediate screen*/
import {IncidenciasComponent} from './components/incidencias/incidencias.component';
import {SupplyService} from './services/supply.service';
import {CustomCurrencyPipe} from './pipes/currency';
import {ListaReciboComponent} from './components/suministro/lista-recibo/lista-recibo.component';
import {ReceiptService} from './services/receipt.service';
import {VolumePipe} from './pipes/volume';
import {PaginationComponent} from './components/shared/pagination/pagination.component';
import {RecibosPendientesComponent} from './components/suministro/lista-recibo/recibos-pendientes/recibos-pendientes.component';
import {PagoVisaComponent} from './components/suministro/pago-visa/pagovisa.component';
import {RecibosPagadosComponent} from './components/suministro/lista-recibo/recibos-pagados/recibos-pagados.component';
import {ActualizarDatosComponent} from './components/actualizar-datos/actualizar-datos.component';
import {BlockUIModule} from 'ng-block-ui';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {ToastrModule} from 'ngx-toastr';
import {SelectModule} from 'ng2-select';
import {NgxMaskModule} from 'ngx-mask';
import {LugaresPagoComponent} from './components/lugares-pago/lugares-pago.component';
import {NewScriptComponent} from './components/shared/script-hack/new-script.component';
import {DetalleReciboComponent} from './components/suministro/lista-recibo/detalle-recibo/detalle-recibo.component';
import {DetallePagosComponent} from './components/suministro/lista-recibo/detalle-pagos/detalle-pagos.component';
import {DetallePagoMultipleComponent} from './components/suministro/lista-recibo/detalle-pago-multiple/detalle-pago-multiple.component';
import {ParametrosComponent} from './components/parametros/parametros.component';
import {ParameterService} from './services/parameter.service';
import {DetalleParametroComponent} from './components/parametros/detalle-parametro/detalle-parametro.component';
import {CodeConfirmComponent} from './components/home/login/code-confirm/code-confirm.component';
import {HistoricoConsumoComponent} from './components/suministro/historico-consumo/historico-consumo.component';
import {SucursalMapaComponent} from './components/lugares-pago/sucursal-mapa/sucursal-mapa.component';
import {AgenciaMapaComponent} from './components/lugares-pago/agencia-mapa/agencia-mapa.component';
import {ErrorDialogComponent} from './components/shared/error-dialog/error-dialog.component';
import {ResumenPagoComponent} from './components/suministro/resumen-pago/resumen-pago.component';
import {IncidenciaMapaComponent} from './components/incidencias/incidencia-mapa/incidencia-mapa.component';
import {MunicipioMapaComponent} from './components/incidencias/municipio-mapa/municipio-mapa.component';
import {MapaGeneralComponent} from './components/incidencias/mapa-general/mapa-general.component';
import {ErrorPageComponent} from './components/error-page/error-page.component';
import {Globals} from './globals';
import {environment} from '../environments/environment';
import { DefaultComponent } from './components/shared/default/default.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SafePipe } from './safe.pipe';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    DisableControlDirective,
    OpenDialogDirective,
    ImageDialogComponent,
    ContentDialogComponent,
    TogglePasswordComponent,
    HomeComponent,
    IntroComponent,
    BannerComponent,
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    UpdatePasswordComponent,
    TermsConditionsComponent,
    ConfirmComponent,
    DashboardComponent,
    SuministroComponent,
    /*init intermediate screen*/
    OperacionComponent,
    RegistrationEndComponent,
    /*end intermediate screen*/
    CustomCurrencyPipe,
    ListaReciboComponent,
    PaginationComponent,
    RecibosPendientesComponent,
    RecibosPagadosComponent,
    VolumePipe,
    IncidenciasComponent,
    LugaresPagoComponent,
    PagoVisaComponent,
    ActualizarDatosComponent,
    NewScriptComponent,
    DetalleReciboComponent,
    DetallePagosComponent,
    DetallePagoMultipleComponent,
    ParametrosComponent,
    DetalleParametroComponent,
    CodeConfirmComponent,
    HistoricoConsumoComponent,
    SucursalMapaComponent,
    AgenciaMapaComponent,
    ErrorDialogComponent,
    ResumenPagoComponent,
    IncidenciaMapaComponent,
    MunicipioMapaComponent,
    MapaGeneralComponent,
    ErrorPageComponent,
    DefaultComponent,
    FooterComponent,
    SafePipe
  ],
  entryComponents: [
    ImageDialogComponent,
    ContentDialogComponent,
    ConfirmComponent,
    DetalleParametroComponent,
    CodeConfirmComponent,
    DetalleReciboComponent,
    DetallePagosComponent,
    DetallePagoMultipleComponent,
    HistoricoConsumoComponent,
    SucursalMapaComponent,
    AgenciaMapaComponent,
    IncidenciaMapaComponent,
    MunicipioMapaComponent,
    MapaGeneralComponent,
    ErrorDialogComponent
  ],
  imports: [
    SweetAlert2Module.forRoot(),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxCaptchaModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatTabsModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatDialogModule,
    ChartsModule,
    FormsModule,
    BlockUIModule.forRoot(/*{
      delayStart: 500,
      delayStop: 500
    }*/),
    NgbModule.forRoot(),
    ToastrModule.forRoot(),
    SelectModule,
    CommonModule,
    NgxMaskModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.mapKey
    }),
    APP_ROUTING,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'es-PE'},
    //{provide: LocationStrategy, useClass: HashLocationStrategy},
    ApiService,
    AuthGuardService,
    AuthGuardInsideService,
    AuthService,
    MainService,
    UserService,
    SupplyService,
    ReceiptService,
    IncidenciasService,
    CurrencyPipe,
    LugaresPagoService,
    VisaService,
    ParameterService,
    ErrorDialogService,
    EnchufateService,
    PagoEjecutadoService,
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

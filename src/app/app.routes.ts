import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './services/auth-guard.service';
import {HomeComponent} from './components/home/home.component';
import {ConfirmComponent} from './components/confirm/confirm.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AuthGuardInsideService} from './services/auth-guard-inside.service';
import {ErrorPageComponent} from './components/error-page/error-page.component';
import {SuministroComponent} from './components/suministro/suministro.component';
/*init intermediate screen*/
import {OperacionComponent} from './components/operacion/operacion.component';
import {RegistrationEndComponent} from './components/home/registation-end/registration-end.component';
/*end intermediate screen*/
import {LugaresPagoComponent} from './components/lugares-pago/lugares-pago.component';
import {ParametrosComponent} from './components/parametros/parametros.component';
import {ActualizarDatosComponent} from './components/actualizar-datos/actualizar-datos.component';
import {IncidenciasComponent} from './components/incidencias/incidencias.component';
import {ForgotPasswordComponent} from './components/home/forgot-password/forgot-password.component';
import {LoginComponent} from './components/home/login/login.component';
import {RegistrationComponent} from './components/home/registration/registration.component';
import {UpdatePasswordComponent} from './components/home/update-password/update-password.component';
import {DefaultComponent} from './components/shared/default/default.component';

const APP_ROUTES: Routes = [
  {path: 'iniciar-sesion', component: HomeComponent, canActivate: [AuthGuardInsideService],
    children: [
      {path: '', component: LoginComponent},
      {path: 'olvido-contrasena', component: ForgotPasswordComponent},
      {path: 'registro', component: RegistrationComponent},
      {path: 'actualizar-contrasena/:token', component: UpdatePasswordComponent},
      {path: 'confirmar-cuenta/:token', component: ConfirmComponent}
      /* init intermediate screen */
      ,{path: 'registro-completo/:correo', component: RegistrationEndComponent }
      /* end intermediate screen */
    ]},
  {path: '', component: DashboardComponent, canActivate: [AuthGuardService],
    children: [
      {path: '', component: DefaultComponent},
      /* init intermediate screen */
      {path: 'consulta-recibos', component: SuministroComponent, runGuardsAndResolvers: 'always'},
      {path: 'consulta-recibos/:token', component: SuministroComponent},
      /* end intermediate screen */
      {path: 'lugares-pago', component: LugaresPagoComponent},
      {path: 'parametros', component: ParametrosComponent},
      {path: 'actualizar-datos', component: ActualizarDatosComponent},
      {path: 'incidencias', component: IncidenciasComponent}
      /*init intermediate screen*/
      /* ,{path: 'respuesta-operacion', component: OperacionComponent, runGuardsAndResolvers: 'always'}, */
      /* ,{path: 'respuesta-operacion/:token', component: OperacionComponent} */
      /* ,{path: 'consulta-recibos', component: OperacionComponent} */
      ,{path: 'respuesta-operacion/:token/:correo', component: OperacionComponent}
      /*end intermediate screen*/
    ]
  },
  {path: 'error', component: ErrorPageComponent, canActivate: [AuthGuardInsideService]},
  {path: '**', pathMatch: 'full', redirectTo: ''}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {onSameUrlNavigation: 'reload', useHash: true});

import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class ApiService {
  login = environment.api + '/login';
  authService = '/autenticacion-usuario';
  registerService = '/registro-usuario';
  supplyService = '/suministros';
  receiptService = '/recibos';
  incidenceService = '/incidencias';
  paymentPlaceService = '/lugares-pago';
  generalService = '/general';
  parameterService = '/parametros';
  enchufateService = '/enchufate';
  visaService = '/visa';
  paidService = '/pago-ejecutado';

  //API GENERAL
  initialData = environment.api + this.generalService + '/carga-pre-definida';
  getTittles = environment.api + this.generalService + '/titulos';
  getParametersCat = environment.api + this.generalService + '/parametros-categoria';

  //API AUTENTICACIÓN
  loginNewUser = environment.api + this.authService + '/aut-nuevo-usu';
  forgotPassword = environment.api + this.authService + '/recuperar-contrasena';
  updatePassword = environment.api + this.authService + '/actualizar-contrasena';

  //API INCIDENCIAS
  affectedTown = environment.api + this.incidenceService + '/municipios-afectados';
  incidencesSupply = environment.api + this.incidenceService + '/incidencias-suministro';
  townIncidences = environment.api + this.incidenceService + '/incidencias-municipios';
  affectedSupply = environment.api + this.incidenceService + '/predio-afectado';

  //API LUGARES PAGO
  listAgencies = environment.api + this.paymentPlaceService + '/lista-agencias';
  listBranches = environment.api + this.paymentPlaceService + '/lista-sucursales';

  //API RECIBOS
  pendingReceipts = environment.api + this.receiptService + '/lista-recibos-deudas-nis';
  paidReceipts = environment.api + this.receiptService + '/lista-recibos-pagados-nis';
  detailReceipt = environment.api + this.receiptService + '/detalle-recibo';
  detailPagos = environment.api + this.receiptService + '/detalle-pagos';
  viewReceipt = environment.api + this.receiptService + '/recibo-pdf';
  validateReceipt = environment.api + this.receiptService + '/validar-recibo-anterior';

  //API REGISTRO
  createUser = environment.api + this.registerService + '/nuevo';
  updateUser = environment.api + this.registerService + '/actualizar-datos';
  infoUser = environment.api + this.registerService + '/obtener-datos';
  verifySupply = environment.api + this.registerService + '/valida-suministro';
  verifyEmail = environment.api + this.registerService + '/valida-correo';
  verifyReferences = environment.api + this.registerService + '/valida-ref-cobro';
  verifyDocument = environment.api + this.registerService + '/vali-tipo-nro-doc';
  confirmAccount = environment.api + this.registerService + '/confirmar';
  sendConfirmation = environment.api + this.registerService + '/enviar-confirmacion';
  sendCodeVerify = environment.api + this.registerService + '/enviar-codigo-confirmacion';
  verifyCode = environment.api + this.registerService + '/valida-codigo-confirmacion';

  //API SUMINISTROS
  listSupplies = environment.api + this.supplyService + '/lista-nis';
  detailSupply = environment.api + this.supplyService + '/detalle-nis';
  historicalConsumption = environment.api + this.supplyService + '/historico-consumo';

  //API PARAMETROS
  listParameters = environment.api + this.parameterService + '/listar-parametros';
  addParameter = environment.api + this.parameterService + '/insertar-parametro';
  editParameter = environment.api + this.parameterService + '/editar-parametro';

  //API ENCHUFATE
  getToken = environment.api + this.enchufateService + '/autorizacion';
  genLiquidation = environment.api + this.enchufateService + '/generar-liquidacion';
  //MBSpayLiquidation = environment.api + this.enchufateService + '/pagar-liquidacion';
  genLiquidation2 = environment.api + this.enchufateService + '//generar-liquidacion-v2';

  //API VISA
  getSessionVisa = environment.api + this.visaService + '/session-visa';
  getPayResultVISA = environment.api + this.generalService + '/pago-ejecutado';
  getPayResultVISA2 = environment.api + this.generalService + '/pago-ejecutado-v2';

  //API PAGO EJECUTADO
  getPayResult = environment.api + this.paidService + '/obtener-resultado';
  getPaySuccessData = environment.api + this.paidService + '/obtener-datos-pago';
}

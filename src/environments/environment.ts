// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // api: 'http://webapp17.sedapal.com.pe:8080/OficinaComercialVirtual/api',//DES SEDAPAL
  // api: 'http://10.100.176.87:8080/OficinaComercialVirtual/api',//QA SEDAPAL
  // api: 'http://webapp16.sedapal.com.pe:8080/OficinaComercialVirtual/api',//PRD SEDAPAL
  api: 'http://localhost:8080/api', // Local

  appname: 'sedapal',
  initialToken: 'sedtoken',
  reCaptchaKey: '6Le5QKMUAAAAAKDboLmX7G0HvyNYE67_NkVONnwp',
  mapKey: 'AIzaSyAVvKgrMaUhKBPRAcak6pH-kDLFRf_BuuU',
  scriptVisa: 'https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true',
  login: { username: 'OCV_Sedapal', password: 'OCV0109' }
  /* add flagChannel */
  , flagChannel: '1'
};

export let titulos = {
  titulo: '',
  subtitulo1: '',
  subtitulo2: '',
  marquesina: ''
}

export let imagenes = {
  urlBase: '',
  carpetaImagenes: '',
  logo: '',
  background: '',
  descCarousel1: '',
  descCarousel2: '',
  descCarousel3: '',
  descCarousel4: '',
  carousel1: '',
  carousel2: '',
  carousel3: '',
  carousel4: '',
  banner: '',
  sidenav: '',
  logo_color: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

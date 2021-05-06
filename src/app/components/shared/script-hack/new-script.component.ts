import {AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
/*inicio cvalenciap*/
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import {MainService} from '../../../services';
/* fin cvalenciap */

@Component({
  selector: 'script-hack',
  templateUrl: './new-script.component.html'
})
export class NewScriptComponent implements AfterViewInit {

  @Input() src: string;
  @Input() sessiontoken: string;
  @Input() merchantid: string;
  @Input() merchantlogo: string;
  @Input() formbuttoncolor: string;
  @Input() amount: string;
  @Input() purchasenumber: string;
  @Input() merchantname: string;

  @ViewChild('script') script: ElementRef;
  @BlockUI() blockUI: NgBlockUI;

  /* inicio cvalenciap */
  urlBase : string;
  constructor(private mainService : MainService) {
  }

  convertToScript() {
    this.mainService.getInitialData().then(response => {
      if(response.nRESP_SP && response.bRESP){
        this.urlBase = response.bRESP.urlWebFront.URL_OCV_WEB;
        this.blockUI.start();
        var element = this.script.nativeElement;
        var script = document.createElement('script');
        /*script.src = this.src;
        script.dataset.sessiontoken = this.sessiontoken;
        script.dataset.merchantid = this.merchantid;
        //script.dataset.merchantlogo = this.merchantlogo;
        script.dataset.formbuttoncolor = this.formbuttoncolor;
        script.dataset.amount = this.amount;
        script.dataset.purchasenumber = this.purchasenumber;
        script.dataset.merchantname = '';
        //script.dataset.showamount = this.showamount;
        //script.dataset.cardholdername = this.cardholdername;
        //script.dataset.cardholderlastname = this.cardholderlastname;
        //script.dataset.cardholderemail = this.cardholderemail;
        script.dataset.channel = 'web';
        script.dataset.expirationminutes = '10';
        script.dataset.timeouturl = 'http://localhost:4200/consulta-recibos';
        script.dataset.merchantnamesize = '1';
        script.dataset.merchantnameheight = '1';
        script.dataset.merchantnameweight = '1';*/

        script.setAttribute("src", this.src);
        script.setAttribute("data-sessiontoken", this.sessiontoken);
        script.setAttribute("data-merchantid", this.merchantid);
        script.setAttribute("data-formbuttoncolor", this.formbuttoncolor);
        script.setAttribute("data-amount", this.amount);
        script.setAttribute("data-purchasenumber", this.purchasenumber);
        script.setAttribute("data-merchantname", '');
        script.setAttribute("data-channel", 'web');
        script.setAttribute("data-expirationminutes", '10');
        /* script.setAttribute("data-timeouturl", 'http://localhost:4200/consulta-recibos'); */
        script.setAttribute("data-timeouturl", this.urlBase + 'consulta-recibos');
        script.setAttribute("data-merchantnamesize", '1');
        script.setAttribute("data-merchantnameheight", '1');
        script.setAttribute("data-merchantnameweight", '1');


        if (element.innerHTML) {
          script.innerHTML = element.innerHTML;
        }
        var parent = element.parentElement;
        parent.parentElement.replaceChild(script, parent);
        parent.innerHTML = "safe : 'script'";
        this.blockUI.stop();
      }
    }, error => {
      this.mainService.verifyToken();
    });  


    
  }

  ngAfterViewInit() {
    /* $.getScript("https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true", function () {
    }); */
    this.convertToScript();
    
    /*inicio cvalenciap*/
    /* $('#container').on('click','.btn-control btn btn-submit btn-success btn-block btn-pay j-secure-form-submit btn-decorator',function() {
      console.log("recognize boton pago")
      var id = $(this).attr('id');
      alert(id);    
    });
    $(document).ready(function(){
      $("button").click(function(){
          alert("entra jquery");
      });
    });
    $("formVisa").submit(function(event){
      console.log("entra a la validacion del submit");
      debugger;
      this.blockUI.start();
    }); */
  }

  /*inicio cvalenciap*/

  /* onSubmit() {
    debugger;
    console.log("entra submit new -script");
    //this.blockUI.start();
  }

  @HostListener('window:click', ['$event.target'])
  onClick(targetElement: string) {
    if($(targetElement).hasClass("start-js-btn modal-opener default")){
      console.log("entra a boton de visa");
    }
    console.log(`You clicked on`, targetElement);
    this.validarButton = true;
  }  

  @HostListener('window.popstate', ['$event'])
  onPopState(event){
    console.log("entra pop");
    this.blockUI.start();
  } */

}

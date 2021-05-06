import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/';
import {OpenDialogDirective} from '../../directives/';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  @ViewChild(OpenDialogDirective) openDialog;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    /*this.root = 'http://localhost:8888';
    this.corsHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    });
    //this.contents = '';*/
    const headers = new HttpHeaders()
    .set('Content-Type', 'undefined')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods', 'POST')
    .set('Access-Control-Allow-Headers', 'Origin')
    .set('Access-Control-Allow-Credentials', 'true');
  }

  ngOnInit() {
    console.log('llegue');
    console.log(this.route);
    this.route.params.subscribe(params => {
      if (params && params.token) {
        this.verifyToken(params.token);
      } else {
        this.goHome();
      }
    });
  }

  verifyToken(token: string) {
    this.userService.confirmAccount({token, flag_act: 0}).subscribe(
      response => {
        if (response.nRESP_SP && response.nRESP_SP !== 0) {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'confirmOk',
            email: response.bRESP.correo,
            mensajeCab: response.cRESP_SP.split('|')[0],
            mensajeDesc: response.cRESP_SP.split('|')[1]
          });
        } else {
          this.openDialog.onClick({
            dialogType: 'content',
            dialogSRC: 'error',
            error: response.cRESP_SP
          });
        }
        setTimeout(() => this.goHome());
      },
      error => {
        this.openDialog.onClick({
          dialogType: 'content',
          dialogSRC: 'error',
          error: error.cRESP_SP
        });
        setTimeout(() => this.goHome());
      }
    );
  }

  goHome() {
    this.router.navigate(['/']);
  }
}

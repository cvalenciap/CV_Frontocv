import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-toggle-password',
  templateUrl: './toggle-password.component.html',
  styleUrls: ['./toggle-password.component.css']
})
export class TogglePasswordComponent {

  @Input() input: any;
  icon: string;

  constructor() {
    this.icon = 'open';
  }

  tooglePassword() {
    this.input.type = this.input.type === 'password' ? 'text' : 'password';
    this.icon = this.input.type === 'password' ? 'open' : 'close';
  }

}

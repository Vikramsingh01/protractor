import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header/header.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'tr-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(private headerService: HeaderService, private tokenService: TokenService) { }

  isLoggedIn = false;
  ngOnInit() {
	  if(this.tokenService.getToken()=="" || this.tokenService.getToken()==null){
      this.isLoggedIn = false;
    }else{
      this.isLoggedIn = true;
    }
	  this.headerService.login.subscribe(loginStatus=> {
      this.isLoggedIn = loginStatus;
    });
	  
  }

}

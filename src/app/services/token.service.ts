import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class TokenService {

  token: string;

  isLoggedIn: EventEmitter<any> = new EventEmitter();

  getToken(): string{
    return localStorage.getItem("token");
    //return this.token;
  }

  setToken(token: string){
    //this.token = token;
    localStorage.setItem("token", token);
  }

  changeLogin(status: boolean){
    this.isLoggedIn.emit(status);
  }

  getLogin(){
    return this.isLoggedIn;
  }
}

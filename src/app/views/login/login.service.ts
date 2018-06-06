import { Injectable } from '@angular/core';
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';

@Injectable()
export class LoginService {

  baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AUTHENTICATION;

  constructor(private http: Http) { }

  login(user: any): any{
    const body = JSON.stringify(user);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseUrl+"/token/grant", body, {headers: headers}).map((response: Response) => response.json());
  }


  logout(token: any): any{
    var tokenRequest={"token":token};
    const body = JSON.stringify(tokenRequest);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseUrl+"/token/delete", body, {headers: headers}).map((response: Response) => response.json());
  }


}

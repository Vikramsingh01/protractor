import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { TokenService } from '../../services/token.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { ResetPasswod } from '../../features/reset-component/reset-password';
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';


@Injectable()
export class ResetPasswordService {

  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AUTHENTICATION;

  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService) { }

  resetPasswordProfileCreate(resetPasswod: ResetPasswod) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl + "/confirmPassword", resetPasswod, { headers: headers }).map((response: Response) => response.json());
  }
  resetPasswordTokenProfileCreate(resetPasswod: ResetPasswod) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl + "/token/password", resetPasswod, { headers: headers }).map((response: Response) => response.json());
  }

  resetPasswordTokenReCapchaProfileCreate(value: any) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post("https://www.google.com/recaptcha/api/siteverify", value, { headers: headers }).map((response: Response) => response.json());
  }

}
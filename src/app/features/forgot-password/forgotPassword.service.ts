import {Http, Headers, Response, URLSearchParams } from "@angular/http";
import { TokenService } from '../../services/token.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { ForgotPassword } from '../../features/forgot-password/forgot-password';
import {Observable} from "rxjs";
import { Injectable } from '@angular/core';



import { DataService } from '../../services/data.service';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';


@Injectable()
export class ForgotPasswordService {

  // private ForgetPassworddV: ForgetPassword[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AUTHENTICATION;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService){
    // this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }


  forgotPasswordProfileCreate(forgotPassword: ForgotPassword)
{
     const body = JSON.stringify(forgotPassword);
    const headers = new Headers();
  	headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl+"/resetPassword", forgotPassword, {headers: headers}).map((response: Response) => response.json());
}
}
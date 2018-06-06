import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { TokenService } from '../../services/token.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { ChangePasswod } from '../../features/change-password/change-password';
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';


import { DataService } from '../../services/data.service';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';


@Injectable()
export class ChangePasswordService {

  private ChangePasswodV: ChangePasswod[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AUTHENTICATION;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService) {
    // this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }


  changePasswordProfileCreate(changePasswod: ChangePasswod) {
    const body = JSON.stringify(changePasswod);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl + "/changePassword", changePasswod, { headers: headers }).map((response: Response) => response.json());
  }
}
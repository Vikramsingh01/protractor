import { Injectable } from '@angular/core';
import {InductionLetter} from "./inductionletter";
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AuthorizationService } from '../../services/authorization.service';

@Injectable()
export class InductionLetterService {

  private inductionLetters: InductionLetter[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.INDUCTIONLETTER;
  authorizedFieldsObjList;
  constructor(
    private http: Http,
    private tokenService: TokenService,
    private authenticationGuard: AuthenticationGuard,
    private dataService: DataService,
    private authorizationService: AuthorizationService) {

  }

  getInductionLetter(id: number): Observable<InductionLetter> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  addInductionLetter(inductionLetter: InductionLetter) {
    const body = JSON.stringify(inductionLetter);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl, inductionLetter, { headers: headers }).map((response: Response) => response.json());
  }



}

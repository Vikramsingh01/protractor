import { Injectable } from '@angular/core';
import {ServiceUser} from "./service-user";
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";

import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';

@Injectable()
export class ServiceUserService {

  private serviceUsers: ServiceUser[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.SERVICEUSER;
  constructor(private http: Http, private tokenService: TokenService){

  }

    search(serviceUser: ServiceUser,size:number,page:number): Observable<ServiceUser[]>{
    const body = JSON.stringify(serviceUser);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl+"/?size="+size+"&page="+page, body, { headers: headers}).map((response: Response) => response.json());
  }

   searchById(id: number): Observable<ServiceUser>{
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl+"/"+id, { headers: headers, body:""}).map((response: Response) => response.json());
  }

  searchByProfileIds(profileIds){
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.SERVICEUSER+"/searchByProfileIds", profileIds, { headers: headers}).map((response: Response) => response.json());
  }

}

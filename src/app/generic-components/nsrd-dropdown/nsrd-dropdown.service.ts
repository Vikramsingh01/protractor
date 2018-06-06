import { Injectable } from '@angular/core';
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';

@Injectable()
export class NsrdDropdownService {

   private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.NSRDLIST;

  constructor(private tokenService: TokenService, private http: Http) { }

   applyNsrdRules(NsrdComponent){
    const body = JSON.stringify({ NsrdComponent });
    
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.QD +NsrdComponent.tableId+"/" +NsrdComponent.listId, {headers: headers, body:""}).map((response: Response) => {
        return response.json();
    });
  }

   getQuestionDependency(listTableId, listItemId) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.QD + listTableId + "/" + listItemId, { headers: headers }).map((response: Response) => response.json());
  }
}

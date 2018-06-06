import { Injectable } from '@angular/core';
import {ApprovedPremiseResidence} from "./approvedpremiseresidence";
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams,RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ApprovedPremiseResidenceConstants } from './approvedpremiseresidence.constants';

@Injectable()
export class ApprovedPremiseResidenceService {

  private approvedPremiseResidences: ApprovedPremiseResidence[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.APPROVEDPREMISERESIDENCE;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getApprovedPremiseResidences(): Observable<ApprovedPremiseResidence[]>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl,{headers: headers, body:""}).map((response: Response) => response.json());
  }

  getApprovedPremiseResidence(id: number): Observable<ApprovedPremiseResidence>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl+"/"+id, { headers: headers, body:""}).map((response: Response) => response.json());
  }

  searchApprovedPremiseResidence(approvedPremiseResidence: ApprovedPremiseResidence){
    const body = JSON.stringify(approvedPremiseResidence);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl+"/search", approvedPremiseResidence, {headers: headers}).map((response: Response) => response.json());
  }
  sortSearchPagination(filterObj, paginationObj, sortObj){

    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());

    let searchParams: URLSearchParams = new URLSearchParams();
    if(sortObj != null && sortObj.field != null && sortObj.field != ""){
      searchParams.append("sort", sortObj.field+","+sortObj.sort);
    }

    if(paginationObj != null){
      searchParams.append("size", paginationObj.size);
      searchParams.append("page", paginationObj.number);
    }

    let options = new RequestOptions({
        headers: headers,
        search: searchParams
    });

    return this.http.post(this.baseUrl+"/search", filterObj, options).map((response: Response) => response.json());
  }


  updateApprovedPremiseResidence(id, approvedPremiseResidence: ApprovedPremiseResidence){
    const body = JSON.stringify(approvedPremiseResidence);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.baseUrl+"/"+id+"/update", approvedPremiseResidence, {headers: headers});
  }
  addApprovedPremiseResidence(approvedPremiseResidence: ApprovedPremiseResidence){
    const body = JSON.stringify(approvedPremiseResidence);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl, approvedPremiseResidence, {headers: headers}).map((response: Response) => response.json());
  }

  delete(approvedPremiseResidenceId: number){
    const body = JSON.stringify({ approvedPremiseResidenceId });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.delete(this.baseUrl+"/"+approvedPremiseResidenceId+"/delete", {headers: headers, body:""});
  }

  isAuthorized(action){
    return this.authenticationGuard.isFeatureActionAuthorized(ApprovedPremiseResidenceConstants.featureId, action);
  }
  isFeildAuthorized(field, action){
    let authorized = false;
    let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', ApprovedPremiseResidenceConstants.featureId);
    if(authorizedFieldsObj!=null){
      if(authorizedFieldsObj['featureFields']!=null){
        let authorizedFields = [];
        //console.log(authorizedFieldsObj['featureFields']['Read']);
        authorizedFields = authorizedFieldsObj['featureFields'][action];
        if(authorizedFields.indexOf(field)>0){
          authorized = true;
        }
      }
    }
    return authorized;
  }

}

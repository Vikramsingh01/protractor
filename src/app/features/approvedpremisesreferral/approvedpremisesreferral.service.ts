import { Injectable } from '@angular/core';
import {ApprovedPremisesReferral} from "./approvedpremisesreferral";
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams,RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ApprovedPremisesReferralConstants } from './approvedpremisesreferral.constants';

@Injectable()
export class ApprovedPremisesReferralService {

  private approvedPremisesReferrals: ApprovedPremisesReferral[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.APPROVEDPREMISESREFERRAL;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getApprovedPremisesReferrals(): Observable<ApprovedPremisesReferral[]>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl,{headers: headers, body:""}).map((response: Response) => response.json());
  }

  getApprovedPremisesReferral(id: number): Observable<ApprovedPremisesReferral>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl+"/"+id, { headers: headers, body:""}).map((response: Response) => response.json());
  }

  searchApprovedPremisesReferral(approvedPremisesReferral: ApprovedPremisesReferral){
    const body = JSON.stringify(approvedPremisesReferral);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl+"-by-criteria", approvedPremisesReferral, {headers: headers}).map((response: Response) => response.json());
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

    return this.http.post(this.baseUrl+"-by-criteria", filterObj, options).map((response: Response) => response.json());
  }

  addApprovedPremisesReferral(approvedPremisesReferral: ApprovedPremisesReferral){
    const body = JSON.stringify(approvedPremisesReferral);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl, approvedPremisesReferral, {headers: headers}).map((response: Response) => response.json());
  }

  updateApprovedPremisesReferral(id, approvedPremisesReferral: ApprovedPremisesReferral){
    const body = JSON.stringify(approvedPremisesReferral);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.baseUrl+"/"+id+"/update", approvedPremisesReferral, {headers: headers});
  }

  delete(approvedPremisesReferralId: number){
    const body = JSON.stringify({ approvedPremisesReferralId });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.delete(this.baseUrl+"/"+approvedPremisesReferralId+"/delete", {headers: headers, body:""});
  }

  isAuthorized(action){
    //return this.authenticationGuard.isFeatureActionAuthorized(ApprovedPremisesReferralConstants.featureId, action);
    return true;
  }
  isFeildAuthorized(field, action){
    let authorized = true;
    let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', ApprovedPremisesReferralConstants.featureId);
    if(authorizedFieldsObj!=null){
      if(authorizedFieldsObj['featureFields']!=null){
        let authorizedFields = [];
        //console.log(authorizedFieldsObj['featureFields']['Read']);
        authorizedFields = authorizedFieldsObj['featureFields'][action];
        if(authorizedFields.indexOf(field)>-1){
          authorized = true;
        }
      }
    }
    return authorized;
  }

}

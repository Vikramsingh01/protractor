import { Injectable } from '@angular/core';
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import {LasuConstants} from "./lasu.constants";
import {LasuOffenderProfile} from "./lasu-offenderprofile";
import {LasuExclusion} from "./models/lasu-exclusion";

@Injectable()
export class LasuExclusionService{
  private homeBaseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LASUEXCLUSION;
    //'http://localhost:8080/lasu/exclusion';
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){

  }

  addLasuExclusions(lasuExclusionList: LasuExclusion[]) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.homeBaseUrl, lasuExclusionList, { headers: headers }).map((response: Response) => response.json());
  }

  getLasuExclusions(profileId: any) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.homeBaseUrl + "/" + profileId, { headers: headers }).map((response: Response) => response.json());
  }

  validateLasuExclusions(lasuExclusion: LasuExclusion) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.homeBaseUrl+'/validate', lasuExclusion, { headers: headers }).map((response: Response) => response.json());
  }

  endLasuExclusions(lasuExclsuionId: any) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.homeBaseUrl+'/end/'+ lasuExclsuionId, { headers: headers }).map((response: Response) => response.json());
  }

  updateLasuExclusions(lasuExclusionList: LasuExclusion[]) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.homeBaseUrl, lasuExclusionList, { headers: headers }).map((response: Response) => response.json());
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    let searchParams: URLSearchParams = new URLSearchParams();

    if(sortObj != null && sortObj.length > 0){
      sortObj.forEach((element: any) => {
        searchParams.append("sort", element.field + "," + element.sort);
      });
    }


    if (sortObj != null && sortObj.field != null && sortObj.field != "") {
      searchParams.append("sort", sortObj.field + "," + sortObj.sort);
    }
    if (paginationObj != null) {
      searchParams.append("size", paginationObj.size);
      searchParams.append("page", paginationObj.number);
    }
    let options = new RequestOptions({
      headers: headers,
      search: searchParams
    });
    return this.http.post(this.homeBaseUrl, filterObj, options).map((response: Response) => response.json());
  }

  isAuthorized(action){
    return this.authenticationGuard.isFeatureActionAuthorized(LasuConstants.featureId, action);
  }

  isAuthorize(profileId: number,action:string): Observable<LasuOffenderProfile> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    // return this.http.get("http://localhost:4103/serviceuser" + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
    return this.http.get(this.homeBaseUrl + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
      if(response.text() !=null && response.text()!=""){
        return response.json()
      }else{
        return {};
      }
    });
  }
}

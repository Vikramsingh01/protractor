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
import {LasuRestriction} from "./models/lasu-restriction";
import {isNumber} from "util";

@Injectable()
export class LasuRestrictionService {

  private homeBaseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LASURESTRICTION;
    //'http://localhost:8080/lasu/restriction';
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){

  }

  addLasuRestrictions(lasuRestrictionList: LasuRestriction[]) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.homeBaseUrl, lasuRestrictionList, { headers: headers }).map((response: Response) => response.json());
  }

  getLasuRestrictions(profileId: any) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.homeBaseUrl + "/" + profileId, { headers: headers }).map((response: Response) => response.json());
  }

  updateLasuRestrictions(lasuRestrictionList: any) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.homeBaseUrl, lasuRestrictionList, { headers: headers }).map((response: Response) => response.json());
  }

  validateLasuRestrictions(lasuRestriction: LasuRestriction) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.homeBaseUrl+'/validate', lasuRestriction, { headers: headers }).map((response: Response) => response.json());
  }

  endLasuRestrictions(lasuRestrictionId: any) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.homeBaseUrl+'/end/'+ lasuRestrictionId, { headers: headers }).map((response: Response) => response.json());
  }

  checkIsLasu(profileId: any){
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.homeBaseUrl+'/status/'+ profileId, { headers: headers }).map((response: Response) => response.json());
  }

  getOfficers(profileId: any){
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.homeBaseUrl+'/getOfficers/'+ profileId, { headers: headers }).map((response: Response) => response.json());
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

  sortFilterAndPaginateForCrc(filterObj, paginationObj, sortObj) {
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
    return this.http.post(this.homeBaseUrl + "/searchforcrc", filterObj, options).map((response: Response) => response.json());
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

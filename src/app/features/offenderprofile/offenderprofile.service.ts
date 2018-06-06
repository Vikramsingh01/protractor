import { Injectable } from '@angular/core';
import {OffenderProfile} from "./offenderprofile";
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { OffenderProfileConstants } from './offenderprofile.constants';

@Injectable()
export class OffenderProfileService {

  private offenderProfiles: OffenderProfile[] = [];
  private homeBaseUrl: String = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.SERVICEUSER;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){

  }

/** getOffenderProfile(id: number): Observable<OffenderProfile>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl+"/"+id, { headers: headers, body:""}).map((response: Response) => response.json());
  } */

   /**getOffenderProfileView(id: number): Observable<OffenderProfile>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl+"/offenderprofileview/"+id, { headers: headers, body:""}).map((response: Response) => response.json());
  } */

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
    return this.http.post(this.homeBaseUrl + "/search", filterObj, options).map((response: Response) => response.json());
  }

  sortFilterAndPaginateRecentlyViewed(filterObj, paginationObj, sortObj) {
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
    return this.http.post(this.homeBaseUrl + "/recentlyviewed", filterObj, options).map((response: Response) => response.json());
  }

  sortFilterAndPaginateForTeam(filterObj, paginationObj, sortObj) {
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
    return this.http.post(this.homeBaseUrl + "/searchforteam", filterObj, options).map((response: Response) => response.json());
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

  getOffenderProfileByProfileId(profileId: number): Observable<OffenderProfile>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.homeBaseUrl+"/"+profileId, { headers: headers, body:""}).map((response: Response) => {
     if(response.text() !=null && response.text()!=""){
         return response.json()
      }else{
        return {};
      }
    });
  }

  getOffenderPrisonLocationId(profileId: number): Observable<any>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.homeBaseUrl+"/prisonlocation/"+profileId, { headers: headers, body:""}).map((response: Response) => {
      if(response.text() !=null && response.text()!=""){
         return response.json()
      }else{
        return {};
      }
    });
  }

  getOffenderProfileSummaryByProfileId(profileId: number): Observable<OffenderProfile>{
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.homeBaseUrl+"/summary/"+profileId, { headers: headers, body:""}).map((response: Response) => {
       if(response.text() !=null && response.text()!=""){
         return response.json()
      }else{
        return {};
      }
    });
  }

  updateOffenderProfile(id: number, offenderProfile: OffenderProfile){
    const body = JSON.stringify(offenderProfile);
    const headers = new Headers();
	  headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.homeBaseUrl+"/"+id, offenderProfile, {headers: headers});
  }






  searchOffenderProfile(offenderProfile: OffenderProfile): Observable<any[]> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    let options = new RequestOptions({
      headers: headers,
     search: new URLSearchParams('sort=familyName&sort=firstName&size=5')
    });

    return this.http.post(this.homeBaseUrl+"/search", offenderProfile, options ).map((response: Response) => response.json());
  }


  isAuthorized(action){
    return this.authenticationGuard.isFeatureActionAuthorized(OffenderProfileConstants.featureId, action);
  }
  isFeildAuthorized(field, action){
    let authorized = false;
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
    let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', OffenderProfileConstants.featureId);
    if(authorizedFieldsObj!=null){
      if(authorizedFieldsObj['featureFields']!=null){
        let authorizedFields = [];
        authorizedFields = authorizedFieldsObj['featureFields'][action];
        if(authorizedFields.indexOf(field)>-1){
          authorized = true;
        }
      }
    }
    return authorized;
  }

  isAuthorize(profileId: number,action:string): Observable<OffenderProfile> {
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

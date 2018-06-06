import { Injectable } from '@angular/core';
import { PersonalCircumstance } from "./personal-circumstance";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { PersonalCircumstanceConstants } from './personal-circumstance.constants';

@Injectable()
export class PersonalCircumstanceService {

    private personalCircumstanceList: PersonalCircumstance[] = [];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PersonalCircumstance;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getPersonalCircumstanceList(): Observable<PersonalCircumstance[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getPersonalCircumstance(id: number): Observable<PersonalCircumstance> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

     getPersonalFilteredCircumstanceList(id: number, pcId: number): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        if(pcId == null){
            pcId = -1;
        }
        return this.http.get(this.baseUrl + "/"+"filterlist/" + id +"/pcid/" + pcId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updatePersonalCircumstance(id: number, personalCircumstance: PersonalCircumstance) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, personalCircumstance, { headers: headers });
    }

    sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        let searchParams: URLSearchParams = new URLSearchParams();
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
        return this.http.post(this.baseUrl + "/search", filterObj, options).map((response: Response) => response.json());
    }

    addPersonalCircumstance(personalCircumstance: PersonalCircumstance) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, personalCircumstance, { headers: headers }).map((response: Response) => response.json());
    }

    deletePersonalCircumstance(personalCircumstanceId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + personalCircumstanceId, { headers: headers, body: "" });
    }

    searchPersonalCircumstance(personalCircumstance: PersonalCircumstance){
        const body = JSON.stringify(personalCircumstance);
        const headers = new Headers();
	    headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl+"-by-criteria", personalCircumstance, {headers: headers}).map((response: Response) => response.json());
  }
    //  getPersonalCircumstanceForOffender(profileId: number): Observable<PersonalCircumstance> {
    //     const headers = new Headers();
    //     headers.append('Accept', 'application/json');
    //     headers.append('Content-Type', 'application/json');
    //     headers.append("X-Authorization", this.tokenService.getToken());
    //     return this.http.get(this.baseUrl + "/searchforprofile/" + profileId, { headers: headers, body: "" }).map((response: Response) => {
    //         if(response.text() !=null && response.text()!=""){
    //             return response.json()
    //         }else{
    //             return {};
    //         }
    //     });
    // }

   isAuthorize(profileId: number,action:string): Observable<PersonalCircumstance> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
      //  return this.http.get("http://localhost:4108/personalcircumstance" + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
        return this.http.get(this.baseUrl + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
    }

  
}

import { Injectable } from '@angular/core';
import { AdditionalIdentifier } from "./additional-identifier";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AdditionalIdentifierConstants } from './additional-identifier.constants';

@Injectable()
export class AdditionalIdentifierService {

    private additionalIdentifierList: AdditionalIdentifier[] = [];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AdditionalIdentifier;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getAdditionalIdentifierList(): Observable<AdditionalIdentifier[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getAdditionalIdentifier(id: number): Observable<AdditionalIdentifier> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateAdditionalIdentifier(id: number, additionalIdentifier: AdditionalIdentifier) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, additionalIdentifier, { headers: headers });
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

    addAdditionalIdentifier(additionalIdentifier: AdditionalIdentifier) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, additionalIdentifier, { headers: headers }).map((response: Response) => response.json());
    }

    deleteAdditionalIdentifier(additionalIdentifierId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + additionalIdentifierId, { headers: headers, body: "" });
    }

   isAuthorize(profileId: number,action:string): Observable<AdditionalIdentifier> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        //return this.http.get("http://localhost:4103/additionalidentifier" + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
       return this.http.get(this.baseUrl + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
    }

}

import { Injectable } from '@angular/core';
import { LicenceCondition } from "./licence-condition";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { LicenceConditionConstants } from './licence-condition.constants';

@Injectable()
export class LicenceConditionService {

    private licenceConditionList: LicenceCondition[] = [];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LicenceCondition;
    private baseUrlForEvent: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.EVENT;
    private baseUrlForRelease: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.RELEASE;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getLicenceConditionList(): Observable<LicenceCondition[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getLicenceCondition(id: number): Observable<LicenceCondition> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateLicenceCondition(id: number, licenceCondition: LicenceCondition) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, licenceCondition, { headers: headers });
    }

    terminateLicenceCondition(id: number, licenceCondition: LicenceCondition) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/" + id + "/terminate-lic-condition", licenceCondition, { headers: headers });
    }

    terminateLicenceConditionCRD(licenceCondition) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/crd", licenceCondition, { headers: headers }).map((response: Response) => response.json());
    }

    getActiveRelease(id: number): Observable<LicenceCondition> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrlForRelease + "/activeReleaseforLIC/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
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

    addLicenceCondition(licenceCondition: LicenceCondition) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, licenceCondition, { headers: headers }).map((response: Response) => response.json());
    }

    deleteLicenceCondition(licenceConditionId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + licenceConditionId, { headers: headers, body: "" });
    }

    getDisposalByEventId(eventId: number): Observable<LicenceCondition> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrlForEvent + "/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }
isAuthorize(profileId: number,action:string): Observable<LicenceCondition> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get( this.baseUrl + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
       // return this.http.get("http://localhost:4110/licencecondition" + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
    }

    unTerminateLicenceCondition(id: number, licenceCondition: LicenceCondition) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/" + id + "/unterminate-lic-condition", licenceCondition, { headers: headers });
    }
}

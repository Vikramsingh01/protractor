import { Injectable } from '@angular/core';
import { PssRequirement } from "./pss-requirement";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { PssRequirementConstants } from './pss-requirement.constants';

@Injectable()
export class PssRequirementService {

    private pssRequirementList: PssRequirement[] = [];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PSSREQUIREMENT;
    private baseUrlForCustLocation: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.CUSTODYLOCATION;

    private baseUrlForEvent: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.EVENT;



    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getPssRequirementList(): Observable<PssRequirement[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getPssRequirement(id: number): Observable<PssRequirement> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getActivePssForPssReq(eventId: number) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/getActivePssForPssReq" + "/" + eventId, { headers: headers, body: "" });
    }

    getCustodyLocationCurrentByEventId(eventId: number): Observable<PssRequirement> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrlForCustLocation + "/currentstatus/event/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    // isLicenceConditionActive(eventId: number): Observable<PssRequirement> {
    //     const headers = new Headers();
    //     headers.append('Accept', 'application/json');
    //     headers.append('Content-Type', 'application/json');
    //     headers.append("X-Authorization", this.tokenService.getToken());
    //     return this.http.get(this.baseUrl + "/getActiveLicenceCondition/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    // }

    getCustodyLocationByProfileId(profileId: number): Observable<PssRequirement> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrlForCustLocation + "/profile/" + profileId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updatePssRequirement(id: number, pssRequirement: PssRequirement) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, pssRequirement, { headers: headers });
    }

    getCustLocationStatus(eventId: number): Observable<PssRequirement> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/getCustLocationStatus" + "/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    terminatePssRequirement(id: number, pssRequirement: PssRequirement) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/" + id + "/terminate-pss-requirement", pssRequirement, { headers: headers });
    }

    terminatePssRequirementCRD(pssRequirement) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/crd", pssRequirement, { headers: headers }).map((response: Response) => response.json());
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

    addPssRequirement(pssRequirement: PssRequirement) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, pssRequirement, { headers: headers }).map((response: Response) => response.json());
    }

    getReleaseDateByEventId(eventId: number) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/getReleaseDate/" + eventId, { headers: headers, body: "" });
    }

    deletePssRequirement(pssRequirementId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + pssRequirementId, { headers: headers, body: "" });
    }

    getDisposalByEventId(eventId: number): Observable<PssRequirement> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrlForEvent + "/" + eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    removeConstantsFields(obj) {
        obj.createdDate = null;
        obj.createdBy = null;
        obj.createdByUserId = null;
        obj.modifiedBy = null;
        obj.modifiedByUserId = null;
        obj.modifiedDate = null;
        obj.deletedDate = null;
        return obj;
    }

    complexRefDataRequestForDisposal(eventJson) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/disposal/crd", eventJson, { headers: headers }).map((response: Response) => response.json());
    }

    isAuthorize(profileId: number, action: string): Observable<PssRequirement> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        // return this.http.get("http://localhost:4103/alias" + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
        return this.http.get(this.baseUrl + "/authorize/" + profileId + "/" + action, { headers: headers, body: "" }).map((response: Response) => {
            if (response.text() != null && response.text() != "") {
                return response.json()
            } else {
                return {};
            }
        });
    }

    unTerminatePssRequirement(id: number, pssRequirement: PssRequirement) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl + "/" + id + "/unterminate-pss-requirement", pssRequirement, { headers: headers });
    }

}

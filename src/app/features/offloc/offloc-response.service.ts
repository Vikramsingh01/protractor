import { Injectable } from '@angular/core';
import { Offloc } from "./offloc";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants,ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { OfflocConstants } from './offloc.constants';
import {OfflocRequest} from "./offloc-request";

@Injectable()
export class OfflocResponseService {

    private offlocList: Offloc[] = [];
    private baseUrl: string = //'http://localhost:4103/' + ServiceUrlConstants.OFFLOCRESPONSE;
      ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.OFFLOCRESPONSE;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getOfflocResponseList(crcSearch: number): Observable<Offloc[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/search/"+crcSearch, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getOfflocResponseBySearchId(id: number): Observable<Offloc> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/search/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getOfflocResponse(id: number): Observable<Offloc> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    updateOfflocResponse(id: number, offloc: Offloc) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl + "/" + id, offloc, { headers: headers });
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

    addOfflocResponse(offlocRequest: OfflocRequest) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, offlocRequest, { headers: headers }).map((response: Response) => response.json());
    }

    deleteOfflocResponse(offlocResponseId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + offlocResponseId, { headers: headers, body: "" });
    }

}

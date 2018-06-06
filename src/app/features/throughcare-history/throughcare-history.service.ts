import { Injectable } from '@angular/core';
import { ThroughCareHistory } from "./throughcare-history";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';

@Injectable()
export class ThroughCareHistoryService {

    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.CUSTODYKEYDATE;
    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getThroughCareHistoryList(eventId:number): Observable<ThroughCareHistory[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl+"/throughCareHistory/"+eventId, { headers: headers, body: "" }).map((response: Response) => response.json());
        //return this.http.post(this.baseUrl + "/search", filterObj, options).map((response: Response) => response.json());
    }

}

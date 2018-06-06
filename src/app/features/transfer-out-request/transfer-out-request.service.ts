import { Injectable } from '@angular/core';
import { TransferOutRequest } from "./transfer-out-request";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { TransferOutRequestConstants } from './transfer-out-request.constants';

@Injectable()
export class TransferOutRequestService {

    private transferOutRequestList: TransferOutRequest[] = [];
    private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.TRANSFER_OUT_REQUEST;

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

    }

    getTransferOutRequestList(): Observable<TransferOutRequest[]> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getTransferOutRequest(id: number): Observable<TransferOutRequest> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
    }

    getTransferOutRequests(id: number, filterObj){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        let searchParams: URLSearchParams = new URLSearchParams();
        
        let options = new RequestOptions({
            headers: headers,
            search: searchParams
        });
        return this.http.post(this.baseUrl+ "/generate/"+id, filterObj, options).map((response: Response) => response.json());
    }

    // updateTransferOutRequest(id: number, transferOutRequest: TransferOutRequest) {
    //     const headers = new Headers();
    //     headers.append('Accept', 'application/json');
    //     headers.append('Content-Type', 'application/json');
    //     headers.append("X-Authorization", this.tokenService.getToken());
    //     return this.http.patch(this.baseUrl + "/" + id, transferOutRequest, { headers: headers });
    // }

 updateTransferOutRequest(id: number, transferOutRequest: TransferOutRequest) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.patch(this.baseUrl+ "/update/" + id, transferOutRequest, { headers: headers });
    }

    sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        let searchParams: URLSearchParams = new URLSearchParams();
       
        if (paginationObj != null) {
            searchParams.append("size", paginationObj.size);
            searchParams.append("page", paginationObj.number);
        }

        let options = new RequestOptions({
            headers: headers,
           search: searchParams
          // search: new URLSearchParams('sort=desc&size=5')
        });
      
       return this.http.post(this.baseUrl+ "/search", filterObj, options).map((response: Response) => response.json());
    }


    sortFilterAndPaginateForHistory(filterObj, paginationObj, sortObj,id: number) {
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
       return this.http.post(this.baseUrl+ "/history/"+id , filterObj, options).map((response: Response) => response.json());
    }

    addTransferOutRequest(transferOutRequest: TransferOutRequest) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, transferOutRequest, { headers: headers }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }    
        });
    }

    deleteTransferOutRequest(transferOutRequestId: number) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.delete(this.baseUrl + "/" + transferOutRequestId, { headers: headers, body: "" });
    }

 getProviderFilteredList(): Observable<any> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
       return this.http.get(this.baseUrl + "/filterProviderList" , { headers: headers, body: "" }).map((response: Response) => response.json());
       
    }
    isAllRequestTransfer(transferOutRequest: TransferOutRequest): Observable<TransferOutRequest> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
         return this.http.post(this.baseUrl+ "/authorize", transferOutRequest, { headers: headers }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }    
        });
    }
}

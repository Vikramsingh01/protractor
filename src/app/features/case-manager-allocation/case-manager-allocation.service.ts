import { Injectable } from '@angular/core';
import { TokenService } from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams,RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AuthorizationService } from '../../services/authorization.service';
import { CaseManagerAllocation } from './case-manager-allocation';
import { ComponentAllocationPendingTransfer } from '../pending-transfer/component-allocation-transfer';
import { ComponentManager } from './component-management';
@Injectable()
export class CaseManagerAllocationService {

   private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.CASE_MANAGER_ALLOCATION;;
ComponentManagerJsonArr: any[]=[];
  constructor( 
    private http: Http, 
    private tokenService: TokenService, 
    private authenticationGuard: AuthenticationGuard, 
    private dataService:DataService,
    private authorizationService: AuthorizationService) {
    
   }

    addCaseManagerForPendingTransfer(componentAllocationPendingTransfer:ComponentAllocationPendingTransfer){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl+"/pendingtransfer", componentAllocationPendingTransfer, { headers: headers }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }    
        });
    }

    
    getCaseManagerForEdit(componentAllocationPendingTransfer: ComponentAllocationPendingTransfer): Observable<CaseManagerAllocation> {

       const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl+ "/searchbydata", componentAllocationPendingTransfer, { headers: headers }).map((response: Response) => response.json());

    }
    getCaseManagerForServiceUser(id: number, filterObj){
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
     addCaseManagerForServiceUser(componentAllocationPendingTransfer:ComponentAllocationPendingTransfer){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl, componentAllocationPendingTransfer, { headers: headers }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }    
        });
    }
  
    addComponetManager(ComponentManagerJsonArr:any){
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.baseUrl+ "/updatewithincrc", ComponentManagerJsonArr, { headers: headers }).map((response: Response) => {

        //return this.http.post("http://localhost:4105/casemanagerallocation"+ "/updatewithincrc", ComponentManagerJsonArr, { headers: headers }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }    
        });
    }

   sortFilterAndPaginateForComponentManager(id: number,filterObj) {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        let searchParams: URLSearchParams = new URLSearchParams();
        
        let options = new RequestOptions({
            headers: headers,
            search: searchParams
        });
       return this.http.post(this.baseUrl+ "/service/"+id , filterObj, options).map((response: Response) => response.json());
      // return this.http.post("http://localhost:4105/casemanagerallocation"+ "/service/"+id , filterObj, options).map((response: Response) => response.json());
    }
}

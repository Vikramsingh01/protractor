import { Injectable } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import {Http, Headers, Response} from '@angular/http';
import { DataService } from '../../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../../shared/service-url-constants';
import { AuthenticationGuard } from '../../../guards/authentication.guard';


@Injectable()
export class TransferRequestService {

  transferObj: any;
  setTransferData(flag: boolean, profileId: number, reason: number){
    this.transferObj = {};
    this.transferObj.flag = flag;
    this.transferObj.profileId = profileId;
    this.transferObj.reason = reason;
  }
  getTransferData(){
    return this.transferObj;
  }

  consolidatedTransferRequest: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.ConsolidatedTransferRequest;

  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService:DataService){
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getConsolidatedTransferRequest(id: number){
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('X-Authorization', this.tokenService.getToken());
      return this.http.get(this.consolidatedTransferRequest + '/transfer-request/' + id, { headers: headers, body: '' }).map((response: Response) => response.json());
  }
}

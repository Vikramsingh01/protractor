import { Injectable } from '@angular/core';
import { ProposedRequirement } from "./proposedrequirement";
import { TokenService } from '../../services/token.service';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { DataService } from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ProposedRequirementConstants } from './proposedrequirement.constants';

@Injectable()
export class ProposedRequirementService {

  private proposedRequirements: ProposedRequirement[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PROPOSEDREQUIREMENT;
  authorizedFieldsObjList;
  constructor(private http: Http, private tokenService: TokenService, private authenticationGuard: AuthenticationGuard, private dataService: DataService) {
    this.authorizedFieldsObjList = this.dataService.getFeatureFields();
  }

  getProposedRequirements(): Observable<ProposedRequirement[]> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  getProposedRequirement(id: number): Observable<ProposedRequirement> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
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

  searchProposedRequirement(proposedRequirement: ProposedRequirement) {
    const body = JSON.stringify(proposedRequirement);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl + "/search", proposedRequirement, { headers: headers }).map((response: Response) => response.json());
  }

  addProposedRequirement(proposedRequirement: ProposedRequirement) {
    const body = JSON.stringify(proposedRequirement);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.post(this.baseUrl, proposedRequirement, { headers: headers }).map((response: Response) => response.json());
  }
  updateUpwAppointment(id: number, proposedRequirement: ProposedRequirement) {
    const body = JSON.stringify(proposedRequirement);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.patch(this.baseUrl + "/" + id , proposedRequirement, { headers: headers });
  }
  delete(proposedRequirementId: number) {
    const body = JSON.stringify({ proposedRequirementId });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.delete(this.baseUrl + "/" + proposedRequirementId + "/delete", { headers: headers, body: "" });
  }

  isAuthorized(action) {
    return this.authenticationGuard.isFeatureActionAuthorized(ProposedRequirementConstants.featureId, action);
  }
  isFeildAuthorized(field, action) {
    let authorized = false;
    let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(this.authorizedFieldsObjList, 'featureId', ProposedRequirementConstants.featureId);
    if (authorizedFieldsObj != null) {
      if (authorizedFieldsObj['featureFields'] != null) {
        let authorizedFields = [];
        //console.log(authorizedFieldsObj['featureFields']['Read']);
        authorizedFields = authorizedFieldsObj['featureFields'][action];
        if (authorizedFields.indexOf(field) > 0) {
          authorized = true;
        }
      }
    }
    return authorized;
  }

}

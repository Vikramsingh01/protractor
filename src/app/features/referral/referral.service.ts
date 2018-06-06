import {Injectable} from '@angular/core';
import {Referral} from './referral';
import {TokenService} from '../../services/token.service';
import {Http, Headers, Response, URLSearchParams, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {DataService} from '../../services/data.service';
import { ServiceUrlConstants, ServerUrl } from '../../shared/service-url-constants';

@Injectable()
export class ReferralService {

  private referralList: Referral[] = [];
  private baseUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.REFERRAL;

  constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) {

  }

  getReferralList(): Observable<Referral[]> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Authorization', this.tokenService.getToken());
    return this.http.get(this.baseUrl, {headers: headers, body: ''}).map((response: Response) => response.json());
  }

  getReferral(id: number): Observable<Referral> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Authorization', this.tokenService.getToken());
    return this.http.get(this.baseUrl + "/" + id, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  updateReferral(id: number, referral: Referral) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Authorization', this.tokenService.getToken());
    return this.http.patch(this.baseUrl + '/' + id, referral, {headers: headers});
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Authorization', this.tokenService.getToken());
    let searchParams: URLSearchParams = new URLSearchParams();
    if (sortObj != null && sortObj.field != null && sortObj.field !== '') {
      searchParams.append('sort', sortObj.field + ',' + sortObj.sort);
    }
    if (paginationObj != null) {
      searchParams.append('size', paginationObj.size);
      searchParams.append('page', paginationObj.number);
    }
    let options = new RequestOptions({
      headers: headers,
      search: searchParams
    });
    return this.http.post(this.baseUrl + '/search', filterObj, options).map((response: Response) => response.json());
  }

  addReferral(referral: Referral) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Authorization', this.tokenService.getToken());
    return this.http.post(this.baseUrl, referral, {headers: headers}).map((response: Response) => response.json());
  }

  deleteReferral(referralId: number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Authorization', this.tokenService.getToken());
    return this.http.delete(this.baseUrl + '/' + referralId, {headers: headers, body: ''});
  }
isAuthorize(profileId: number,action:string): Observable<Referral> {
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(this.baseUrl + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
       // return this.http.get(this.baseUrl + "/authorize/" + profileId + "/" + action ,{ headers: headers, body: "" }).map((response: Response) => {
            if(response.text() !=null && response.text()!=""){
                return response.json()
            }else{
                return {};
            }
        });
    }
}

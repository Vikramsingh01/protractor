import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { TokenService } from './token.service';
import { DataService } from './data.service';
import { Observable } from "rxjs";
import { ServiceUrlConstants, ServerUrl } from '../shared/service-url-constants';
import { APPCONSTANTS } from '../app.constants';
import { Utility } from '../shared/utility';

@Injectable()
export class AuthorizationService {

    private authorizedFeaturesUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AUTHORIZATION + "/authorized-features";
    private authorizedFeatureAccessUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AUTHORIZATION + "/authorized";
    private authorizedFeatureFieldsUrl: string = ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AUTHORIZATION + "/authorized-fields";

    constructor(private http: Http, private tokenService: TokenService, private dataService: DataService) { }


    getAuthorizedFeatures(userId) {
        const body = JSON.stringify({ "productId": APPCONSTANTS.productId, "userId": userId, "actionId": 200 });
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.authorizedFeaturesUrl, body, { headers: headers }).map((response) => response.json());
    }


    getFeatureAccessList(featureId, tableId) {
        const body = JSON.stringify({ "productId": APPCONSTANTS.productId, "featureId": featureId, "tableId": tableId });
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.authorizedFeatureAccessUrl, body, { headers: headers }).map((response) => response.json());
    }
    getAuthorizedFieldsByFeature(featureId, tableId) {
        const body = JSON.stringify({ "productId": 1, "featureId": featureId, "tableId": tableId });
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.post(this.authorizedFeatureFieldsUrl, body, { headers: headers }).map((response) => response.json());
    }

    validateToken(token: string) {
        let obj: any = {};
        obj.token = token;
        const body = JSON.stringify(obj);
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        return this.http.post(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AUTHENTICATION+"/token/validate", body, { headers: headers });
    }

    getAuthorizationData(featureId, tableId) {
        if (APPCONSTANTS.authorizationCache) {
            let features = this.dataService.getFeatures();
            let featureActions: any = this.dataService.getFeatureActions();
            if (Utility.getObjectFromArrayByKeyAndValue(features, 'featureId', featureId) == null ||
                Utility.getObjectFromArrayByKeyAndValue(featureActions, 'featureId', featureId) == null) {
                if (Utility.getObjectFromArrayByKeyAndValue(featureActions, 'featureId', featureId) == null) {
                    return Observable.forkJoin(
                        this.getFeatureAccessList(featureId, tableId).catch(error => { return Observable.of([])}),
                        this.getAuthorizedFieldsByFeature(featureId, tableId).catch(error => { return Observable.of([])})
                    );
                }
                return Observable.of([]);
            }
            else {

                return Observable.of([]);
            }
        }
        else {
            return Observable.forkJoin(
                this.getFeatureAccessList(featureId, tableId),
                this.getAuthorizedFieldsByFeature(featureId, tableId)
            )
        }

    }

    getAuthorizationDataByTableId(tableId) {
        return Observable.forkJoin(
            this.getFeatureAccessList(2, tableId),
            this.getAuthorizedFieldsByFeature(2, tableId)
        );
    }

    isTableAuthorized(tableId, action, authorizationData) {
        let authorized: boolean = false;
        let actionAuthorizationData = authorizationData[0];

        if (actionAuthorizationData[action] != null) {
            authorized = true;
        }
        return authorized;
    }

    isTableFieldAuthorized(tableId, field, action, authorizationData) {
        let authorized: boolean = false;
        let fieldAuthorizationData = authorizationData[1];

        if (fieldAuthorizationData[action] != null) {
            let authorizedFields = fieldAuthorizationData[action];
            if (authorizedFields.indexOf(field) >= 0) {
                authorized = true;
            }

        }
        return authorized;
    }

    isFeatureAuthorized(featureId) {
        let authorized: boolean = false;
        let features = this.dataService.getFeatures();
        if (Utility.getObjectFromArrayByKeyAndValue(features, 'featureId', featureId) != null) {
            authorized = true;
        }
        return authorized;
    }
    isFeatureActionAuthorized(featureId, action) {
        let authorized: boolean = false;
        let features = this.dataService.getFeatures();
        let featureActions: any = this.dataService.getFeatureActions();
        if (Utility.getObjectFromArrayByKeyAndValue(features, 'featureId', featureId) != null) {
            if (Utility.getObjectFromArrayByKeyAndValue(featureActions, 'featureId', featureId) != null) {
                let featureAction = Utility.getObjectFromArrayByKeyAndValue(featureActions, 'featureId', featureId);
                if(APPCONSTANTS.authorizationCache){
                    if(Utility.getObjectFromArrayByKeyAndValue(featureAction.featureActions, 'actionLabel', action)!=null){
                        authorized = true;
                    }
                }else{
                    if (featureAction.featureActions[action] != null) {
                    authorized = true;
                }
            }
            }
        }
        return authorized;
    }

    isFeildAuthorized(featureId, field, action) {
        if (field == null) return true;
        let authorized = false;
        let authorizedFieldsObjList = this.dataService.getFeatureFields();
        let authorizedFieldsObj = Utility.getObjectFromArrayByKeyAndValue(authorizedFieldsObjList, 'featureId', featureId);
        if (authorizedFieldsObj != null) {
            if (authorizedFieldsObj['featureFields'] != null) {
                let authorizedFields = [];
                authorizedFields = authorizedFieldsObj['featureFields'][action];
                if (authorizedFields != null && authorizedFields.indexOf(field) > -1) {
                    authorized = true;
                }
            }
        }
        return authorized;
    }

    isTableReadAuthorized(tableId) {
        return Observable.of(true);

    }
    /*getFeatures(){
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append("X-Authorization", this.tokenService.getToken());
      return this.http.get(this.featureUrl,{headers: headers, body:""}).map(response => response.json());
    }
    getFeatureActions(featureId){
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append("X-Authorization", this.tokenService.getToken());
      return this.http.get(this.featureActionsUrl,{headers: headers, body:""}).map(response => response.json());
    }*/
}

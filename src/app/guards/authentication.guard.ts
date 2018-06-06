import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { TokenService } from '../services/token.service';
import { DataService } from '../services/data.service';
import { AuthorizationService } from '../services/authorization.service';
import { HeaderService } from '../views/header/header.service';
import { Utility } from '../shared/utility';
import { APPCONSTANTS } from '../app.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild {

    features: any = [];
    featureActions: any = [];
    routeData;

    constructor(
        private router: Router, 
        private tokenService: TokenService,
        private dataService: DataService,
        private headerService: HeaderService,
        private authorizationService: AuthorizationService
        ) {
        
     }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        this.features = this.dataService.getFeatures();
        this.featureActions = this.dataService.getFeatureActions();
        this.routeData = route.data;
        if(this.dataService.getFeatureByFeatureId(this.routeData.featureId)!= undefined){
            if(Utility.filterArrayByKeyAndValue(this.dataService.getFeatureActions(), 'featureId', this.routeData.featureId).length<1){
                // this.authorizationService.getFeatureAccessList(this.routeData.featureId).subscribe((response)=>{
                //     this.dataService.addFeatureActions(this.routeData.featureId, response);
                // });
                this.authorizationService.getAuthorizedFieldsByFeature(this.routeData.featureId, this.routeData.tableId).subscribe(response=>{
                    this.dataService.addFeatureFields(this.routeData.featureId, response);
                });
            }
            else{
                if (this.tokenService.getToken() == "" || !this.isFeatureAuthorized(this.routeData.featureId)) {
                    this.headerService.setErrorPopup({message:"You need to login to access this page."})
                    return false;
                }
                else {
                    return true;
                }
            }
            
        }
        
    }

     canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
         this.features = this.dataService.getFeatures();
         this.featureActions = this.dataService.getFeatureActions();
         this.routeData = route.data;
         //console.log(this.routeData);
         let authorized = this.isFeatureActionAuthorized(this.routeData.featureId, this.routeData.action);
         if(!authorized){
             this.headerService.setErrorPopup({message:"You need to login to access this page. Redirecting to login page..."});
         }
         return authorized;
     }
    isFeatureAuthorized(featureId) {
        let authorized: boolean = false;
        if(Utility.getObjectFromArrayByKeyAndValue(this.features, 'featureId', featureId) != null){
            authorized = true;
        }
        return authorized;
    }
    isFeatureActionAuthorized(featureId, action) {
        let authorized: boolean = false;
        if(Utility.getObjectFromArrayByKeyAndValue(this.features, 'featureId', featureId) != null){
            if(Utility.getObjectFromArrayByKeyAndValue(this.featureActions, 'featureId', featureId) != null){
                let featureAction = Utility.getObjectFromArrayByKeyAndValue(this.featureActions, 'featureId', featureId);
                if(featureAction.featureActions[action] != null){
                    authorized = true;
                }
            }
        }
        //console.log("Authorize status: "+authorized);
        return authorized;
    }
}
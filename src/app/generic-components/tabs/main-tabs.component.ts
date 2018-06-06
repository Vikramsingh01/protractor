import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { AppService } from "../../app.service";
import { TabsData } from "../../generic-components/tabs/tabs.constants";
import { Utility } from "../../shared/utility";
import { EventService } from "../../features/event/event.service";

@Component({
  selector: 'tr-main-tabs',
  template: `
 <div class="sub-menu">
		<ul>
    <li><button id="profiletab" class="btn btn-default btn-purple" [routerLink]="[mainLink, profileId, 'profile']" [ngClass]="{'active': offenderRoute}">Profile</button></li>
    <li><button id="eventtab" class="btn btn-default btn-purple" [routerLink]="[mainLink, profileId, 'event']" [ngClass]="{'active': eventRoute}">Events</button></li>
    <li><button id="suactivitiestab" class="btn btn-default btn-purple" [routerLink]="[mainLink, profileId, 'plan']" [ngClass]="{'active': planRoute}">SU Activities</button></li>
    </ul>
  </div>
  `,
 
})
export class MainTabsComponent implements OnInit {
 
  constructor(private route: ActivatedRoute, private router: Router) { }
  private eventId: number;
  private offenderRoute: Boolean = false;
  private eventRoute: Boolean = false;
  private planRoute: Boolean = false;
  private profileId: number;
  private mainLink: String = '';
  ngOnInit() {
    if(this.router.url.split("/").length >= 1){
          this.mainLink = "/"+this.router.url.split("/")[1];
        }
    this.router.events.subscribe((event: any): void => {
      if (event instanceof NavigationStart) {
        let url = event.url;
        
        if(url.split("/").length >= 1){
          this.mainLink = "/"+url.split("/")[1];
        }
      }
      
      if (event instanceof NavigationEnd) {
        let url = event.url;
        
        if(url.search("/my-service-user/([0-9]*)/event")>=0 || url.search("/team-service-user/([0-9]*)/event")>=0 || url.search("/crc-service-user/([0-9]*)/event")>=0){
          this.eventRoute = true;
        }
        if(url.search("/my-service-user/([0-9]*)/plan")>=0 || url.search("/team-service-user/([0-9]*)/plan")>=0 || url.search("/crc-service-user/([0-9]*)/plan")>=0){
          this.planRoute = true;
        }
        if(!this.eventRoute && !this.planRoute && (url.search("/my-service-user/([0-9]*)")>=0 || url.search("/team-service-user/([0-9]*)")>=0 || url.search("/crc-service-user/([0-9]*)")>=0)){
            this.offenderRoute = true;
          }
        
      }
    })
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.profileId = params['profileId'];
    })
  }
  isCurrentRoute(tabUrl): Boolean{
    
    return true;
    }
 
}

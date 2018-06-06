import { DataService } from './../../services/data.service';
import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { AppService } from "../../app.service";
import { TabsData } from "../../generic-components/tabs/tabs.constants";
import { Utility } from "../../shared/utility";
import { EventService } from "../../features/event/event.service";

@Component({
  selector: 'tr-tabs',
  template: `
   <div class="sub-menu">
		<ul>
			<li *ngFor='let tab of tabs; let i = index'><button id="{{i+tab?.link}}" class="btn btn-default btn-purple" disabled="{{tab?.disabled}}" [routerLink]="parentLink+'/'+tab?.link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">{{tab?.label}}</button></li>
    </ul>
  </div>`,
  //changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EventService]
})
export class TabsComponent implements OnInit {

  @Input("structure") structure;
  private parentLink: string;
  private eventId: number;
  private profileId: number;
  private tabs: any[] = [];
  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService,
  private dataService: DataService) { }

   ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      let structureObj = Utility.getObjectFromArrayByKeyAndValue(TabsData, "structure", this.structure);
      this.router.events.subscribe((event: any): void => {
        if (event instanceof NavigationEnd) {
          if (event.url.search("-service-user") >= 0) {
            let serviceUserRouteUrl = event.url.substring(0, event.url.search("-service-user"));

            this.parentLink = structureObj.parentLinkRegex.replace("$$SU_TYPE$$", serviceUserRouteUrl + "-service-user");;
            Object.keys(params).forEach(param => {
              this.parentLink = this.parentLink.replace(":" + param, params[param]);
            });
            if (this.eventId != undefined) {
              let eventObj: any = this.dataService.getEventData(this.eventId);
              if(eventObj != null && eventObj['eventId'] != null && eventObj['value']){
                this.tabs = structureObj.tabs.filter(tab => tab.label != 'Through The Gate' && tab.label != 'Search DSS');
              }else{
                this.tabs = structureObj.tabs;
              }
            } else {
              this.tabs = structureObj.tabs;
            }
          }
          else{
            this.parentLink = structureObj.parentLinkRegex;
            Object.keys(params).forEach(param => {
              this.parentLink = this.parentLink.replace(":" + param, params[param]);
            });
            if (this.eventId != undefined) {
              this.eventService.getCodeForEventType(this.eventId).subscribe((data: any) => {
                if (data._body == '' || data._body.length <= 0) {
                  this.tabs = structureObj.tabs.filter(tab => tab.label != 'Through The Gate');
                } else {
                  this.tabs = structureObj.tabs;
                }
              });
            } else {
              this.tabs = structureObj.tabs;
            }


          }
        }
      });

    })

  }

}

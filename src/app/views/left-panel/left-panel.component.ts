import { Component, OnInit, trigger, state, style, transition, animate, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Utility } from "../../shared/utility";
@Component({
  selector: 'tr-left-panel',
  templateUrl: './left-panel.component.html',
  
})
export class LeftPanelComponent implements OnInit {

  isLoggedIn: boolean = false;
  features = [];
  @Input("isServiceUser") isServiceUser: boolean =  false;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.features = this.dataService.getFeatures();
    
  }
  isFeatureAuthorized(featureId){
    this.features = this.dataService.getFeatures();
    let authorized: boolean = false;
    this.features.forEach(feature=>{
      if(!authorized){
        if(feature.featureId == featureId){
          if((Utility.getObjectFromArrayByKeyAndValue(feature.featureActions, 'actionLabel', 'Read') != null)
          || (Utility.getObjectFromArrayByKeyAndValue(feature.featureActions, 'actionLabel', 'Search') != null))
          {
            authorized = true;
          }
        }
      }
    });
    return authorized;
  }


}

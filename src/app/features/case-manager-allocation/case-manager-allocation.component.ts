import { Component, OnInit, Input } from '@angular/core';
import { ListService } from '../../services/list.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { CaseManagerAllocationService } from "./case-manager-allocation.service";
import { CaseManagerAllocation } from "./case-manager-allocation";
import { OffenderProfileService } from "../offenderprofile/offenderprofile.service";
import { OffenderProfile } from "../offenderprofile/offenderprofile";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Http } from '@angular/http';

@Component({
  selector: 'tr-case-manager-team',
  templateUrl: './case-manager-allocation.component.html',
  providers: [CaseManagerAllocationService, OffenderProfileService]
})
export class CaseManagerAllocationComponent implements OnInit {
  private subscription: Subscription;
  private listObjLabel;
  private showOMTR = true;
  private transferRequestId: number;
  butDisabled: boolean = true;
  private cmsIds: CaseManagerAllocation = new CaseManagerAllocation();
  private offProfile: OffenderProfile = new OffenderProfile();
  @Input("tableId") tableId;
  @Input("pkValue") pkValue;


  cmaform: FormGroup;
  teams: any = [];
  users: any = [];
  orgs: any = [];
  reason:any=[];

  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private listService: ListService, private caseManagerAllocationService: CaseManagerAllocationService, private offenderProfileService: OffenderProfileService) {

  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.cmsIds.profileId = params['profileId'];
      this.cmsIds.transferReponseId = params['transferResponseId'];
    });

    this.cmaform = this._fb.group({
      flag: ['true'],
      team: [''],
      user: [''],
      reason:['']

    })
    this.listService.getListDataByLookupAndPkValue(263, 3, this.cmsIds.profileId).subscribe(listObj => {
      this.orgs = listObj;
      if (this.orgs.length > 0) {
        this.listService.getListDataByLookupAndPkValue(445, 2, this.orgs[0].key).subscribe(listObj => {
          this.teams = listObj;
        })
      }
    })



  }
  change(option) {

    if (option.selectedIndex > 0) {
      let selectedTeamId = this.teams[option.selectedIndex - 1].key;
      this.listService.getListDataByLookupAndPkValue(270, 402, selectedTeamId).subscribe(listObj => {

        this.users = listObj;
        if (this.users.length == 0) {
          this.cmaform.value.user = -1;
        }
      })
    }

  }
  submit() {
     
     

  }

  updateCaseManager() {
    this.subscription = this.route.params.subscribe((params: any) => {
            this.transferRequestId = params['transferRequestId'];
    });
          

    this.cmsIds.officeTeamId = this.cmaform.value.team;
    this.cmsIds.userId = this.cmaform.value.user;
    console.log("this.cmsIds.officeTeamId: " + this.cmsIds.officeTeamId + " this.cmsIds.userId " + this.cmsIds.userId);
    
  }
}
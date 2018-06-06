import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { PssContactService } from "./psscontact.service";
import { PssContact } from "./psscontact";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { PssContactConstants } from './psscontact.constants';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { SortFilterPagination } from '../../generic-components/pagination/pagination';

@Component({
  selector: 'tr-psscontact',
  templateUrl: 'psscontact.component.html',
  
  providers: [PssContactService]

})
export class PssContactComponent implements OnInit {

  @Input() pssContactId: number;

  pssContacts: PssContact[];
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor(private router: Router,
		private route: ActivatedRoute,
    private pssContactService: PssContactService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard) {
  }

  ngOnInit() {
	let pssContact: PssContact = new PssContact();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('eventId')) {
				pssContact.eventId = params['eventId'];
			}
		});
	this.authorizationService.getAuthorizationData(PssContactConstants.featureId,PssContactConstants.tableId).map(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(PssContactConstants.featureId, res[0]);
		this.dataService.addFeatureFields(PssContactConstants.featureId, res[1]);
	}
	}).flatMap(data=>
	this.pssContactService.sortFilterAndPaginate(pssContact, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj)).subscribe((data: any) => {
      this.pssContacts = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = pssContact;
    });
  }

    sort(sortObj){
    this.sortFilterPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, this.sortFilterPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, paginationObj, this.sortFilterPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){
    //sortObj.field = "firstName";
    this.pssContactService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.pssContacts = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  delete(pssContactId: number) {
	let pssContact: PssContact = new PssContact();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('eventId')) {
				pssContact.eventId = params['eventId'];
			}
		});

    if (confirm("Are you sure you want to delete?")) {
      this.pssContactService.delete(pssContactId).subscribe((data: any) => {
        this.pssContactService.searchPssContact(pssContact).subscribe((data: any) => {
          this.pssContacts = data.content;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(PssContactConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(PssContactConstants.featureId, field, "Read");
  }
}

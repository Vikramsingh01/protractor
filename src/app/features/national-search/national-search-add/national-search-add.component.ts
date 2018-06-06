import { Component, OnInit,EventEmitter,Output} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { NationalSearchService } from '../national-search.service';
import { NationalSearchConstants } from '../national-search.constants';
import { NationalSearch } from '../national-search';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';

@Component({
    selector: 'tr-national-search-edit',
    templateUrl: 'national-search-add.component.html'
})
export class NationalSearchAddComponent implements OnInit {
    
    private subscription: Subscription;
    private nationalSearchId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    nationalSearchAddForm: FormGroup;
    private nationalSearch: NationalSearch = new NationalSearch();
    private action;
    isSearch:boolean=true;
   
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private nationalSearchService: NationalSearchService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('nationalSearchId')) {
                this.action = "Create";
                this.titleService.setTitle("National Search");
            }else{
                this.action = "Update";
                this.titleService.setTitle("Edit National Search");
            }
        });
       this.authorizedFlag =this.authorizationService.isFeatureActionAuthorized(NationalSearchConstants.featureId, this.action)
       if(this.authorizedFlag){
                    this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('nationalSearchId')) {
                        this.nationalSearchId = params['nationalSearchId'];
                        this.nationalSearchService.getNationalSearch(this.nationalSearchId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.nationalSearchAddForm.patchValue(data);
                            }
                            else{
                                this.headerService.setAlertPopup("The record is locked");
                                
                            }
                        });
                    }
                })
            
      
       }
    }
 
    onSubmit() {
        if (this.nationalSearchAddForm.valid) {
                
                this.nationalSearchService.addNationalSearch(this.nationalSearchAddForm.value).subscribe((response: any) => {
                   //console.log(response);
                   this.isSearch=false;
                   localStorage.setItem("natSearchRequestObj", JSON.stringify(response));
                   this.nationalSearchService.setResponseList(null);
                });
            
        }
        
    }

    onRefreshData(){
        //get the filter from local storage
        let natSearchRequest = JSON.parse(localStorage.getItem("natSearchRequestObj"));
        if(natSearchRequest && natSearchRequest.hasOwnProperty("crcSearchId")){
            let filterObj={"crcSearchId": natSearchRequest.crcSearchId};
            let paginationObj={};
            let sortObj={};
            this.nationalSearchService.sortFilterAndPaginateHeader(filterObj, paginationObj, sortObj).subscribe((data: any) => {
                if(data.content && data.content.length>0){
                   this.isSearch=true;
                   localStorage.removeItem("natSearchRequestObj");
                   this.nationalSearchService.setResponseList(data.content);
                }
              });
             
        }
        
        
        return false;
    }
    
    onReset(){
        //delete from localstorage
        //clear all data.
        this.nationalSearchAddForm.reset();
        localStorage.removeItem("natSearchRequestObj");
        this.nationalSearchService.setResponseList([]);
        this.isSearch=true;
        return false;
    }
    
    isFeildAuthorized(field) {
       
        return this.authorizationService.isFeildAuthorized(NationalSearchConstants.featureId, field, this.action);
    }

    initForm() {
        let natSearchObj=localStorage.getItem("natSearchRequestObj")
        if(natSearchObj!==null){
            natSearchObj=JSON.parse(natSearchObj);
            this.isSearch=false;
        }
       
        this.nationalSearchAddForm = this._fb.group({
                        crcSearchId:[ this.nationalSearch.crcSearchId],
                        surname:[ this.nationalSearch.surname ,  Validators.compose([ Validators.maxLength(35) , Validators.required]) ],
                        forename:[ this.nationalSearch.forename ,  Validators.compose([  Validators.maxLength(35) ,Validators.required ]) ],
                        middleName:[ this.nationalSearch.middleName ,  Validators.compose([  Validators.maxLength(35) , ]) ],
                        dateOfBirth:[ this.nationalSearch.dateOfBirth ,  Validators.compose([ ValidationService.dateValidator , , ]) ],
                        genderId:[ this.nationalSearch.genderId ],
                        caseReferenceNumber:[ this.nationalSearch.caseReferenceNumber ,  Validators.compose([   Validators.maxLength(7) , ]) ],
                        pncNumber:[ this.nationalSearch.pncNumber ,  Validators.compose([ Validators.maxLength(35) , ]) ],
                        croNumber:[ this.nationalSearch.croNumber ,  Validators.compose([  Validators.maxLength(4000) , ]) ],
                        nomisNumber:[ this.nationalSearch.nomisNumber ,  Validators.compose([  Validators.maxLength(20) , ]) ],
                        niNumber:[ this.nationalSearch.niNumber  ]
                   
                    });
    }
}


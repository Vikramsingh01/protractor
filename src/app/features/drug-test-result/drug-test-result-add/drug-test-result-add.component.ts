import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { DrugTestResultService } from '../drug-test-result.service';
import { DrugTestResultConstants } from '../drug-test-result.constants';
import { DrugTestResult } from '../drug-test-result';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { DrugTestService } from "../../drug-test/drug-test.service";
import { Utility } from '../../../shared/utility';
@Component({
    selector: 'tr-drug-test-result-edit',
    templateUrl: 'drug-test-result-add.component.html'
})
export class DrugTestResultAddComponent implements OnInit {

    private subscription: Subscription;
    private drugTestResultId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    drugTestResultAddForm: FormGroup;
    private drugTestResult: DrugTestResult = new DrugTestResult();
    private action;
    private drugTestId;
    private showStructure: boolean = false;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private drugTestResultService: DrugTestResultService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title,
        private drugTestService: DrugTestService
        ) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('drugTestResultId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Drug Test Result");
            }else{
                this.action = "Update";
                this.titleService.setTitle("Edit Drug Test Result");
            }
           
            

        });
       
        //this.authorizationService.getAuthorizationDataByTableId(DrugTestResultConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(DrugTestResultConstants.featureId, DrugTestResultConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(DrugTestResultConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(DrugTestResultConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(DrugTestResultConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(DrugTestResultConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                
                this.subscription = this.route.params.subscribe((params: any) => {
                    if(params.hasOwnProperty('drugTestId')){
                        this.drugTestId = params['drugTestId'];
                        const control = <FormArray>this.drugTestResultAddForm.controls['drugTestResultList'];
                        this.drugTestResultService.getDrugTestResultIds(params['drugTestId']).subscribe(drugTestResultMappingList=>{
                            drugTestResultMappingList.forEach(drugTestResultId=>{
                                control.push(this._fb.group({
                                    drugsTestId: [params['drugTestId']],
                                    drugTypeId: [drugTestResultId, Validators.compose([Validators.required])], 
                                    admittedUseYesNoId: [2, Validators.compose([Validators.required])], 
                                    testResultId: [1, Validators.compose([Validators.required])],
                                    agreedYesNoId: [2, Validators.compose([Validators.required])],
                                    spgDrugTestResultId:['0'],

                                }));
                            })
                        })
                    }
                    if (params.hasOwnProperty('drugTestResultId')) {
                        this.drugTestResultId = params['drugTestResultId'];
                        this.drugTestResultService.getDrugTestResult(this.drugTestResultId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.drugTestResultAddForm.patchValue(data);
                            }
                            else{
                                this.headerService.setAlertPopup("The record is locked");
                                
                            }
                        });
                    }
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });

        this.drugTestService.getDrugTest(this.drugTestId).subscribe(drugTest=>{
            let dateOfTest = Utility.convertStringToDate(drugTest.dateOfTest);
            let todayDate = new Date();
            todayDate.setHours(0);
            todayDate.setMinutes(0);
            todayDate.setSeconds(0);
            if(dateOfTest.getTime()>todayDate.getTime()){
                this.showStructure = false;
            }else{
                this.showStructure = true;
            }
        })

    }
    navigateTo(url) {
        if (this.drugTestResultAddForm.touched) {
            this.confirmService.confirm(
                {
                    message: 'Do you want to leave this page without saving?',
                    header: 'Confirm',
                    accept: () => {
                        this.router.navigate(url, {relativeTo: this.route});
                    }
                });
        }else{
            this.router.navigate(url, {relativeTo: this.route});
            return false;
        }
    }
    onSubmit() {
        if (this.drugTestResultAddForm.valid) {
			this.drugTestResultAddForm.patchValue(Utility.escapeHtmlTags(this.drugTestResultAddForm.value));
            if (this.drugTestResultId != null) {
                this.drugTestResultService.updateDrugTestResult(this.drugTestResultId, this.drugTestResultAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.drugTestResultService.addDrugTestResultList(this.drugTestResultAddForm.value.drugTestResultList).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(DrugTestResultConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(DrugTestResultConstants.featureId, field, this.action);
    }
    initForm() {
        this.drugTestResultAddForm = this._fb.group({
                        drugTestResultId:[ this.drugTestResult.drugTestResultId],
                        //drugsTestId:[ this.drugTestResult.drugsTestId ,  Validators.compose([ Validators.required , , , ]) ],
                        //drugsTestId:[ 82 ,  Validators.compose([ Validators.required , , , ]) ],
                        // drugTypeId:[ this.drugTestResult.drugTypeId ],
                        // admittedUseYesNoId:[ this.drugTestResult.admittedUseYesNoId ,  Validators.compose([ Validators.required , ,  Validators.maxLength(1) , ]) ],
                        // spgVersion:[ this.drugTestResult.spgVersion],
                        // spgUpdateUser:[ this.drugTestResult.spgUpdateUser],
                        
                        // createdBy:[ this.drugTestResult.createdBy , ],
                        // createdByUserId:[ this.drugTestResult.createdByUserId , ],
                        // createdDate:[ this.drugTestResult.createdDate , ],
                        // modifiedBy:[ this.drugTestResult.modifiedBy , ],
                        // modifiedByUserId:[ this.drugTestResult.modifiedByUserId , ],
                        // modifiedDate:[ this.drugTestResult.modifiedDate , ],
                        // deleted:[ this.drugTestResult.deleted , ],
                        // deletedBy:[ this.drugTestResult.deletedBy , ],
                        // deletedByUserId:[ this.drugTestResult.deletedByUserId , ],
                        // deletedDate:[ this.drugTestResult.deletedDate , ],
                        // locked:[ this.drugTestResult.locked , ],
                        // version:[ this.drugTestResult.version , ],
                        //testResultId:[ this.drugTestResult.testResultId ,  Validators.compose([, ,  Validators.maxLength(10) , ]) ],
                        // agreedYesNoId:[ this.drugTestResult.agreedYesNoId ,  Validators.compose([Validators.required, ,  Validators.maxLength(1) , ]) ],
                        drugTestResultList: this._fb.array([])
                 });
    }
}


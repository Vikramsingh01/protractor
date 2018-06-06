import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder ,Validators} from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { InductionLetter } from '../inductionletter';
import { InductionLetterService } from '../inductionletter.service';
import { TokenService } from '../../../services/token.service';
import { Utility } from '../../../shared/utility';
//import {CaseManagerAllocationService} from "./case-manager-allocation.service";

@Component({
  selector: 'tr-inductionletter-edit',
  templateUrl: 'inductionletter-edit.component.html',
  providers: [InductionLetterService]
})
export class InductionLetterEditComponent implements OnInit {

  private subscription: Subscription;
  inductionLetter: InductionLetter = new InductionLetter();
  private cmsIds: InductionLetter = new InductionLetter();
 
 inductionLetterForm: FormGroup;

  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private inductionLetterService: InductionLetterService ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
    this.inductionLetter.profileId= params['profileId'];
     });

    this.initForm();

    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
       
        this.inductionLetterService.getInductionLetter(this.cmsIds.profileId).subscribe((data: InductionLetter) => {
          this.inductionLetter = data;
          this.inductionLetterForm.patchValue(this.inductionLetter);
        });
      }
    })
  }

  onSubmit() {
    if (this.inductionLetterForm.valid) {
		this.inductionLetterForm.patchValue(Utility.escapeHtmlTags(this.inductionLetterForm.value));
      
      this.subscription = this.route.params.subscribe((params: any) => {
        if (params.hasOwnProperty('id')) {
         } else {
           
          this.inductionLetterService.addInductionLetter(this.inductionLetterForm.value).subscribe((response: any) => {
          this.router.navigate(['/pending-transfer']);
          });
         
        }
      });
     
    }
    else {
      alert("Invalid Form");
    }
  }

  isFeildAuthorized(field) {
    //  return this.inductionLetterService.isFeildAuthorized(field, 'Create');
    return true;
  }


  
  initForm() {
    this.inductionLetterForm = this._fb.group({
      profileId: [this.inductionLetter.profileId],
      dateOfAppointment: [this.inductionLetter.dateOfAppointment,Validators.required],
      timeOfAppointment: [this.inductionLetter.timeOfAppointment,Validators.apply("^[0-2][0-3]:[0-5][0-9]$")],
      location: [this.inductionLetter.location],
      notes: [this.inductionLetter.notes],
    });
  }
}

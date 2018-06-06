import { Routes } from '@angular/router';

import { AddressAssessmentListComponent } from './address-assessment-list/address-assessment-list.component';
import { AddressAssessmentDetailComponent } from './address-assessment-detail/address-assessment-detail.component';
import { AddressAssessmentAddComponent } from './address-assessment-add/address-assessment-add.component';

export const AddressAssessment_ROUTES: Routes = [
   { path: "", component: AddressAssessmentListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: AddressAssessmentAddComponent, data:{action:'Create'}},
   { path: ":addressAssessmentId", component: AddressAssessmentDetailComponent, data:{action:'Read'}},
   { path: "edit/:addressAssessmentId", component: AddressAssessmentAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

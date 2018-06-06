import { Routes } from '@angular/router';

import { PlanAppontmentListComponent } from './plan-appointment/plan-appointment-list.component'
import { CmActionsComponent } from "./cm-actions.component"
import { ReferToCasemanagerListComponent } from './refer-to-casemanager/refer-to-casemanager-list'
import { PlanAppointmentDetailComponent } from './plan-appointment-detail/plan-appointment-detail.component'
import { PlanAppointmentEditComponent } from './plan-appointment-edit/plan-appointment-edit.component'
import { AlertListComponent } from './alert/alert-list.component'

import { RegisterReviewListComponent } from './register-reviews/register-reviews-list/register-reviews-list.component'
import { RegisterReviewsDetailComponent } from './register-reviews/register-reviews-detail/register-reviews-detail.component'
import { RegisterReviewsEditComponent } from './register-reviews/register-reviews-edit/register-reviews-edit.component'

import { RecentAllocationsListComponent } from './recent-allocations/recent-allocations-list/recent-allocations-list.component'

export const Cm_Action_ROUTES: Routes = [

   { path: "", component: PlanAppontmentListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "refer-to-casemanager", component:ReferToCasemanagerListComponent , pathMatch: 'full', data:{action:'Read'}},
   { path: ":profileId/edit/:appointmentId", component:PlanAppointmentEditComponent , pathMatch: 'full', data:{action:'Read'}},
   { path: ":profileId/:appointmentId", component:PlanAppointmentDetailComponent , pathMatch: 'full', data:{action:'Read'}},
   { path: "refer-to-casemanager/:profileId/edit/:appointmentId", component:PlanAppointmentEditComponent , pathMatch: 'full', data:{action:'Read'}},
   { path: "refer-to-casemanager/:profileId/:appointmentId", component:PlanAppointmentDetailComponent , pathMatch: 'full', data:{action:'Read'}},
   { path: "cm-actions", component: CmActionsComponent, pathMatch: 'full', data:{action:'Read'}},
   
  

   { path: "alert", component:AlertListComponent , pathMatch: 'full', data:{action:'Read'}},
   { path: "alert/:profileId/edit/:appointmentId", component:PlanAppointmentEditComponent , pathMatch: 'full', data:{action:'Read'}},
   { path: "alert/:profileId/:appointmentId", component:PlanAppointmentDetailComponent , pathMatch: 'full', data:{action:'Read'}},

   { path: "register-review", component: RegisterReviewListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "register-review/:profileId/:registrationId", component: RegisterReviewsDetailComponent, data:{action:'Read'}}, 
   { path: "register-review/:profileId/edit/:registrationReviewId/:registrationId", component: RegisterReviewsEditComponent, pathMatch: 'full', data:{action:'Update'}},

   { path: "recent-allocations", component: RecentAllocationsListComponent, pathMatch: 'full', data:{action:'Read'}}
  
   
];

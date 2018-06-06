import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ContactService } from '../contact/contact.service';
import { RegisterReviewService } from './register-reviews/register-reviews.service';
import { RegisterRegistrationReviewService } from './register-reviews/register-registration-review.service';


import { PlanAppontmentListComponent } from './plan-appointment/plan-appointment-list.component'
import { ReferToCasemanagerListComponent } from './refer-to-casemanager/refer-to-casemanager-list'
import { PlanAppointmentDetailComponent } from './plan-appointment-detail/plan-appointment-detail.component'
import { PlanAppointmentEditComponent } from './plan-appointment-edit/plan-appointment-edit.component'

import { RegisterReviewListComponent } from './register-reviews/register-reviews-list/register-reviews-list.component'
import { RegisterReviewsDetailComponent } from './register-reviews/register-reviews-detail/register-reviews-detail.component'
import { RegisterReviewsEditComponent } from './register-reviews/register-reviews-edit/register-reviews-edit.component'

import { AlertListComponent } from './alert/alert-list.component'

import { RecentAllocationsListComponent } from './recent-allocations/recent-allocations-list/recent-allocations-list.component'
import { RecentAllocationsService } from './recent-allocations/recent-allocations.service'

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [PlanAppontmentListComponent, ReferToCasemanagerListComponent, PlanAppointmentDetailComponent, PlanAppointmentEditComponent, AlertListComponent, RegisterReviewListComponent, RegisterReviewsDetailComponent, RegisterReviewsEditComponent,RecentAllocationsListComponent],
  providers: [ContactService, RegisterReviewService, RegisterRegistrationReviewService,RecentAllocationsService],
  exports: [PlanAppontmentListComponent, ReferToCasemanagerListComponent, PlanAppointmentDetailComponent, PlanAppointmentEditComponent, SharedModule, AlertListComponent, RegisterReviewListComponent, RegisterReviewsDetailComponent, RegisterReviewsEditComponent,RecentAllocationsListComponent]

})
export class CmActionModule {}
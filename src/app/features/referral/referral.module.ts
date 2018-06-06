import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReferralAddComponent } from './referral-add/referral-add.component';
import { ReferralDetailComponent } from './referral-detail/referral-detail.component';
import { ReferralListComponent } from './referral-list/referral-list.component';
import { ReferralService } from './referral.service';
import { AssessmentModule } from '../assessment/assessment.module';
import { DrugTestProfileModule } from '../drug-test-profile/drug-test-profile.module';
import { DrugTestModule } from '..//drug-test/drug-test.module';

@NgModule({
  imports: [CommonModule, SharedModule, AssessmentModule, DrugTestProfileModule,DrugTestModule],
  declarations: [ReferralAddComponent, ReferralDetailComponent, ReferralListComponent],
  providers: [ReferralService],
  exports: [ReferralAddComponent, ReferralDetailComponent, ReferralListComponent, SharedModule, AssessmentModule, DrugTestProfileModule,DrugTestModule]
})
export class ReferralModule {}
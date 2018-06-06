import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RegistrationReviewAddComponent } from './registration-review-add/registration-review-add.component';
import { RegistrationReviewDetailComponent } from './registration-review-detail/registration-review-detail.component';
import { RegistrationReviewListComponent } from './registration-review-list/registration-review-list.component';
import { RegistrationReviewService } from './registration-review.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [RegistrationReviewAddComponent, RegistrationReviewDetailComponent, RegistrationReviewListComponent],
  providers: [RegistrationReviewService],
  exports: [RegistrationReviewAddComponent, RegistrationReviewDetailComponent, RegistrationReviewListComponent, SharedModule]
})
export class RegistrationReviewModule {}
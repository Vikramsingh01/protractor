import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RegistrationAddComponent } from './registration-add/registration-add.component';
import { RegistrationDetailComponent } from './registration-detail/registration-detail.component';
import { RegistrationListComponent } from './registration-list/registration-list.component';
import { RegistrationService } from './registration.service';
import { RegistrationReviewModule } from '../registration-review/registration-review.module';
import { PendingTransferRegistrationListComponent } from './registration-detail-pending-transfer/registration-detail-pending-transfer.component';
import { DeregistrationModule } from '../deregistration/deregistration.module';
import { RegistrationEditComponent } from './registration-edit/registration-edit.component';
@NgModule({
  imports: [CommonModule, SharedModule, RegistrationReviewModule, DeregistrationModule],
  declarations: [RegistrationAddComponent, RegistrationDetailComponent, RegistrationListComponent,PendingTransferRegistrationListComponent, RegistrationEditComponent],
  providers: [RegistrationService],
  exports: [RegistrationAddComponent, RegistrationEditComponent,  RegistrationDetailComponent, RegistrationListComponent, SharedModule,PendingTransferRegistrationListComponent]
})
export class RegistrationModule {}
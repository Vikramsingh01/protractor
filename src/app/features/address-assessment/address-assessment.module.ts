import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AddressAssessmentAddComponent } from './address-assessment-add/address-assessment-add.component';
import { AddressAssessmentDetailComponent } from './address-assessment-detail/address-assessment-detail.component';
//import { AddressAssessmentListComponent } from './address-assessment-list/address-assessment-list.component';
import { AddressAssessmentService } from './address-assessment.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [AddressAssessmentAddComponent, AddressAssessmentDetailComponent],
  providers: [AddressAssessmentService],
  exports: [AddressAssessmentAddComponent, AddressAssessmentDetailComponent, SharedModule]
})
export class AddressAssessmentModule {}
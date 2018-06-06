import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AssessmentAddComponent } from './assessment-add/assessment-add.component';
import { AssessmentDetailComponent } from './assessment-detail/assessment-detail.component';
import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { AssessmentService } from './assessment.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [AssessmentAddComponent, AssessmentDetailComponent, AssessmentListComponent],
  providers: [AssessmentService],
  exports: [AssessmentAddComponent, AssessmentDetailComponent, AssessmentListComponent, SharedModule]
})
export class AssessmentModule {}
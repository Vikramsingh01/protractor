import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { OffenderAdditionalSentenceAddComponent } from './offender-additional-sentence-add/offender-additional-sentence-add.component';
import { OffenderAdditionalSentenceDetailComponent } from './offender-additional-sentence-detail/offender-additional-sentence-detail.component';
import { OffenderAdditionalSentenceListComponent } from './offender-additional-sentence-list/offender-additional-sentence-list.component';
import { OffenderAdditionalSentenceService } from './offender-additional-sentence.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [OffenderAdditionalSentenceAddComponent, OffenderAdditionalSentenceDetailComponent, OffenderAdditionalSentenceListComponent],
  providers: [OffenderAdditionalSentenceService],
  exports: [OffenderAdditionalSentenceAddComponent, OffenderAdditionalSentenceDetailComponent, OffenderAdditionalSentenceListComponent, SharedModule]
})
export class OffenderAdditionalSentenceModule {}
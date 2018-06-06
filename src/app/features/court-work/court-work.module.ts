import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CourtWorkAddComponent } from './court-work-add/court-work-add.component';
import { CourtWorkDetailComponent } from './court-work-detail/court-work-detail.component';
import { CourtWorkListComponent } from './court-work-list/court-work-list.component';
import { CourtWorkService } from './court-work.service';
import { EventService } from '../event/event.service';
import { GenerateLetterComponent } from './generate-letter/generate-letter.component';


@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [CourtWorkAddComponent, CourtWorkDetailComponent, CourtWorkListComponent, GenerateLetterComponent],
  providers: [CourtWorkService,EventService],
  exports: [CourtWorkAddComponent, CourtWorkDetailComponent, CourtWorkListComponent, GenerateLetterComponent ,SharedModule]
})
export class CourtWorkModule {}
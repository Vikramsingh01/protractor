import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AdminCourtWorkAddComponent } from './admin-court-work-add/admin-court-work-add.component';
import { AdminCourtWorkDetailComponent } from './admin-court-work-detail/admin-court-work-detail.component';
import { AdminCourtWorkListComponent } from './admin-court-work-list/admin-court-work-list.component';
import { AdminCourtWorkService } from './admin-court-work.service';
import { EventService } from '../event/event.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [AdminCourtWorkAddComponent,AdminCourtWorkDetailComponent, AdminCourtWorkListComponent],
  providers: [AdminCourtWorkService,EventService],
  exports: [AdminCourtWorkAddComponent, AdminCourtWorkDetailComponent, AdminCourtWorkListComponent, SharedModule]
})
export class AdminCourtWorkModule {}
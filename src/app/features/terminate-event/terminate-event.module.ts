import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TerminateEventAddComponent } from './terminate-event-add/terminate-event-add.component';
import { TerminateEventDetailComponent } from './terminate-event-detail/terminate-event-detail.component';
import { TerminateEventListComponent } from './terminate-event-list/terminate-event-list.component';
import { TerminateEventService } from './terminate-event.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [TerminateEventAddComponent, TerminateEventDetailComponent, TerminateEventListComponent],
  providers: [TerminateEventService],
  exports: [TerminateEventAddComponent, TerminateEventDetailComponent, TerminateEventListComponent, SharedModule]
})
export class TerminateEventModule {}
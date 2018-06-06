import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TerminationsListComponent } from './terminations-list/terminations-list.component';
import { TerminationsService } from './terminations.service';
import { EventService } from '../event/event.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ TerminationsListComponent],
  providers: [TerminationsService,EventService],
  exports: [ TerminationsListComponent, SharedModule]
})
export class TerminationsModule {}
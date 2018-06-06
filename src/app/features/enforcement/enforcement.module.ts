import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EnforcementListComponent } from './enforcement-list/enforcement-list.component';
import { EnforcementService } from './enforcement.service';
import { EventService } from '../event/event.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ EnforcementListComponent],
  providers: [EnforcementService,EventService],
  exports: [ EnforcementListComponent, SharedModule]
})
export class EnforcementModule {}
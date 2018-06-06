import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProjectAttendaceComponent } from './project-attendance.component';
import { ProjectSessionUpdateComponent } from './project-session-update/project-session-update.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ProjectAttendaceComponent, ProjectSessionUpdateComponent],
  providers: [],
  exports: [ProjectAttendaceComponent, ProjectSessionUpdateComponent]
})
export class ProjectAttendaceModule {}

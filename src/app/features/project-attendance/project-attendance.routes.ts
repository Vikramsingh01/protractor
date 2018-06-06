import { Routes } from '@angular/router';
import { ProjectAttendaceComponent } from '../project-attendance/project-attendance.component';
import { ProjectSessionUpdateComponent } from './project-session-update/project-session-update.component';
export const ProjectAttendace_ROUTES: Routes = [
    { path : ':upwAppointmentId', component: ProjectAttendaceComponent, pathMatch: 'full'},
    { path : 'bulk-update/:upwAppointmentId', component: ProjectSessionUpdateComponent, pathMatch: 'full'},
];

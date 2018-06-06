import { Routes } from '@angular/router';

import { UpwProjectListComponent } from './upw-project-list/upw-project-list.component';
import { UpwProjectDetailComponent } from './upw-project-detail/upw-project-detail.component';
import { UpwProjectAddComponent } from './upw-project-add/upw-project-add.component';
import { ProjectAttendace_ROUTES } from "../project-attendance/project-attendance.routes";

export const UpwProject_ROUTES: Routes = [
   { path: "", component: UpwProjectListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: UpwProjectAddComponent, data:{action:'Create'}},
   { path: ":upwProjectId", component: UpwProjectDetailComponent, data:{action:'Read'}},
   { path: "edit/:upwProjectId", component: UpwProjectAddComponent, pathMatch: 'full', data:{action:'Update'}},
   { path: "project-attendance", children: ProjectAttendace_ROUTES},
];

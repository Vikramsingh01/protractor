import { Routes } from '@angular/router';

import { AdminCourtWorkListComponent } from './admin-court-work-list/admin-court-work-list.component';
import { AdminCourtWorkDetailComponent } from './admin-court-work-detail/admin-court-work-detail.component';
import { AdminCourtWorkAddComponent } from './admin-court-work-add/admin-court-work-add.component';

export const AdminCourtWork_ROUTES: Routes = [
   { path: "", component: AdminCourtWorkListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: AdminCourtWorkAddComponent, data:{action:'Create'}},
   { path: ":profileId/:eventId/:adminCourtWorkId", component: AdminCourtWorkDetailComponent, data:{action:'Read'}},
   { path: ":profileId/:eventId/edit/:adminCourtWorkId", component: AdminCourtWorkAddComponent, pathMatch: 'full', data:{action:'Update'}}

];

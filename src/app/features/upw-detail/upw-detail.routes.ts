import { Routes } from '@angular/router';

import { UpwDetailListComponent } from './upw-detail-list/upw-detail-list.component';
import { UpwDetailDetailComponent } from './upw-detail-detail/upw-detail-detail.component';
import { UpwDetailAddComponent } from './upw-detail-add/upw-detail-add.component';
import { UpwAppointment_ROUTES } from "../upw-appointment/upw-appointment.routes";

export const UpwDetail_ROUTES: Routes = [
   { path: "", component: UpwDetailListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: UpwDetailAddComponent, data:{action:'Create'}},
   { path: ":upwDetailId/event/:upwEventId", pathMatch: 'full', component: UpwDetailDetailComponent, data:{action:'Read'}},
   { path: "edit/:upwDetailId", component: UpwDetailAddComponent, pathMatch: 'full', data:{action:'Update'}},
   { path : ":upwDetailId/event/:upwEventId/upw-appointment", children: UpwAppointment_ROUTES},
];

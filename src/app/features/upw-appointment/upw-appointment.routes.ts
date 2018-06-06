import { Routes } from '@angular/router';

import { UpwAppointmentListComponent } from './upw-appointment-list/upw-appointment-list.component';
import { UpwAppointmentDetailComponent } from './upw-appointment-detail/upw-appointment-detail.component';
import { UpwAppointmentAddComponent } from './upw-appointment-add/upw-appointment-add.component';
import { UpwAppointmentRecurringAddComponent } from './upw-appointment-recurring-add/upw-appointment-recurring-add.component';

export const UpwAppointment_ROUTES: Routes = [
   { path: "", component: UpwAppointmentListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "single", component: UpwAppointmentAddComponent, data:{action:'Create'}},
   { path: "recurring", component: UpwAppointmentRecurringAddComponent, data:{action:'Create'}},
   { path: ":upwAppointmentId", component: UpwAppointmentDetailComponent, data:{action:'Read'}},
   { path: "edit/:upwAppointmentId", component: UpwAppointmentAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

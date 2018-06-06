import { Routes } from '@angular/router';

import { RegistrationListComponent } from './registration-list/registration-list.component';
import { RegistrationDetailComponent } from './registration-detail/registration-detail.component';
import { RegistrationAddComponent } from './registration-add/registration-add.component';
import { RegistrationReview_ROUTES } from '../registration-review/registration-review.routes';
import { deregistration_ROUTES } from '../deregistration/deregistration.routes';
import { DeregistrationAddComponent } from '../deregistration/deregistration-add/deregistration-add.component';
import { RegistrationEditComponent } from './registration-edit/registration-edit.component';

export const Registration_ROUTES: Routes = [
   { path: "", component: RegistrationListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: RegistrationAddComponent, data:{action:'Create'}},
   { path: ":registrationId" , component: RegistrationDetailComponent, data:{action:'Read'}},
   { path: "edit/:registrationId", component: RegistrationEditComponent, pathMatch: 'full', data:{action:'Update'}},
    { path: ":registrationId/registration-review", children: RegistrationReview_ROUTES,  data:{action:'Update'}},
     { path: "deregistration/new/:registrationId", component: DeregistrationAddComponent, data:{action:'Create'}},
     { path: ":registrationId/deregistration", children: deregistration_ROUTES,  data:{action:'Update'}}
   
];

import { Routes } from '@angular/router';

import { RegistrationReviewListComponent } from './registration-review-list/registration-review-list.component';
import { RegistrationReviewDetailComponent } from './registration-review-detail/registration-review-detail.component';
import { RegistrationReviewAddComponent } from './registration-review-add/registration-review-add.component';

export const RegistrationReview_ROUTES: Routes = [
   { path: "", component: RegistrationReviewListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: RegistrationReviewAddComponent, data:{action:'Create'}},
   { path: ":registrationReviewId", component: RegistrationReviewDetailComponent, data:{action:'Read'}},
   { path: "edit/:registrationReviewId", component: RegistrationReviewAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

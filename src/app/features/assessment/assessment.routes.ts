import { Routes } from '@angular/router';

import { AssessmentListComponent } from './assessment-list/assessment-list.component';
import { AssessmentDetailComponent } from './assessment-detail/assessment-detail.component';
import { AssessmentAddComponent } from './assessment-add/assessment-add.component';

export const Assessment_ROUTES: Routes = [
   { path: "", component: AssessmentListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: AssessmentAddComponent, data:{action:'Create'}},
   { path: ":assessmentId", component: AssessmentDetailComponent, data:{action:'Read'}},
   { path: "edit/:assessmentId", component: AssessmentAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

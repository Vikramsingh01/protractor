import { Routes } from '@angular/router';

import { DrugTestResultListComponent } from './drug-test-result-list/drug-test-result-list.component';
import { DrugTestResultDetailComponent } from './drug-test-result-detail/drug-test-result-detail.component';
import { DrugTestResultAddComponent } from './drug-test-result-add/drug-test-result-add.component';

export const DrugTestResult_ROUTES: Routes = [
   { path: "", component: DrugTestResultListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: DrugTestResultAddComponent, data:{action:'Create'}},
   { path: ":drugTestResultId", component: DrugTestResultDetailComponent, data:{action:'Read'}},
   { path: "edit/:drugTestResultId", component: DrugTestResultAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

import { Routes } from '@angular/router';

import { DrugTestListComponent } from './drug-test-list/drug-test-list.component';
import { DrugTestDetailComponent } from './drug-test-detail/drug-test-detail.component';
import { DrugTestAddComponent } from './drug-test-add/drug-test-add.component';
import { DrugTestResult_ROUTES } from '../drug-test-result/drug-test-result.routes';

export const DrugTest_ROUTES: Routes = [
   { path: "", component: DrugTestListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: DrugTestAddComponent, data:{action:'Create'}},
   { path: ":drugTestId", component: DrugTestDetailComponent, data:{action:'Read'}},
   { path: "edit/:drugTestId", component: DrugTestAddComponent, pathMatch: 'full', data:{action:'Update'}},
   {path: ":drugTestId/drug-test-result", children: DrugTestResult_ROUTES }
];

import { Routes } from '@angular/router';

import { RecallListComponent } from './recall-list/recall-list.component';
import { RecallDetailComponent } from './recall-detail/recall-detail.component';
import { RecallAddComponent } from './recall-add/recall-add.component';

export const Recall_ROUTES: Routes = [
   { path: "", component: RecallListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: RecallAddComponent, data:{action:'Create'}},
   { path: ":recallId", component: RecallDetailComponent, data:{action:'Read'}},
   { path: "edit/:recallId", component: RecallAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

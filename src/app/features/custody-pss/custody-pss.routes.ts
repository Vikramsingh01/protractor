import { Routes } from '@angular/router';

import { CustodyPssListComponent } from './custody-pss-list/custody-pss-list.component';
import { CustodyPssDetailComponent } from './custody-pss-detail/custody-pss-detail.component';
import { CustodyPssAddComponent } from './custody-pss-add/custody-pss-add.component';

export const CustodyPss_ROUTES: Routes = [
   { path: "", component: CustodyPssListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: CustodyPssAddComponent, data:{action:'Create'}},
   { path: ":pssRequirementId", component: CustodyPssDetailComponent, data:{action:'Read'}},
   { path: "edit/:pssRequirementId", component: CustodyPssAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

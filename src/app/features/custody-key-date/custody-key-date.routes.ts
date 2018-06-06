import { Routes } from '@angular/router';

import { CustodyKeyDateListComponent } from './custody-key-date-list/custody-key-date-list.component';
import { CustodyKeyDateDetailComponent } from './custody-key-date-detail/custody-key-date-detail.component';
import { CustodyKeyDateAddComponent } from './custody-key-date-add/custody-key-date-add.component';

export const CustodyKeyDate_ROUTES: Routes = [
   { path: "", component: CustodyKeyDateListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: CustodyKeyDateAddComponent, data:{action:'Create'}},
   { path: ":custodyKeyDateId", component: CustodyKeyDateDetailComponent, data:{action:'Read'}},
   { path: "edit/:custodyKeyDateId", component: CustodyKeyDateAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

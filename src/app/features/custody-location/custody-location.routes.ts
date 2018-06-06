import { Routes } from '@angular/router';

import { CustodyLocationListComponent } from './custody-location-list/custody-location-list.component';
import { CustodyLocationDetailComponent } from './custody-location-detail/custody-location-detail.component';
import { CustodyLocationAddComponent } from './custody-location-add/custody-location-add.component';

export const CustodyLocation_ROUTES: Routes = [
   { path: ":custodyLocationId", component: CustodyLocationDetailComponent, pathMatch: 'full', data:{action:'Read'}},
 //  { path: "new", component: CustodyLocationAddComponent, data:{action:'Create'}},
 //  { path: ":custodyLocationId", component: CustodyLocationDetailComponent, data:{action:'Read'}},
   { path: "edit/:custodyLocationId", component: CustodyLocationAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

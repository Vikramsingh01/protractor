import { Routes } from '@angular/router';

import { CourtWorkListComponent } from './court-work-list/court-work-list.component';
import { CourtWorkDetailComponent } from './court-work-detail/court-work-detail.component';
import { CourtWorkAddComponent } from './court-work-add/court-work-add.component';

export const CourtWork_ROUTES: Routes = [
   { path: "", component: CourtWorkListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: CourtWorkAddComponent, data:{action:'Create'}},
   { path: ":courtWorkId", component: CourtWorkDetailComponent, data:{action:'Read'}},
   { path: "edit/:courtWorkId", component: CourtWorkAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

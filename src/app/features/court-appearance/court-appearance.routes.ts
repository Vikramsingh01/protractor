import { Routes } from '@angular/router';

import { CourtAppearanceListComponent } from './court-appearance-list/court-appearance-list.component';
import { CourtAppearanceDetailComponent } from './court-appearance-detail/court-appearance-detail.component';
import { CourtAppearanceAddComponent } from './court-appearance-add/court-appearance-add.component';

export const CourtAppearance_ROUTES: Routes = [
   { path: "", component: CourtAppearanceListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: CourtAppearanceAddComponent, data:{action:'Create'}},
   { path: ":courtAppearanceId", component: CourtAppearanceDetailComponent, data:{action:'Read'}},
   { path: "edit/:courtAppearanceId", component: CourtAppearanceAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

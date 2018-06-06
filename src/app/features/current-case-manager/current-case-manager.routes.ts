import { Routes } from '@angular/router';

import { CurrentCaseManagerDetailComponent } from './current-case-manager-detail/current-case-manager-detail.component';

export const CurrentCaseManager_ROUTES: Routes = [
   { path: "", component: CurrentCaseManagerDetailComponent, data:{action:'Read'}}, 
];

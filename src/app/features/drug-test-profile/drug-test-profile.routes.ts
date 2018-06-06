import { Routes } from '@angular/router';

//import { DrugTestProfileListComponent } from './drug-test-profile-list/drug-test-profile-list.component';
import { DrugTestProfileDetailComponent } from './drug-test-profile-detail/drug-test-profile-detail.component';
import { DrugTestProfileAddComponent } from './drug-test-profile-add/drug-test-profile-add.component';

export const DrugTestProfile_ROUTES: Routes = [
   { path: "", component: DrugTestProfileDetailComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: DrugTestProfileAddComponent, data:{action:'Create'}},
   { path: ":drugTestProfileId", component: DrugTestProfileAddComponent, pathMatch: 'full', data:{action:'Update'}},
  // { path: ":drugTestProfileId", component: DrugTestProfileDetailComponent, data:{action:'Read'}},
 //  { path: "edit/:drugTestProfileId", component: DrugTestProfileAddComponent, pathMatch: 'full', data:{action:'Update'}}

];

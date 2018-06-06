import { Routes } from '@angular/router';

import { UpwAdjustmentListComponent } from './upw-adjustment-list/upw-adjustment-list.component';
import { UpwAdjustmentDetailComponent } from './upw-adjustment-detail/upw-adjustment-detail.component';
import { UpwAdjustmentAddComponent } from './upw-adjustment-add/upw-adjustment-add.component';

export const UpwAdjustment_ROUTES: Routes = [
   { path: "", component: UpwAdjustmentListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: UpwAdjustmentAddComponent, data:{action:'Create'}},
   { path: ":upwAdjustmentId", component: UpwAdjustmentDetailComponent, data:{action:'Read'}},
   { path: "edit/:upwAdjustmentId", component: UpwAdjustmentAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

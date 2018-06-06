import { Routes } from '@angular/router';

import { UPWSummaryComponent } from './upw-summary.component';
import { UpwDetail_ROUTES } from "../upw-detail/upw-detail.routes";

export const UPW_ROUTES: Routes = [
   { path: "", component: UPWSummaryComponent, pathMatch: 'full', data:{action:'Read'}},
   { path : "upw-detail", children: UpwDetail_ROUTES},
];

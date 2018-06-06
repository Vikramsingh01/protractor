import {Routes} from '@angular/router';
import {OfflocListComponent} from './offloc-list/offloc-list.component';
import {OfflocDetailComponent} from "./offloc-detail/offloc-detail.component";

export const Offloc_ROUTES: Routes = [
  {path: "", component: OfflocListComponent, pathMatch: 'full', data: {action: 'Read'}},
  {path: ":offlocResponseId", component: OfflocDetailComponent}
];

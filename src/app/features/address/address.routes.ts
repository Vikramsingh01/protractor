import { Routes } from '@angular/router';

import { addressListComponent } from './address-list/address-list.component';
import { addressDetailComponent } from './address-detail/address-detail.component';
import { addressAddComponent } from './address-add/address-add.component';
import { AddressAssessment_ROUTES } from '../address-assessment/address-assessment.routes';

export const Address_ROUTES: Routes = [
   { path: "", component: addressListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: addressAddComponent, data:{action:'Create'}},
   { path: ":offenderAddressId", component: addressDetailComponent, data:{action:'Read'}},
   { path: "edit/:offenderAddressId", component: addressAddComponent, pathMatch: 'full', data:{action:'Update'}},
   { path: ":offenderAddressId/address-assessment", children: AddressAssessment_ROUTES }
];

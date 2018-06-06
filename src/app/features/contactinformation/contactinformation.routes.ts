import { Routes } from '@angular/router';
import { contactinformationDetailComponent } from './contactinformation-detail/contactinformation-detail.component';
import { contactinformationAddComponent } from './contactinformation-add/contactinformation-add.component';
import { Address_ROUTES } from '../address/address.routes';
import { NETWORK_ROUTES } from '../network/network.routes';

export const contactinformation_ROUTES: Routes = [
   { path: "", component: contactinformationDetailComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: contactinformationAddComponent, data:{action:'Create'}},
   { path: "edit", component: contactinformationAddComponent, pathMatch: 'full', data:{action:'Update'}},
    { path: "", children: Address_ROUTES },
   { path: "", children: NETWORK_ROUTES },
   
];

import { Routes } from '@angular/router';

import { ProcessContactListComponent } from './process-contact-list/process-contact-list.component';
import { ProcessContactDetailComponent } from './process-contact-detail/process-contact-detail.component';
import { ProcessContactAddComponent } from './process-contact-add/process-contact-add.component';

export const ProcessContact_ROUTES: Routes = [
   { path: "", component: ProcessContactListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ProcessContactAddComponent, data:{action:'Create'}},
   { path: ":processContactId/:processTypeId", component: ProcessContactDetailComponent, data:{action:'Read'}},
   { path: "edit/:processContactId/:processTypeId", component: ProcessContactAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

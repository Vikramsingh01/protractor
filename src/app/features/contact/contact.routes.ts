import { Routes } from '@angular/router';

import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactAddComponent } from './contact-add/contact-add.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { GenerateLetterComponent } from '../document-store/generate-letter/generate-letter.component';

export const Contact_ROUTES: Routes = [
   { path: "", component: ContactListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ContactAddComponent, data:{action:'Create'}},
   { path: ":contactId", component: ContactDetailComponent, data:{action:'Read'}},
   { path: "edit/:contactId", component:ContactEditComponent , pathMatch: 'full', data:{action:'Update'}},
   {path: "generate-letter/:contactId", component: GenerateLetterComponent, pathMatch: 'full',  data: {parentRoute: ['../../../']} },
   {path: "edit/:contactId/generate-letter", component: GenerateLetterComponent, pathMatch: 'full', data: {parentRoute: ['..']} },
];

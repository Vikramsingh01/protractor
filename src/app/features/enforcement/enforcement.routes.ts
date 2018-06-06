import { Routes } from '@angular/router';

import { EnforcementListComponent } from './enforcement-list/enforcement-list.component';
import { ContactDetailComponent } from '../../features/contact/contact-detail/contact-detail.component';
import { ContactEditComponent } from '../../features/contact/contact-edit/contact-edit.component';
import { GenerateLetterComponent } from '../document-store/generate-letter/generate-letter.component';
export const Enforcement_ROUTES: Routes = [
   { path: "", component: EnforcementListComponent, pathMatch: 'full', data:{action:'Read'}},
    { path: ":profileId/contact/:contactId", component: ContactDetailComponent, data:{action:'Read'}},
    { path: ":profileId/edit/:contactId", component:ContactEditComponent , pathMatch: 'full', data:{action:'Update'}},
    {path: ":profileId/edit/:contactId/generate-letter", component: GenerateLetterComponent, data: {parentRoute: ['..']}},
    
];

import { Routes } from '@angular/router';
import { ProtectedCharacteristicsDetailComponent } from './protected-characteristics-detail/protected-characteristics-detail.component';
import { ProtectedCharacteristicsAddComponent } from './protected-characteristics-add/protected-characteristics-add.component';

export const ProtectedCharacteristics_ROUTES: Routes = [
   { path: "", component: ProtectedCharacteristicsDetailComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ProtectedCharacteristicsAddComponent, data:{action:'Create'}},
   { path: "edit", component: ProtectedCharacteristicsAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];

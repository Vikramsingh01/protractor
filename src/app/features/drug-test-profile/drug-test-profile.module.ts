import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DrugTestProfileAddComponent } from './drug-test-profile-add/drug-test-profile-add.component';
import { DrugTestProfileDetailComponent } from './drug-test-profile-detail/drug-test-profile-detail.component';
//import { DrugTestProfileListComponent } from './drug-test-profile-list/drug-test-profile-list.component';
import { DrugTestProfileService } from './drug-test-profile.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [DrugTestProfileAddComponent, DrugTestProfileDetailComponent],
  providers: [DrugTestProfileService],
  exports: [DrugTestProfileAddComponent, DrugTestProfileDetailComponent, SharedModule]
})
export class DrugTestProfileModule {}
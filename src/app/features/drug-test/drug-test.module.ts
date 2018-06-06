import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DrugTestAddComponent } from './drug-test-add/drug-test-add.component';
import { DrugTestDetailComponent } from './drug-test-detail/drug-test-detail.component';
import { DrugTestListComponent } from './drug-test-list/drug-test-list.component';
import { DrugTestService } from './drug-test.service';
import { DrugTestResultModule } from '..//drug-test-result/drug-test-result.module';
import { DrugTestProfileModule } from '..//drug-test-profile/drug-test-profile.module';
@NgModule({
  imports: [CommonModule, SharedModule, DrugTestResultModule, DrugTestProfileModule],
  declarations: [DrugTestAddComponent, DrugTestDetailComponent, DrugTestListComponent],
  providers: [DrugTestService],
  exports: [DrugTestAddComponent, DrugTestDetailComponent, DrugTestListComponent, SharedModule, DrugTestResultModule, DrugTestProfileModule]
})
export class DrugTestModule {}
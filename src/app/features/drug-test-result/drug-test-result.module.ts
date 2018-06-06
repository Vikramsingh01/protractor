import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DrugTestResultAddComponent } from './drug-test-result-add/drug-test-result-add.component';
import { DrugTestResultDetailComponent } from './drug-test-result-detail/drug-test-result-detail.component';
import { DrugTestResultListComponent } from './drug-test-result-list/drug-test-result-list.component';
import { DrugTestResultService } from './drug-test-result.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [DrugTestResultAddComponent, DrugTestResultDetailComponent, DrugTestResultListComponent],
  providers: [DrugTestResultService],
  exports: [DrugTestResultAddComponent, DrugTestResultDetailComponent, DrugTestResultListComponent, SharedModule]
})
export class DrugTestResultModule {}
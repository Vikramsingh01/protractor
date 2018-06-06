import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AdditionalIdentifierAddComponent } from './additional-identifier-add/additional-identifier-add.component';
import { AdditionalIdentifierDetailComponent } from './additional-identifier-detail/additional-identifier-detail.component';
import { AdditionalIdentifierListComponent } from './additional-identifier-list/additional-identifier-list.component';
import { AdditionalIdentifierService } from './additional-identifier.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [AdditionalIdentifierAddComponent, AdditionalIdentifierDetailComponent, AdditionalIdentifierListComponent],
  providers: [AdditionalIdentifierService],
  exports: [AdditionalIdentifierAddComponent, AdditionalIdentifierDetailComponent, AdditionalIdentifierListComponent, SharedModule]
})
export class AdditionalIdentifierModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AdditionalOffenceAddComponent } from './additional-offence-add/additional-offence-add.component';
import { AdditionalOffenceDetailComponent } from './additional-offence-detail/additional-offence-detail.component';
import { AdditionalOffenceListComponent } from './additional-offence-list/additional-offence-list.component';
import { AdditionalOffenceService } from './additional-offence.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [AdditionalOffenceAddComponent, AdditionalOffenceDetailComponent, AdditionalOffenceListComponent],
  providers: [AdditionalOffenceService],
  exports: [AdditionalOffenceAddComponent, AdditionalOffenceDetailComponent, AdditionalOffenceListComponent, SharedModule]
})
export class AdditionalOffenceModule {}
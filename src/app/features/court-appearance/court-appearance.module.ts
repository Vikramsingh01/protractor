import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CourtAppearanceAddComponent } from './court-appearance-add/court-appearance-add.component';
import { CourtAppearanceDetailComponent } from './court-appearance-detail/court-appearance-detail.component';
import { CourtAppearanceListComponent } from './court-appearance-list/court-appearance-list.component';
import { CourtAppearanceService } from './court-appearance.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [CourtAppearanceAddComponent, CourtAppearanceDetailComponent, CourtAppearanceListComponent],
  providers: [CourtAppearanceService],
  exports: [CourtAppearanceAddComponent, CourtAppearanceDetailComponent, CourtAppearanceListComponent, SharedModule]
})
export class CourtAppearanceModule {}
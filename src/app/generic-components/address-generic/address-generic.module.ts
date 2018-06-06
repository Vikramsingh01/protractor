import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { AddressGenericAddComponent } from "./address-generic-add/address-generic-add.component";
import { AddressGenericDetailComponent } from "./address-generic-detail/address-generic-detail.component";
import { AddressGenericService } from "./address-generic.service";

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [AddressGenericAddComponent, AddressGenericDetailComponent],
  providers: [AddressGenericService],
  exports: [AddressGenericAddComponent, AddressGenericDetailComponent, SharedModule]
})
export class AddressGenericModule { }

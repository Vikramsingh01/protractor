import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotesComponent } from "./notes.component";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [NotesComponent],
  exports: [NotesComponent, ReactiveFormsModule]
})
export class NotesModule {}
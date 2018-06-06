import { Component, OnInit, Input,ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'tr-notes',
  templateUrl: './notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesComponent implements OnInit {

  @Input("controlName") controlName: string;
  @Input("form") form: FormGroup;
  @Input("action") action ;
  @Input("label") label ;
  @Input("previousNotes") previousNotes;
  constructor() { }

  ngOnInit() {
    if(this.label == null || this.label == ""){
      this.label = "Notes";
    }

  }


}

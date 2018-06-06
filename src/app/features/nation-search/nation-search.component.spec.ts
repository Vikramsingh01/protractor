import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NationSearchComponent } from './nation-search.component';

describe('NationSearchComponent', () => {
  let component: NationSearchComponent;
  let fixture: ComponentFixture<NationSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NationSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

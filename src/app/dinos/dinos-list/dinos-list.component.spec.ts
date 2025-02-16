import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinosListComponent } from './dinos-list.component';

describe('DinosListComponent', () => {
  let component: DinosListComponent;
  let fixture: ComponentFixture<DinosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DinosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDinoFormComponent } from './create-dino-form.component';

describe('CreateDinoFormComponent', () => {
  let component: CreateDinoFormComponent;
  let fixture: ComponentFixture<CreateDinoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDinoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDinoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

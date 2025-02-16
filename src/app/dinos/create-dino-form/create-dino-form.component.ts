import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-dino-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-dino-form.component.html',
  styleUrl: './create-dino-form.component.css'
})
export class CreateDinoFormComponent {
  error: string | undefined;
  dinosaurForm: FormGroup;

  constructor(private supaService: SupabaseService, private fb: FormBuilder) {
    this.dinosaurForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      diet: [null, Validators.required],
      length: [null],
      link: [null/*, Validators.pattern('https?://.+')*/],
      lived_in: [null],
      named_by: [null],
      period: [null, Validators.required],
      species: [null],
      taxonomy: [null],
      type: [null, Validators.required],
    });
  }

  submitForm() {
    if (this.dinosaurForm.valid) {
      console.log('Dinosaur Data:', this.dinosaurForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
  
    /*sendRegister() {
      const email = this.registerForm.get('email')?.value
      const password = this.registerForm.get('password')?.value
  
      if (this.registerForm.valid) {
        this.supaService.getRegistro(email, password).subscribe({
          next: (data) => {
            console.log("Data: ",data);
            if (data.data.user?.email) {
              this.correctRegistro = true;
            }
            this.registerForm.reset();
          },
          error: (err) => this.error = err.message
        });
      }
    }*/
}

import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | undefined;

  correctRegistro: boolean;

  constructor(private supaService: SupabaseService, private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(".*[0-9].*"), // Al menos un número
        this.passwordValidator(8)
      ]],
      confirm_password: ['', Validators.required]
    }, { validators: this.passwordCrossValidator });
    this.correctRegistro = false;
  }

  sendRegister() {
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
  }

  // Calcula dinámicamente las clases para validación de formularios
  getValidationClass(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.invalid && control.touched) return 'is-invalid';
    if (control?.valid && control.touched) return 'is-valid';
    return '';
  }

  // Validador personalizado para contraseña
  passwordValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const isValid = control.value.length >= minLength && /\d/.test(control.value); // Incluye número
        return isValid ? null : { password: 'La contraseña debe tener al menos 8 caracteres y un número' };
      }
      return null;
    };
  }

  // Validador cruzado para comparar contraseñas
  passwordCrossValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password');
    const confirmPassword = group.get('confirm_password');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  };
}

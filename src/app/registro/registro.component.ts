import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  passwordMatchValidator,
  minimumAgeValidator,
  emailAlreadyRegisteredValidator,
} from './validators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;
  showConfirm = false;
  isSubmitting = false;
  submitSuccess = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.maxLength(60),
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$/),
          ],
        ],
        email: [
          '',
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [emailAlreadyRegisteredValidator()],
            updateOn: 'blur',
          },
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
          ],
        ],
        confirmPassword: ['', Validators.required],
        fechaNacimiento: ['', [Validators.required, minimumAgeValidator(18)]],
        telefonos: this.fb.array([this.crearTelefono()]),
        terminos: [false, Validators.requiredTrue],
      },
      { validators: passwordMatchValidator() }
    );
  }

  crearTelefono(): FormControl {
    return this.fb.control('', [
      Validators.required,
      Validators.pattern(/^\d{10}$/),
    ]);
  }

  get telefonos(): FormArray {
    return this.form.get('telefonos') as FormArray;
  }

  agregarTelefono(): void {
    if (this.telefonos.length < 3) {
      this.telefonos.push(this.crearTelefono());
    }
  }

  eliminarTelefono(index: number): void {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  get nombre() { return this.form.get('nombre')!; }
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }
  get fechaNacimiento() { return this.form.get('fechaNacimiento')!; }
  get terminos() { return this.form.get('terminos')!; }

  showError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  showTelefonoError(index: number): boolean {
    const ctrl = this.telefonos.at(index);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  getPasswordStrength(): { label: string; level: number; color: string } {
    const val: string = this.password.value || '';
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[@$!%*?&]/.test(val)) score++;
    if (val.length >= 12) score++;

    if (score <= 1) return { label: 'Débil', level: 1, color: '#dc2626' };
    if (score <= 3) return { label: 'Media', level: 2, color: '#d97706' };
    return { label: 'Fuerte', level: 3, color: '#059669' };
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
    setTimeout(() => {
      console.log('Datos enviados:', this.form.value);
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.form.reset();
      while (this.telefonos.length > 1) {
        this.telefonos.removeAt(1);
      }
      setTimeout(() => (this.submitSuccess = false), 4000);
    }, 2000);
  }
}
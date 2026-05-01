import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

export function minimumAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const today = new Date();
    const birth = new Date(control.value);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= minAge ? null : { underage: { requiredAge: minAge, actualAge: age } };
  };
}

const REGISTERED_EMAILS = [
  'test@banco.com',
  'usuario@ejemplo.com',
  'admin@digitalbanco.mx',
  'leyvamarianeta@gmail.com',
];

export function emailAlreadyRegisteredValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    return of(REGISTERED_EMAILS.includes(control.value.toLowerCase())).pipe(
      delay(800),
      map(taken => (taken ? { emailTaken: true } : null))
    );
  };
}
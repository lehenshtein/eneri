import { AbstractControl, ValidationErrors } from '@angular/forms';

export function compareValidator(formToCompareWith: AbstractControl) {
  return (control: AbstractControl): ValidationErrors | null => {
    return formToCompareWith.value === control.value ? null : { notSame: true }
  };

}


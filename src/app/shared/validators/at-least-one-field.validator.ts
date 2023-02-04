import { AbstractControl, ValidatorFn } from '@angular/forms';

export function atLeastOneField(...fields: Array<AbstractControl | null>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const fieldsWithValue = fields.filter(field => field && field.value && field.valid);
    return fieldsWithValue.length
      ? null : {atLeastOneFieldShouldBeFilled: true};
  }
}


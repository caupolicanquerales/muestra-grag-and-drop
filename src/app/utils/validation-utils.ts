import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function nameValidatorInArray(array: Array<string> | undefined): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!array || array.length === 0) {
      return null;
    }

    const value = typeof control.value === 'string'
      ? control.value
      : control?.value?.promptName;

    if (!value || value === '') {
      return null;
    }

    const normalizedValue = String(value).toLowerCase();
    const forbidden = array.some(item => item?.toLowerCase() === normalizedValue);

    return forbidden
      ? { forbiddenName: { value: { promptName: value } } }
      : null;
  };
}
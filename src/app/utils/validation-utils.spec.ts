import { FormControl } from '@angular/forms';
import { nameValidatorInArray } from './validation-utils';

describe('validation-utils', () => {
  it('returns null when array is empty or value missing', () => {
    const validatorEmpty = nameValidatorInArray([]);
    expect(validatorEmpty(new FormControl('abc'))).toBeNull();

    const validator = nameValidatorInArray(['abc']);
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl(null as any))).toBeNull();
  });

  it('flags forbiddenName when value exists in array (case-insensitive)', () => {
    const validator = nameValidatorInArray(['Alpha', 'Beta']);
    const res = validator(new FormControl('alpha')) as any;
    expect(res).toBeTruthy();
    expect(res.forbiddenName.value.promptName).toBe('alpha');
  });

  it('allows value not present in array and supports object value shape', () => {
    const validator = nameValidatorInArray(['foo']);
    expect(validator(new FormControl('bar'))).toBeNull();
    expect(validator(new FormControl({ promptName: 'bar' } as any))).toBeNull();
  });
});

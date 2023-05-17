import { AbstractControl, ValidatorFn } from "@angular/forms";
import { Type } from "./types";

export const typeValidator = (types: Type[]): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectType = control.value as Type;

    let isValid = !(
      !selectType ||
      selectType.title === '' ||
      selectType.description === ''
    );
    if (isValid) {
      isValid = !!types.find(type => {
        return (
          type.key === selectType.key &&
          type.title === selectType.title &&
          type.description === selectType.description
        );
      });
    }
    return isValid ? null : { invalidType: { value: control.value } };
  };
}

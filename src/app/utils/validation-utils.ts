import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { PromptGenerationImageInterface } from "../models/prompt-generation-image-interface";
import { SyntheticDataInterface } from "../models/synthetic-data-interface";


export function nameValidatorInArray(array: Array<PromptGenerationImageInterface> | Array<SyntheticDataInterface> | undefined): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if ((!control.value.promptName || control?.value?.promptName=="") || array==undefined) {
        return null; 
    }
    const forbidden =array.filter(item=>item.name.toLowerCase()==control.value.promptName.toLowerCase());
    return forbidden.length!=0 
        ? { 'forbiddenName': { value: control.value } }  
        : null;
  };
}
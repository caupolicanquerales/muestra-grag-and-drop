import { TypePromptEnum } from "../enums/type-prompt-enum";

export interface PromptAndDataToValidateInterface {
    [TypePromptEnum.IMAGE_PROMPT]?: Array<string>;
    [TypePromptEnum.DATA_PROMPT]?: Array<string>;
    [TypePromptEnum.BILL_PROMPT]?: Array<string>;
    [TypePromptEnum.SYNTHETIC_DATA]?: Array<string>;
    [TypePromptEnum.BASIC_TEMPLATE]?: Array<string>;
    [TypePromptEnum.GLOBAL_DEFECT_PROMPT]?: Array<string>;
    [TypePromptEnum.PUBLICITY_DATA]?: Array<string>;
    [TypePromptEnum.SYSTEM_PROMPT]?: Array<string>;
}
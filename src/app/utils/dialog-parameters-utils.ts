import { TypePromptEnum } from "../enums/type-prompt-enum";


export function getHeaderDialogToSystem(){
    return [{
        format: TypePromptEnum.SYSTEM_PROMPT,
            headerDialog: "Prompt a ser guardado en sistema"
        }]
}

export function getHeaderDialogToData(){
    return [{format: TypePromptEnum.DATA_PROMPT,
            headerDialog: "Prompt a ser guardado en datos"}]
}

export function getHeaderDialogToBillData(): Array<any> {
    return [{
        format: TypePromptEnum.IMAGE_PROMPT,
            headerDialog: "Prompt a ser guardado en imagen"
        },{format: TypePromptEnum.DATA_PROMPT,
            headerDialog: "Prompt a ser guardado en datos"},
        {format: TypePromptEnum.SYNTHETIC_DATA,
            headerDialog: "Información a ser guardado en dato sintético"}]
}

export function getExportFormatToBillData(): Array<any> {
    return [{format: ".md"},{format: ".json"},{format: ".txt"}];
}

export function getSaveFormartPromptToBillData(): Array<any> {
    return [{format: TypePromptEnum.IMAGE_PROMPT},{format: TypePromptEnum.DATA_PROMPT},{format: TypePromptEnum.SYNTHETIC_DATA}];
}

export function getHeaderDialogToBillEditor(): Array<any> {
    return [{
            format: TypePromptEnum.IMAGE_PROMPT,
            headerDialog: "Prompt a ser guardado en imagen"
        },{format: TypePromptEnum.DATA_PROMPT,
            headerDialog: "Prompt a ser guardado en datos"},
        {format: TypePromptEnum.BILL_PROMPT,
            headerDialog: "Prompt a ser guardado en factura"},
        {format: TypePromptEnum.SYNTHETIC_DATA,
            headerDialog: "Información a ser guardado en dato sintético"}];
}

export function getSaveFormartPromptForOther(): Array<any> {
    return [{format: TypePromptEnum.IMAGE_PROMPT},{format: TypePromptEnum.DATA_PROMPT},{format: TypePromptEnum.BILL_PROMPT},
    {format: TypePromptEnum.SYNTHETIC_DATA}
  ];
}

export function getSaveFormartPromptForSystem(): Array<any> {
    return [{format: TypePromptEnum.SYSTEM_PROMPT}];
}

export function getSaveFormartPromptForData(): Array<any> {
    return [{format: TypePromptEnum.DATA_PROMPT}];
}

export function getExportFormatToBillEditor(): Array<any> {
    return [{format: ".txt"}];
}

export function getHeaderDialogToBasicTemplate(): Array<any> {
    return [{
            format: TypePromptEnum.BASIC_TEMPLATE,
            headerDialog: "Template basico a ser guardado"
        }]
}

export function getSaveFormartBasicTemplate(): Array<any> {
    return [{format: TypePromptEnum.BASIC_TEMPLATE}
  ];
}

export function getSavePromptGlobalDefect(): Array<any> {
    return [{format: TypePromptEnum.GLOBAL_DEFECT_PROMPT}
  ];
}

export function getHeaderDialogGlobalDefect(): Array<any> {
    return [{
            format: TypePromptEnum.GLOBAL_DEFECT_PROMPT,
            headerDialog: "Prompt a ser guardado en defecto global"
        }];
}
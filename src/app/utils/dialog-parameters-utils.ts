
export function getHeaderDialogToBillData(): Array<any> {
    return [{
        format: "Prompt imagen",
            headerDialog: "Prompt a ser guardado en generación"
        },{format: "Prompt datos",
            headerDialog: "Prompt a ser guardado en datos"},
        {format: "Dato sintético",
            headerDialog: "Información a ser guardado en dato sintético"}]
}

export function getExportFormatToBillData(): Array<any> {
    return [{format: ".md"},{format: ".json"},{format: ".txt"}];
}

export function getSaveFormartPromptToBillData(): Array<any> {
    return [{format: "Prompt imagen"},{format: "Prompt datos"},{format: "Dato sintético"}];
}

export function getHeaderDialogToBillEditor(): Array<any> {
    return [{
            format: "Prompt imagen",
            headerDialog: "Prompt a ser guardado en generación"
        },{format: "Prompt datos",
            headerDialog: "Prompt a ser guardado en datos"},
        {format: "Prompt facturas",
            headerDialog: "Prompt a ser guardado en factura"},
        {format: "Dato sintético",
            headerDialog: "Información a ser guardado en dato sintético"}];
}

export function getSaveFormartPromptToBillEditor(): Array<any> {
    return [{format: "Prompt imagen"},{format: "Prompt datos"},{format: "Prompt facturas"},
    {format: "Dato sintético"}
  ];
}

export function getExportFormatToBillEditor(): Array<any> {
    return [{format: ".txt"}];
}

export function getHeaderDialogToBasicTemplate(): Array<any> {
    return [{
            format: "Template basico",
            headerDialog: "Template basico a ser guardado"
        }]
}

export function getSaveFormartBasicTemplate(): Array<any> {
    return [{format: "Template basico"}
  ];
}

export function getSavePromptGlobalDefect(): Array<any> {
    return [{format: "Prompt defecto global"}
  ];
}

export function getHeaderDialogGlobalDefect(): Array<any> {
    return [{
            format: "Prompt defecto global",
            headerDialog: "Prompt a ser guardado en defecto global"
        }];
}
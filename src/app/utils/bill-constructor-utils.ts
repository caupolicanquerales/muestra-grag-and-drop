import { TypePromptEnum } from "../enums/type-prompt-enum";

export interface EditorConfig {
  id: string;
  tree: any[]; 
  styledPrompt: string;
  typePrompt: string;
  selectedNode?: any;
  placeHolder?: string;
}

const placeHolderEditor = (): any =>{
  return {
    '1': 'Escriba el prompt para generara los datos sintéticos usando el json de datos mostrado',
    '2': 'Escriba el prompt para generara los datos de publicidad usando el json de datos mostrado'
  }
}

export function getEditors():EditorConfig[]{
    return [
        { id: '0', tree: [], styledPrompt: '', typePrompt:'', selectedNode: null, placeHolder: '' },
        { id: '1', tree: [], styledPrompt: '', typePrompt:'', selectedNode: null, placeHolder: placeHolderEditor()['1'] },
        { id: '2', tree: [], styledPrompt: '', typePrompt:'', selectedNode: null, placeHolder: placeHolderEditor()['2'] }   
        //{ id: '3', tree: [], styledPrompt: '', typePrompt:'' }
      ]
}

const orderSystemBase = (): TypePromptEnum[] => [
  TypePromptEnum.BASIC_TEMPLATE,
  TypePromptEnum.SYNTHETIC_DATA
];

export const orderSystem = (): string[] => [...orderSystemBase(),...[TypePromptEnum.SYSTEM_PROMPT]];

export const orderSystemWithPublicity = (): string[] => [...orderSystemBase(),...[TypePromptEnum.PUBLICITY_DATA, TypePromptEnum.SYSTEM_PROMPT]];

export const titlesHelp = (): any =>{
  return{
    "01": "Layout Base (HTML / CSS)",
    "11": "Inyección de Datos (JSON)",
    "21": "Inyeccio de Datos Publicitarios (JSON)",
    "31": "Prompt de Sistema",
  }
}

export const textHelp = (): any =>{
  return{
    "01": "Selecciona la plantilla estructural en formato HTML/CSS. Esta funcionará como el armazón o matriz visual sobre la cual se inyectarán dinámicamente los datos de las facturas.",
    "11": "Carga el archivo JSON que contiene las variables y valores sintéticos (fechas, montos, ítems, clientes). El sistema mapeará estos datos directamente sobre el layout seleccionado para poblar la factura.",
    "21": "Despliegue la carpeta de datos publicitarios y seleccione los datos en formato JSON previamente creados para ser introducidos como información secundaria a desplegar en la imagen",
    "31": "Despliegue la carpeta de prompt de sistemas y seleccione el prompt de reglas que debera seguir el modelo de imagen al ejecutar el prompt maestro de sistema",
  }
}

export const systemPromptHelp = (): any =>{
  return{
    "title": "Selección la configuración con o sin información de publicidad",
    "text": "Define las reglas del sistema y el comportamiento del agente de IA para la renderización. Activa o desactiva la inyección de elementos secundarios (como bloques publicitarios o metadatos extras) para alterar la composición visual de la factura sintética."
  }
}

import { TypePromptEnum } from "../enums/type-prompt-enum";

export interface EditorConfig {
  id: string;
  tree: any[]; 
  styledPrompt: string;
  typePrompt: string;
}

export function getEditors():EditorConfig[]{
    return [
        { id: '0', tree: [], styledPrompt: '', typePrompt:''},
        { id: '1', tree: [], styledPrompt: '', typePrompt:'' },
        { id: '2', tree: [], styledPrompt: '', typePrompt:'' },
        { id: '3', tree: [], styledPrompt: '', typePrompt:'' }
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
    "01": "Busqueda de templates básicos",
    "11": "Busqueda de datos sintéticos",
    "21": "Busqueda de datos publicitarios",
    "31": "Busqueda de prompt de sistemas",
  }
}

export const textHelp = (): any =>{
  return{
    "01": "Despliegue la carpeta de templates básicos y seleccione el HTMLy CSS previamente creado para ser usado como mapa visual",
    "11": "Despliegue la carpeta de datos sintéticos y seleccione los datos en formato JSON previamente creados para ser introducidos como información principal a desplegar en la imagen",
    "21": "Despliegue la carpeta de datos publicitarios y seleccione los datos en formato JSON previamente creados para ser introducidos como información secundaria a desplegar en la imagen",
    "31": "Despliegue la carpeta de prompt de sistemas y seleccione el prompt de reglas que debera seguir el modelo de imagen al ejecutar el prompt maestro de sistema",
  }
}

export const systemPromptHelp = (): any =>{
  return{
    "title": "Selección del prompt de sistema con o sin información de publicidad",
    "text": "Un prompt de sistema es una forma de introducir al modelo de generación de imagen los datos del usuario y las reglas que deberan ser ejecutas, de esta forma el proceso puede utilizarse de forma repetitiva. Minimamente requiere un mapa visual, una información principal a ser desplegada y un prompt de reglas. Seleccionar el prompt con datos publicitarios representa una forma de introducir información extra no relacionada con los datos principales."
  }
}
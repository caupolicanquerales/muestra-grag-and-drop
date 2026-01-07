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

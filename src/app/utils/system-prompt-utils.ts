import { SystemPromptInterface, UserPromptSubAgentInterface, UserPromptSubAgentObject } from "../models/system-prompt-interface";


function getSystemPrompt(systemPrompt: string | undefined, userPrompt: string | undefined): SystemPromptInterface{
  return {
      contents:[
        {
          role:"system",
          parts:[
            {
              text: systemPrompt
            }
          ]
        },
        {
          role:"user",
          parts:[
            {
              text: userPrompt
            }
          ]
        }
      ]
    }
}

export function getUserPromptSubAgent(basicTemplate: string | undefined, syntheticData?: string | undefined,
  promptUser?: string | undefined): UserPromptSubAgentObject{
  const prefix = containsHtmlOrCss(basicTemplate || '') ? '[INPUT_FORMAT: RAW_CODE] ' : '';
  const prefixRawData = isJson(syntheticData || '')?  '[INPUT_DATA: RAW_DATA] ' : '';
  const prefixUserPrompt = promptUser!='' ? '[INPUT_PROMPT_USER: RAW_PROMPT_USER] ' : '';
  return {
          html:prefix + basicTemplate,
          data: prefixRawData+ syntheticData,
          userPrompt: prefixUserPrompt + promptUser
        }
}

function containsHtmlOrCss(text: string): boolean {
    const htmlPattern = /<[a-zA-Z][^>]*>/;
    const cssPattern = /[a-zA-Z#.*[\]]+\s*\{[^}]*:[^}]*\}/;
    return htmlPattern.test(text) || cssPattern.test(text);
}

function isJson(text: string): boolean {
    let cleanText = text.replace(/<[^>]*>/g, '');
    cleanText = cleanText.replace(/\u00A0/g, ' ').trim();
    try {
        if ((cleanText.startsWith('{') && cleanText.endsWith('}')) || 
            (cleanText.startsWith('[') && cleanText.endsWith(']'))) {
            JSON.parse(cleanText);
            return true;
        }
    } catch (e) {
           
    }
    return false;
}

export function getSystemPromptWithoutPublicity(basicTemplate: string |undefined, syntheticData: string | undefined, 
  systemPrompt: string | undefined): SystemPromptInterface{
  let userPrompt= `HTML:${basicTemplate} JSON:${syntheticData}`;
  return getSystemPrompt(systemPrompt, userPrompt);
}


export function getSystemPromptWithPublicity(basicTemplate: string |undefined, syntheticData: string | undefined, 
  publicityData: string | undefined, systemPrompt: string | undefined): SystemPromptInterface{
  let userPrompt= `HTML:${basicTemplate} JSON:${syntheticData} PUBLICITY DATA:${publicityData}`;
  return getSystemPrompt(systemPrompt, userPrompt);
}

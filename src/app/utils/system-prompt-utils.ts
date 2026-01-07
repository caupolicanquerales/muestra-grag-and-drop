import { SystemPromptInterface } from "../models/system-prompt-interface";


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

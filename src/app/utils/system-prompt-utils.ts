import { SystemPromptInterface } from "../models/system-prompt-interface";

export function getSystemPrompt(basicTemplate: string |undefined, syntheticData: string | undefined,
     systemPrompt: string | undefined): SystemPromptInterface{
    let userPrompt= "HTML:"+basicTemplate+" JSON: "+ syntheticData;
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
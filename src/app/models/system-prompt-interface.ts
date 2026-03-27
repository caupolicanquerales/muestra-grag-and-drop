interface Prompt {
    text: string | undefined
}

interface SystemPromptObject {
    role: string,
    parts: Array<Prompt>;
}

export interface UserPromptSubAgentObject {
    html?: string,
    data?: string
    userPrompt?: string
}

export interface SystemPromptInterface {
    contents: Array<SystemPromptObject>;
}

export interface UserPromptSubAgentInterface {
    userPromptSubAgent: UserPromptSubAgentObject;
}
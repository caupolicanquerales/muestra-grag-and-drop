interface Prompt {
    text: string | undefined
}

interface SystemPromptObject {
    role: string,
    parts: Array<Prompt>;
}

export interface SystemPromptInterface {
    contents: Array<SystemPromptObject>;
}
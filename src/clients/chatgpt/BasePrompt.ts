export type Role = "system" | "user" | "assistant"

export interface Message {
    role: Role,
    content: string
}

export const generateSystemMessage = (message: string): Message => ({role: "system", content: message});
export const generateUserMessage = (message: string): Message => ({role: "user", content: message});
export const generateAssistantMessage = (message: string): Message => ({role: "assistant", content: message});

export type BasePrompt = Message[];
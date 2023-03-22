import { rc, ResultCode, RunningAction } from "blueshell";
import { BasePrompt } from "../clients/chatgpt/BasePrompt";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";

export abstract class ChatGptAction extends RunningAction<AgentState, AgentEvent> {
    protected _status: ResultCode | undefined;
    protected _promise: Promise<unknown> | unknown;

    constructor(name: string) {
        super(name);
    }

    protected abstract generatePrompts(state: AgentState): BasePrompt[];

    protected beforeChatCompletion(state: AgentState): void {
        
    }

    protected afterChatCompletion(state: AgentState): void {
        
    }

    protected async sendPromptsForCompletion(prompts: BasePrompt[], state: AgentState): Promise<string[]> {
        const responses = []

        this.beforeChatCompletion(state)

        for (const prompt of prompts) {
            responses.push(await this.createChatCompletion(prompt, state));
        }

        this.afterChatCompletion(state)

        return responses;
    }

    protected async createChatCompletion(prompt: BasePrompt, state: AgentState): Promise<string> {
        state.logger.write(`${"=".repeat(40)}\nNEW CHATGPT CHAT COMPLETION\n${"=".repeat(40)}\n`)

        const rawPrompt = prompt.map(x => `${x.role.toUpperCase()}: ${x.content}`).join("\n");
        state.logger.write(`PROMPT:\n${rawPrompt}\n`)

        const resp = await state.chatgptClient.createChatCompletion(prompt);

        const choices = resp.data.choices;

        if (choices.length !== 1) {
            throw new Error(`ChatGPT response returned multiple responses.`);
        }

        const message = choices[0].message;

        if (message === undefined) {
            throw new Error(`ChatGPT response returned undefined message.`);
        }

        state.logger.write(`CHATGPT:\n${message.content}\n`)

        return message.content;
    }

    protected abstract handleResponse(response: Promise<string[]>, state: AgentState): void;

    protected activate(state: AgentState, event: AgentEvent): ResultCode {

        this._status = rc.RUNNING;

        try {
            
            const prompts = this.generatePrompts(state);

            const responses = this.sendPromptsForCompletion(prompts, state);

            this._promise = this.handleResponse(responses, state);
            

        } catch (e) {
            console.error(e);
            this._status = rc.ERROR;
        }

        
        return this.status!;
        
    }

    /**
     * Test if action is completed
     * @param event 
     * @param state 
     * @returns true if action is in a completed state; false otherwise
     */
    protected isCompletionEvent(event: AgentEvent, state: AgentState): boolean {
        return this._status !== rc.RUNNING;
    }

    get status(): ResultCode | undefined {
        return this._status;
    }
    
}
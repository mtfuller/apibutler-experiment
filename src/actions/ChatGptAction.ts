import { rc, ResultCode, RunningAction } from "blueshell";
import { BasePrompt, Message } from "../clients/chatgpt/prompts/BasePrompt";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";

export abstract class ChatGptAction extends RunningAction<AgentState, AgentEvent> {
    protected _status: ResultCode | undefined;
    protected _promise: Promise<unknown> | unknown;

    constructor(name: string) {
        super(name);
    }

    protected abstract generatePrompt(state: AgentState): BasePrompt;

    protected async createChatCompletion(prompt: BasePrompt, state: AgentState): Promise<string> {
        const resp = await state.chatgptClient.createChatCompletion(prompt);

        const choices = resp.data.choices;

        if (choices.length !== 1) {
            throw new Error(`ChatGPT response returned multiple responses.`);
        }

        const message = choices[0].message;

        if (message === undefined) {
            throw new Error(`ChatGPT response returned undefined message.`);
        }

        return message.content;
    }

    protected abstract handleResponse(response: Promise<string>, state: AgentState): void;

    protected activate(state: AgentState, event: AgentEvent): ResultCode {
        if (state.debug) {
            let msg = `${this.name}`;
            console.log(`\n ------------------------`);
            console.log(`| CHATGPT ACTION | ${msg} |`);
            console.log(` ------------------------\n`);
        }

        this._status = rc.RUNNING;

        try {
            
            const prompt = this.generatePrompt(state);

            const response = this.createChatCompletion(prompt, state);
    
            this._promise = this.handleResponse(response, state);

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
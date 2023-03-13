import { rc, ResultCode, RunningAction } from "blueshell";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";

export abstract class AgentAction extends RunningAction<AgentState, AgentEvent> {
    protected _status: ResultCode | undefined;
    protected _promise: Promise<unknown> | unknown;

    constructor(name: string) {
        super(name);
    }

    protected activate(state: AgentState, event: AgentEvent): ResultCode {
        if (state.debug) {
            let msg = `${this.name}`;
            console.log(`\n -----------------`);
            console.log(`| ACTION | ${msg} |`);
            console.log(` -----------------\n`);
            console.log(`assignment: ${state.assignment}`);
            console.log(`# of tasks: ${state.tasks.length}`)
        }

        this._status = rc.RUNNING;
        
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
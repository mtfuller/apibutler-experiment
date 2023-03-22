import { BaseNode, ResultCode, rc } from "blueshell";
import { AgentEvent } from "./AgentEvent";
import { AgentState } from "./AgentState";

export class AgentEnvironment {
    _status: ResultCode | undefined;

    constructor(
        public name: string, 
        public agentTree: BaseNode<AgentState, string>,
        public agentState: AgentState
    ) {

    }

    launch(): void {
        setInterval(() => {
            this._status = this.sendBTEvent(this.agentState,'tic');
        }, 500);
    }

    private sendBTEvent(state: AgentState, event: AgentEvent): ResultCode {
        return this.agentTree.handleEvent(state, event);
    }
}
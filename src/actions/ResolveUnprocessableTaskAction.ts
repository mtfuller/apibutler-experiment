import { ResultCode, rc } from "blueshell";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";
import { AgentAction } from "./AgentAction";

export class ResolveUnprocessableTaskAction extends AgentAction {

    constructor(name: string) {
        super(name);
    }

    protected activate(state: AgentState, event: AgentEvent): ResultCode {
        
        super.activate(state,event);

        this._promise = this.completeNextTask(state);

        return this.status!;

    }

    private async completeNextTask(state: AgentState) {

        await new Promise(r => setTimeout(r, 200));

        this._status = rc.SUCCESS;

    }

}
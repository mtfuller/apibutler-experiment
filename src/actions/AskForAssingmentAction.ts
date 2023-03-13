import { ResultCode, rc } from "blueshell";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";
import { Terminal } from "../util/Terminal";
import { AgentAction } from "./AgentAction";

export class AskForAssignmentAction extends AgentAction {

    constructor(name: string) {
        super(name);
    }

    protected activate(state: AgentState, event: AgentEvent): ResultCode {
        
        super.activate(state,event);

        this._promise = this.askForAssignment(state);

        return this.status!;

    }

    private async askForAssignment(state: AgentState) {

        const answer = await state.terminal.prompt("What's my assignment?")

        state.assignment = answer;

        this._status = rc.SUCCESS;

    }

}
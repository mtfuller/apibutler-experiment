import { ResultCode, rc } from "blueshell";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";
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

        await state.terminal.displayMessageFromAPIButler(
            `Hello! My name is APIButler. I am an AI-powered API generation tool. You simply ` + 
            ` give me an assignment, a description of an API backend that you want, and then ` + 
            `I will try my best to generate a working RESTful API service.`
        , 3000);

        const answer = await state.terminal.prompt("I am ready to get to work! What is my assigment?")

        state.assignment = answer;

        this._status = rc.SUCCESS;

    }

}
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
        console.log("AgentEnvironment CREATED!");
    }

    launch(): void {
        // if (this.isActive() || (this.status && this.status !== rc.RUNNING)) {
        //   throw new Error('Mission already running');
        // }

        //console.log(this.sendBTEvent(this.agentState,'tic'));

        setInterval(() => {
            this._status = this.sendBTEvent(this.agentState,'tic');
            //console.log(`Current Status: ${this._status}`)

            // if (this.agentState.debug) {
            //     console.log(`Current Status: ${this._status}`)
            // }
        }, 500)
    
        // this._status = rc.RUNNING;
        // this.emit('launch', this.missionState);
        // this._timer = 
        //   setInterval(() => {
        //     if (!this.isComplete()) {
        //       this._status = this.sendBTEvent(this.missionState,'tic');
        //     } else {
        //       this.stopTic();
        //     }
        //   }, 1000 / TICK_FREQ);
    }

    private sendBTEvent(state: AgentState, event: AgentEvent): ResultCode {
        return this.agentTree.handleEvent(state, event);
    }
}
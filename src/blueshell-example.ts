import {
    BaseNode,
    BlueshellState,
    LatchedSequence,
    ResultCode,
    RunningAction,
    Selector,
    rc
} from 'blueshell'

export class AgentState implements BlueshellState {
    __blueshell: any;
    debug: boolean = true;
}

export type AgentEvent = 'launch' | 'complete' | 'abort' | 'tic';

class AgentEnvironment {

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

        console.log(this.sendBTEvent(this.agentState,'tic'));
        console.log(this.sendBTEvent(this.agentState,'tic'));
    
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

class MyAction extends RunningAction<AgentState, AgentEvent> {
    protected _status: ResultCode | undefined;
    protected _promise: Promise<unknown> | unknown;

    constructor(name: string) {
        super(name);
    }

    protected activate(state: AgentState, event: AgentEvent): ResultCode {
        let msg = `${this.name}`;
        console.log(`MISSION ${msg}`);
        this._status = rc.SUCCESS;
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



export default function() {
    const agentState = new AgentState();

    const agentTree = new Selector<AgentState, string>(
        'AgentBehavior',
        [
            new LatchedSequence<AgentState, AgentEvent>(
                'MyProcedure',
                [
                    new MyAction("A"),
                    new MyAction("B"),
                    new MyAction("C")
                ]
            )
        ]
    )

    const environment = new AgentEnvironment("env", agentTree, agentState) 

    environment.launch()
}
import { BlueshellState } from "blueshell";
import { ChatGPT } from "../clients/ChatGPT";
import ChatGPTClient from "../clients/chatgpt/Index";
import { Terminal } from "../util/Terminal";
import { AgentWorkspace } from "./AgentWorkspace";
import { BetterTask, Task } from "./Task";

export interface DataModel {
    type: "MODEL",
    filename: string,
    packages: string[],
    dependencies: string[]
}

export class AgentState implements BlueshellState {
    __blueshell: any;
    debug: boolean;
    
    assignment: string | null = null;
    dataModels: DataModel[] = [];
    tasks: BetterTask[] = [];

    constructor(
        public chatgptClient: ChatGPTClient,
        public terminal: Terminal,
        public workspace: AgentWorkspace
    ) {
        this.debug = true;
      }
}
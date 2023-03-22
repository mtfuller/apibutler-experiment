import { BlueshellState } from "blueshell";
import ChatGPTClient from "../clients/chatgpt/Index";
import { LogFile } from "../util/LogFile";
import { Terminal } from "../util/Terminal";
import { AgentWorkspace } from "./AgentWorkspace";
import { WorkspaceTemplate } from "./WorkspaceTemplate";

export class AgentState implements BlueshellState {
    __blueshell: any;
    debug: boolean;
    
    assignment: string | null = null;

    constructor(
        public chatgptClient: ChatGPTClient,
        public terminal: Terminal,
        public workspace: AgentWorkspace,
        public logger: LogFile,
        public workspaceTemplate: WorkspaceTemplate
    ) {
        this.debug = true;
      }
}
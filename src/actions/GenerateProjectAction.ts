import { rc, ResultCode } from "blueshell";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";
import { AgentAction } from "./AgentAction";
import path from 'path';

export class GenerateProjectAction extends AgentAction {

    constructor(name: string) {
        super(name);
    }

    protected activate(state: AgentState, event: AgentEvent): ResultCode {
        
        super.activate(state,event);

        this._promise = this.generateProject(state);

        return this.status!;

    }

    private async generateProject(state: AgentState) {

        state.workspaceTemplate.templateModel.apibutler.on_setup.forEach((command: any) => {
          state.workspace.runCommand(command);
        });

        state.workspace.workspaceFiles.forEach(file => {
            if (file.content) {
                const filename = (file.filename.endsWith(".js")) ? file.filename : `${file.filename}.js`;
                
                state.workspace.writeFile(filename, file.content)
            }
        })

        state.workspaceTemplate.templateModel.apibutler.static.forEach((file: any) => {
          const fileContents = state.workspaceTemplate.readFile(file);

          const fileName = path.basename(file)

          state.workspace.writeFile(`./${fileName}`, fileContents)
        });

        state.terminal.displayMessageFromAPIButler(
          `Awesome! I was able to successfully generate a new project, and I attempted ` + 
          `to meet all the requirements you have given me. Take a look at the project!`
        )

        state.workspace.isGenerated = true;

        this._status = rc.SUCCESS;

    }

}
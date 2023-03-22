import { rc } from "blueshell";
import { BasePrompt, generateAssistantMessage, generateSystemMessage, generateUserMessage } from "../clients/chatgpt/BasePrompt";
import { AgentState } from "../core/AgentState";
import { WorkspaceFile } from "../core/AgentWorkspace";
import { parseCodeBlocks } from "../util/Util";
import { ChatGptAction } from "./ChatGptAction";
import path from 'path';

export class GenerateControllerFilesAction extends ChatGptAction {

    constructor(name: string) {
        super(name);
    }

    protected generatePrompts(state: AgentState): BasePrompt[] {
        const systemMessage = generateSystemMessage(
            `Act as a AI agent that is able to problem solve and generate code to create ` + 
            `business solutions. You will be given a JavaScript service file. ` + 
            `Your job is to read the the JavaScript service file, and generate a controller file in ` + 
            `JavaScript to utilize the service file.`
        );

        const userServiceFile = `\`\`\`javascript
${state.workspaceTemplate.templateModel.apibutler.exemplars.controller.input}
\`\`\``

        const userExample = generateUserMessage(userServiceFile)

        const assistantExample = generateAssistantMessage(`\`\`\`javascript
${state.workspaceTemplate.templateModel.apibutler.exemplars.controller.output}
\`\`\``);

        const serviceFiles = state.workspace.workspaceFiles.filter(x => x.type === "SERVICE").map(x => [
          systemMessage,
          userExample,
          assistantExample,
          generateUserMessage(`${x.content}`)
        ])

        return serviceFiles
    }

  protected beforeChatCompletion(state: AgentState): void {
      state.terminal.startSpinner("Generating controller files...");
  }

  protected afterChatCompletion(state: AgentState): void {
      state.terminal.stopSpinner("Successfully generated controllers!");
  }

    protected async handleResponse(response: Promise<string[]>, state: AgentState) {
        
        const codeBlocks = (await response).flatMap(parseCodeBlocks);

        const generatedCodeBlocks = codeBlocks.filter(block => block.language === "javascript")
            .map(block => block.code)

        if (generatedCodeBlocks.length !== state.workspace.dataModel.length) {
            throw new Error("Did not generate the correct number of code blocks")
        }

        const workspaceControllers: WorkspaceFile[] = generatedCodeBlocks.map((codeBlock, index) => {

            const { filename } = state.workspace.workspaceFiles.filter(x => x.type==="MODEL")[index];

            const fileBasename = path.basename(filename);

            return {
                type: "CONTROLLER",
                isGenerated: true,
                filename: `controllers/${fileBasename.replace(".js", "")}Controller`,
                packages: [],
                dependencies: [],
                content: codeBlock
            }
        });

        workspaceControllers.forEach(x => {
          state.workspace.addWorkspaceFile(x);

          state.terminal.print(`Generated ${x.filename}.js`)
      });

        this._status = rc.SUCCESS
        
    }

}
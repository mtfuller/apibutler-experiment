import { rc } from "blueshell";
import { BasePrompt, generateAssistantMessage, generateSystemMessage, generateUserMessage } from "../clients/chatgpt/BasePrompt";
import { AgentState } from "../core/AgentState";
import { WorkspaceFile } from "../core/AgentWorkspace";
import { parseCodeBlocks } from "../util/Util";
import { ChatGptAction } from "./ChatGptAction";
import path from 'path';

export class GenerateServiceFilesAction extends ChatGptAction {

    constructor(name: string) {
        super(name);
    }

    protected generatePrompts(state: AgentState): BasePrompt[] {
        const systemMessage = generateSystemMessage(
            `Act as a AI agent that is able to problem solve and generate code to create ` + 
            `business solutions. You will be given a JavaScript model file. ` + 
            `Your job is to read the the JavaScript model file, and generate a service file in ` + 
            `JavaScript to utilize the model file.`
        );

        const userModelFile = `\`\`\`javascript
${state.workspaceTemplate.templateModel.apibutler.exemplars.service.input}
\`\`\``

        const userExample = generateUserMessage(userModelFile)

        const assistantExample = generateAssistantMessage(`\`\`\`javascript
${state.workspaceTemplate.templateModel.apibutler.exemplars.service.output}
\`\`\``);

        const modelFiles = state.workspace.workspaceFiles.filter(x => x.type === "MODEL").map(x => [
          systemMessage,
          userExample,
          assistantExample,
          generateUserMessage(`${x.content}`)
        ])

        return modelFiles
    }

  protected beforeChatCompletion(state: AgentState): void {
      state.terminal.startSpinner("Generating service files...");
  }

  protected afterChatCompletion(state: AgentState): void {
    state.terminal.stopSpinner("Successfully generated service files!");
  }

    protected async handleResponse(response: Promise<string[]>, state: AgentState) {
        
        const codeBlocks = (await response).flatMap(parseCodeBlocks);

        const generatedCodeBlocks = codeBlocks.filter(block => block.language === "javascript")
            .map(block => block.code)

        if (generatedCodeBlocks.length !== state.workspace.dataModel.length) {
            throw new Error("Did not generate the correct number of code blocks")
        }

        const workspaceModels: WorkspaceFile[] = generatedCodeBlocks.map((codeBlock, index) => {

            const { filename } = state.workspace.workspaceFiles.filter(x => x.type==="MODEL")[index];

            const fileBasename = path.basename(filename);

            return {
                type: "SERVICE",
                isGenerated: true,
                filename: `services/${fileBasename.replace(".js", "")}Service`,
                packages: [],
                dependencies: [filename],
                content: codeBlock
            }
        });

        workspaceModels.forEach(x => {
          state.workspace.addWorkspaceFile(x);

          state.terminal.print(`Generated ${x.filename}.js`)
      });

        this._status = rc.SUCCESS
        
    }

}
import { rc } from "blueshell";
import { BasePrompt, generateAssistantMessage, generateSystemMessage, generateUserMessage } from "../clients/chatgpt/BasePrompt";
import { AgentState } from "../core/AgentState";
import { WorkspaceFile } from "../core/AgentWorkspace";
import { parseCodeBlocks } from "../util/Util";
import { ChatGptAction } from "./ChatGptAction";

export class GenerateModelFilesAction extends ChatGptAction {

    constructor(name: string) {
        super(name);
    }

    protected generatePrompts(state: AgentState): BasePrompt[] {
        const systemMessage = generateSystemMessage(
            `Act as a AI agent that is able to problem solve and generate code to create ` + 
            `business solutions. You will be given a JSON object that represents a data ` + 
            `model. Your job is to read the data model JSON object and generate an ` + 
            `equivalent of JavaScript model file.`
        );

        const userExample = generateUserMessage(state.workspaceTemplate.templateModel.apibutler.exemplars.model.input)

        const assistantExample = generateAssistantMessage(`\`\`\`javascript
${state.workspaceTemplate.templateModel.apibutler.exemplars.model.output}
\`\`\``);

        if (state.workspace.dataModel.length === 0) {
            throw new Error("No data models!");
        }

        const prompts = state.workspace.dataModel.map(x => JSON.stringify(x, null, 2))
            .map(x => `\`\`\`json\n${x}\n\`\`\``)
            .map(x => [
                systemMessage,
                userExample,
                assistantExample,
                generateUserMessage(x)
            ])

        return prompts
    }

    protected beforeChatCompletion(state: AgentState): void {
        state.terminal.startSpinner("Generating model files...");
    }

    protected afterChatCompletion(state: AgentState): void {
        state.terminal.stopSpinner("Successfully generated model files!");
    }

    protected async handleResponse(response: Promise<string[]>, state: AgentState) {
        
        const codeBlocks = (await response).flatMap(x => parseCodeBlocks(x));

        const generatedCodeBlocks = codeBlocks.filter(block => block.language === "javascript")
            .map(block => block.code)

        if (generatedCodeBlocks.length !== state.workspace.dataModel.length) {
            throw new Error("Did not generate the correct number of code blocks")
        }

        const workspaceModels: WorkspaceFile[] = generatedCodeBlocks.map((codeBlock, index) => {

            const { filename, packages, dependencies } = state.workspace.dataModel[index];

            return {
                type: "MODEL",
                isGenerated: true,
                filename,
                packages,
                dependencies,
                content: codeBlock
            }
        });

        workspaceModels.forEach(x => {
            state.workspace.addWorkspaceFile(x);

            state.terminal.print(`Generated ${x.filename}`)
        });
        
        this._status = rc.SUCCESS
        
    }

}
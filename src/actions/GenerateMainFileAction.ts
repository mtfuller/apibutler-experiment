import { rc } from "blueshell";
import { BasePrompt, generateAssistantMessage, generateSystemMessage, generateUserMessage } from "../clients/chatgpt/BasePrompt";
import { AgentState } from "../core/AgentState";
import { WorkspaceFile } from "../core/AgentWorkspace";
import { parseCodeBlocks } from "../util/Util";
import { ChatGptAction } from "./ChatGptAction";

export class GenerateMainFileAction extends ChatGptAction {

    constructor(name: string) {
        super(name);
    }

    protected generatePrompts(state: AgentState): BasePrompt[] {
        const systemMessage = generateSystemMessage(
            `Act as a AI agent that is able to problem solve and generate code to create ` + 
            `business solutions. You will be given a list of JSON objects that contain all the controller files in the project. ` + 
            `Your job is to read the list of JSON objects, and generate an index file in ` + 
            `JavaScript to serve an express app server.`
        );

        const userExample = generateUserMessage(state.workspaceTemplate.templateModel.apibutler.exemplars.main.input)

        const assistantExample = generateAssistantMessage(`\`\`\`javascript
${state.workspaceTemplate.templateModel.apibutler.exemplars.main.output}
\`\`\``);

        if (state.workspace.workspaceFiles.filter(x => x.type === "CONTROLLER").length === 0) {
            throw new Error("No controllers!");
        }

        const jsonObjects = state.workspace.workspaceFiles.filter(x => x.type === "CONTROLLER")
            .map(x => x.content)
            .join("\n")

        const prompt = [
            systemMessage,
            userExample,
            assistantExample,
            generateUserMessage(jsonObjects)
        ]

        return [prompt]
    }

    protected beforeChatCompletion(state: AgentState): void {
        state.terminal.startSpinner("Generating main file...");
    }

    protected afterChatCompletion(state: AgentState): void {
        state.terminal.stopSpinner("Successfully generated main file!");
    }

    protected async handleResponse(response: Promise<string[]>, state: AgentState) {
        
        const codeBlocks = (await response).flatMap(x => parseCodeBlocks(x));

        const generatedCodeBlocks = codeBlocks.filter(block => block.language === "javascript")
            .map(block => block.code)

        if (generatedCodeBlocks.length !== 1) {
            console.error(generatedCodeBlocks)
            throw new Error("Did not generate the correct number of code blocks")
        }

        const workspaceModels: WorkspaceFile[] = generatedCodeBlocks.map(codeBlock => {

            return {
                type: "MAIN",
                isGenerated: true,
                filename: './index.js',
                packages: [],
                dependencies: [],
                content: codeBlock
            }
        });

        workspaceModels.forEach(x => state.workspace.addWorkspaceFile(x));
        
        this._status = rc.SUCCESS
        
    }

}
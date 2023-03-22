import { rc } from "blueshell";
import { BasePrompt, generateAssistantMessage, generateSystemMessage, generateUserMessage } from "../clients/chatgpt/BasePrompt";
import { AgentState } from "../core/AgentState";
import { WorkspaceModel } from "../core/AgentWorkspace";
import { parseCodeBlocks } from "../util/Util";
import { ChatGptAction } from "./ChatGptAction";

// Act as a AI agent that is able to problem solve and design a data model of a new business solution. You will be given a JSON object that represents an entity in a given data model. Your job is to convert that JSON object into a sample JSON object where the schema is populated with sample data. You are only to respond using the example format.

/* 
```json
{
    "filename": "./models/Pet.js",
    "packages": ["mongoose"],
    "dependencies": ["./Owner"],
    "schema": {
        "name": "string",
        "breed": "string",
        "age": "integer",
        "owner": "Owner"
    }
}
```
*/

/* 
```json
{
        "name": "John Smith",
        "breed": "Golden Retriever",
        "age": 5,
        "owner": "1a5b37ff25e1e24ac4c238"
}
```
*/

export class GenerateDataModelAction extends ChatGptAction {
    constructor(name: string) {
        super(name);
    }

    protected generatePrompts(state: AgentState): BasePrompt[] {
        const systemMessage = generateSystemMessage(`Act as a AI agent that is able to problem solve and design a data model of a new business solution. You will be given a description of a new software solution that a product team wants to implement. Your job is to generate a set of JSON objects that each represent data schemas needed to meet the requirements. Follow the response example exactly, and do not add any other explanations.`);

        const userExample = generateUserMessage(state.workspaceTemplate.templateModel.apibutler.exemplars.data_model.input)

        const assistantExample = generateAssistantMessage(state.workspaceTemplate.templateModel.apibutler.exemplars.data_model.output);

        if (state.assignment === null) {
            throw new Error("Assignment is null");
        }

        const prompt = [
            systemMessage,
            userExample,
            assistantExample,
            generateUserMessage(state.assignment)
        ]

        return [prompt]
    }

    protected beforeChatCompletion(state: AgentState): void {
        state.terminal.startSpinner("Generating data model...");
    }

    protected afterChatCompletion(state: AgentState): void {
        state.terminal.stopSpinner("Successfully generated data model!");
    }

    protected async handleResponse(response: Promise<string[]>, state: AgentState) {
        
        const codeBlocks = (await response).flatMap(x => parseCodeBlocks(x));

        const workspaceModels = codeBlocks.filter(block => block.language === "json")
            .map(block => block.code)
            .map(model => JSON.parse(model) as WorkspaceModel);

        workspaceModels.forEach(x => {
            state.workspace.addDataModel(x);

            const entityName = x.filename.replace("./models/","")
                .replace(".js", "");
            const entitySchema = JSON.stringify(x.schema, null, 2);

            state.terminal.print(`Designed data schema for the ${entityName} entity:\n${entitySchema}\n`);
        });

        this._status = rc.SUCCESS
        
    }

}
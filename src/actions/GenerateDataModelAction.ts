import { ResultCode, rc } from "blueshell";
import { BasePrompt, generateAssistantMessage, generateSystemMessage, generateUserMessage } from "../clients/chatgpt/prompts/BasePrompt";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";
import { WorkspaceModel } from "../core/AgentWorkspace";
import { Terminal } from "../util/Terminal";
import { parseCodeBlocks } from "../util/Util";
import { AgentAction } from "./AgentAction";
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

    protected generatePrompt(state: AgentState): BasePrompt {
        const systemMessage = generateSystemMessage(`Act as a AI agent that is able to problem solve and design a data model of a new business solution. You will be given a description of a new software solution that a product team wants to implement. Your job is to generate a set of JSON objects that each represent different entities needed to meet the requirements. Follow the response example exactly, and do not add any other explanations.`);

        const userExample = generateUserMessage(`The product team wants to create a new API that will keep track of pet and owner data. The Pet data model must store info such as name, breed, age, and the owner. The Pet data model will be managed by the "/pets" endpoint. The Owner data model must store the first and last name of the owner, and will be available via the "/owners" endpoint. Clients can utilize the /pets and /owners endpoints to perform CRUD operations on each data model.`)

        const assistantExample = generateAssistantMessage(`\`\`\`json
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
        \`\`\`
        \`\`\`json
        {
            "filename": "./models/Owner.js",
            "packages": ["mongoose"],
            "dependencies": [],
            "schema": {
                "first_name": "string",
                "last_name": "string"
            }
        }
        \`\`\``);

        if (state.assignment === null) {
            throw new Error("Assignment is null");
        }

        return [
            systemMessage,
            userExample,
            assistantExample,
            generateUserMessage(state.assignment)
        ]
    }

    protected async handleResponse(response: Promise<string>, state: AgentState) {
        
        const codeBlocks = parseCodeBlocks(await response);

        const workspaceModels = codeBlocks.filter(block => block.language === "json")
            .map(block => block.code)
            .map(code => JSON.parse(code) as WorkspaceModel);

        workspaceModels.forEach(x => state.workspace.addWorkspaceFile(x));

        this._status = rc.SUCCESS
        
    }

}
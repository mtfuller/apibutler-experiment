import { BasePrompt, generateAssistantMessage, generateSystemMessage, generateUserMessage, Message } from "./BasePrompt";

const systemMessage = generateSystemMessage(`
Act as a AI that can problem solve and determine what code files 
need to be created in order to implement a feature. Read the description 
of the feature and then generate a list of JSON objects that represent 
files that need to be created.
`)


const exampleUser = generateUserMessage(`
The product team has announced the highest priority feature we 
need to implement is to create a new API that can keep track of 
employee data. Create an API with an endpoint, called "/employees". 
This endpoint will be used to manage employee data. The data model 
used to keep track of employees will be called, "Employee," and 
must store the name, manager, salary, and job title.
`)

const exampleAssistant = generateAssistantMessage(`
\`\`\`json
{
    "type": "MODEL",
    "filename": "./models/Employee.js",
    "packages": ["mongoose"],
    "dependencies": []
}
\`\`\`
\`\`\`json
{
    "type": "SERVICE",
    "filename": "./services/EmployeeService.js",
    "packages": [],
    "dependencies": ["../models/Employee"]
}
\`\`\`
\`\`\`json
{
    "type": "CONTROLLER",
    "filename": "./controllers/EmployeeController.js",
    "packages": ["express"],
    "dependencies": ["../services/EmployeeService"]
}
\`\`\`
\`\`\`json
{
    "type": "DB_CONFIG",
    "filename": "./db.js",
    "packages": ["mongoose"],
    "dependencies": []
}
\`\`\`
\`\`\`json
{
    "type": "MAIN",
    "filename": "./index.js",
    "packages": ["express", "body-parser"],
    "dependencies": ["./controllers/EmployeeController", "./db"]
}
\`\`\`
\`\`\`json
{
    "type": "DOCKERFILE",
    "filename": "./Dockerfile",
    "packages": [],
    "dependencies": []
}
\`\`\`
\`\`\`json
{
    "type": "DOCKER_COMPOSE",
    "filename": "./docker-compose.yml",
    "packages": [],
    "dependencies": []
}
\`\`\`
`)

export default (userMessage: string): BasePrompt => {
    return [
        systemMessage,
        exampleUser,
        exampleAssistant,
        generateUserMessage(userMessage)
    ]
}
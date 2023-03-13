import { ResultCode, rc } from "blueshell";
import { stat } from "fs";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";
import { BetterTask, Task } from "../core/Task";
import { AgentAction } from "./AgentAction";
import { parseCodeBlocks } from "../util/Util";
import determineTasksPrompt from '../clients/chatgpt/prompts/DetermineTasksPrompt';

export class DetermineTasksFromAssignmentAction extends AgentAction {

    constructor(name: string) {
        super(name);
    }

    protected activate(state: AgentState, event: AgentEvent): ResultCode {
        
        super.activate(state,event);

        this._promise = this.determineTasksFromAssignment(state)

        return this.status!;

    }

    async determineTasksFromAssignment(state: AgentState) {

        if (state.assignment !== null) {
            //const response = await state.chatgpt.demoChat(state.assignment);

            const prompt = determineTasksPrompt(state.assignment);

            const clientResponse: any = await state.chatgptClient.createChatCompletion(prompt)
    
            state.terminal.print("CHATGPT RESPONSE!!")
            state.terminal.print(clientResponse.data.choices);

            const choices = clientResponse.data.choices;

            if (choices.length !== 1) {
                this._status = rc.ERROR;
                return;
            }

            const response = choices[0].message.content;

            const codeBlocks = parseCodeBlocks(response);

            const tasks: BetterTask[] = codeBlocks.filter(block => block.language === "json")
                .map(block => {
                    const taskJson = JSON.parse(block.code);

                    return ({
                        type: taskJson.type,
                        filename: taskJson.filename,
                        packages: taskJson.packages,
                        dependencies: taskJson.dependencies
                    })

                    // if (["RUN_COMMAND"].includes(taskJson.ACTION)) {
                    //     return ({
                    //         type: taskJson.ACTION,
                    //         commands: taskJson.COMMANDS
                    //     })
                    // } else if (["CREATE_FILE", "EDIT_FILE"].includes(taskJson.ACTION)) {
                    //     return ({
                    //         type: taskJson.ACTION,
                    //         category: taskJson.TYPE,
                    //         filename: taskJson.NAME,
                    //         controllerEndpoint: taskJson.ENDPOINT,
                    //         modelSchema: taskJson.SCHEMA
                    //     })
                    // } else {
                    //     throw new Error()
                    // }
                })

            tasks.forEach((task, index) => {
                console.log(`${index + 1}.) ${[...Object.values(task)]}`);
            })

            console.log(tasks);
    
            state.tasks = tasks;
    
            this._status = rc.RUNNING;

            return;
        }

        this._status = rc.FAILURE;
    }

    parseResponse(response: string): Task[] {
        return []
    }

}

    // const tasks: Task[] = [
    //     {
    //         type: "CREATE_PROJECT",
    //         details: {
    //             command: "npm init -y"
    //         }
    //     },
    //     {
    //         type: "CREATE_FILE",
    //         details: {
    //             type: "MAIN",
    //             filename: "index.js",
    //         }
    //     },
    //     {
    //         type: "CREATE_FILE",
    //         details: {
    //             type: "CONTROLLER",
    //             filename: "EmployeeController.js",
    //             controllerEndpoint: "/employees"
    //         }
    //     },
    //     {
    //         type: "CREATE_FILE",
    //         details: {
    //             type: "SERVICE",
    //             filename: "EmployeeService.js",
    //         }
    //     },
    //     {
    //         type: "CREATE_FILE",
    //         details: {
    //             type: "MODEL",
    //             filename: "Employee.js",
    //             modelSchema: {
    //                 first_name: "string",
    //                 last_name: "string",
    //                 salary: "number",
    //             }
    //         }
    //     },
    // ]
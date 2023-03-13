import { ResultCode, rc } from "blueshell";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";
import { AgentAction } from "./AgentAction";
import fs from 'fs'
import { parseCodeBlocks } from "../util/Util";
import { BetterTask, TaskCommand, TaskFile } from "../core/Task";
import generateCodePrompt from '../clients/chatgpt/prompts/GenerateCodePrompt'

import generateCodeV2Prompt from '../clients/chatgpt/prompts/GenerateCodeV2Prompt'

const completeCreateFileTask = async (task: BetterTask, state: AgentState) => {
    const userMessage = `\`\`\`json
    ${JSON.stringify(task, null, 2)}
    \`\`\``

    if (state.assignment === null) {
        throw new Error()
    }

    const prompt = generateCodeV2Prompt(state.assignment, task);//generateCodePrompt(userMessage)

    console.log(`User:\n${prompt[prompt.length - 1].content}`)

    const clientResponse: any = await state.chatgptClient.createChatCompletion(prompt);

    state.terminal.print("CHATGPT RESPONSE!!")

    const choices = clientResponse.data.choices;

    //state.terminal.print(choices)

    if (choices.length !== 1) {
        throw new Error()
    }

    const response = choices[0].message.content;

    console.log(response);

    const codeBlocks = parseCodeBlocks(response);

    //console.log(codeBlocks);

    if (codeBlocks.length !== 1) {
        throw new Error();
    }

    const fileContents = codeBlocks[0].code;

    console.log(fileContents);

    state.workspace.writeFile(task.filename, fileContents);
}

const completeRunCommandTask = async (task: TaskCommand, state: AgentState) => {
    task.commands.forEach(command => {
        console.log(`Running '${command}'...`);
        state.workspace.runCommand(command)
    });
}

export class CompleteNextTaskAction extends AgentAction {

    constructor(name: string) {
        super(name);
    }

    protected activate(state: AgentState, event: AgentEvent): ResultCode {
        
        super.activate(state,event);

        this._promise = this.completeNextTask(state);

        return this.status!;

    }

    private async completeNextTask(state: AgentState) {

        const currentTasks = state.tasks;

        const nextTask = currentTasks.shift();

        if (nextTask === undefined) {
            this._status = rc.ERROR;
            return;
        }

        try {
            await completeCreateFileTask(nextTask, state)

            // switch (nextTask.type) {
            //     case "CREATE_FILE": 
            //         await completeCreateFileTask(nextTask, state); break;
            //     case "EDIT_FILE": 
            //         await completeCreateFileTask(nextTask, state); break;
            //     case "RUN_COMMAND": 
            //         await completeRunCommandTask(nextTask, state); break;
            // }
        } catch (e) {
            this._status = rc.ERROR;
            return;
        }
        
        state.tasks = currentTasks;

        if (state.assignment !== null && state.tasks.length === 0) {
            state.assignment = null;
        }

        this._status = rc.RUNNING

    }



}
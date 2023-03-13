import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";
import { AgentWorkspace } from "../core/AgentWorkspace";
import { TaskCommand, TaskFile } from "../core/Task";

const isProjectCreated = (workspace: AgentWorkspace) => {
    return workspace.isFileCreated('./package.json')
}

export default (state: AgentState, event: AgentEvent): boolean => {
    const nextTask = state.tasks[0];
    return true;
}
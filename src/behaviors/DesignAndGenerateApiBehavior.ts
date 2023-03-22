import {
    LatchedSelector, 
    LatchedSequence, 
    Predicate,
    Sequence,
} from "blueshell";

import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";

import { AskForAssignmentAction } from "../actions/AskForAssingmentAction";
import { GenerateDataModelAction } from "../actions/GenerateDataModelAction";
import { GenerateModelFilesAction } from "../actions/GenerateModelFilesAction";
import { GenerateServiceFilesAction } from "../actions/GenerateServiceFilesAction";
import { GenerateControllerFilesAction } from "../actions/GenerateControllerFilesAction";
import { GenerateMainFileAction } from "../actions/GenerateMainFileAction";
import { GenerateProjectAction } from "../actions/GenerateProjectAction";

const behaviorTree = new LatchedSelector<AgentState, string>(
    'DesignAndGenerateApi',
    [
        new Sequence<AgentState, AgentEvent>(
            'GetAssignment',
            [
                new Predicate("HasNoAssignment", (state, event) => state.assignment === null),
                new AskForAssignmentAction("AskForAssignment1")
            ]
        ),
        new Sequence<AgentState, AgentEvent>(
            'DesignDataModels',
            [
                new Predicate("HasNoDataModels", (state, event) => state.workspace.dataModel.length === 0),
                new GenerateDataModelAction("GenerateDataModels"),
            ]
        ),
        new LatchedSequence<AgentState, AgentEvent>(
            'GenerateCode',
            [
                new Predicate("NoProjectExists", (state, event) => !state.workspace.isGenerated),
                new GenerateModelFilesAction("GenerateModelFiles"),
                new GenerateServiceFilesAction("GenerateServiceFiles"),
                new GenerateControllerFilesAction("GenerateControllerFiles"),
                new GenerateMainFileAction("GenerateMainFile"),
                new GenerateProjectAction("GenerateProjectAction")
            ]
        ),
    ]
)

export default behaviorTree;
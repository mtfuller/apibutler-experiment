import { Condition, Decorator, LatchedSelector, LatchedSequence, Predicate, Selector, Sequence, decorators, SideEffect } from "blueshell";
import { RepeatWhen } from "blueshell/dist/lib/nodes/decorators";
import { AgentAction } from "../actions/AgentAction";
import { AskForAssignmentAction } from "../actions/AskForAssingmentAction";
import { CompleteNextTaskAction } from "../actions/CompleteNextTaskAction";
import { DetermineTasksFromAssignmentAction } from "../actions/DetermineTasksFromAssignmentAction";
import { GenerateDataModelAction } from "../actions/GenerateDataModelAction";
import { ResolveUnprocessableTaskAction } from "../actions/ResolveUnprocessableTaskAction";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";


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
                new Predicate("HasNoDataModels", (state, event) => state.dataModels.length === 0),
                new GenerateDataModelAction("GenerateDataModels"),
                new GenerateModelFiles("GenerateModelFiles")

            ]
        ),
        // new Sequence<AgentState, AgentEvent>(
        //     'GenerateServiceFiles',
        //     [
        //         new Predicate("HasNoDataModels", (state, event) => state.dataModels.length === 0),
        //         new Generate("GenerateDataModels")
        //     ]
        // ),
        // new Sequence<AgentState, AgentEvent>(
        //     'GenerateProject',
        //     [
        //         new Predicate("ProjectIsNotGenerated", (state, event) => !state.workspace.isGenerated),
        //         new GenerateServiceFiles("GenerateServiceFiles"),
        //         new GenerateControllerFiles("GenerateControllerFiles"),
        //         new GenerateMainFile("GenerateMainFile"),
        //         new GenerateProject("GenerateProject")
        //     ]
        // )
    ]
)

// 

export default behaviorTree;
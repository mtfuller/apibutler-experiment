import { Condition, Decorator, LatchedSelector, LatchedSequence, Predicate, Selector, Sequence, decorators, SideEffect } from "blueshell";
import { RepeatWhen } from "blueshell/dist/lib/nodes/decorators";
import { AgentAction } from "../actions/AgentAction";
import { AskForAssignmentAction } from "../actions/AskForAssingmentAction";
import { CompleteNextTaskAction } from "../actions/CompleteNextTaskAction";
import { DetermineTasksFromAssignmentAction } from "../actions/DetermineTasksFromAssignmentAction";
import { ResolveUnprocessableTaskAction } from "../actions/ResolveUnprocessableTaskAction";
import { AgentEvent } from "../core/AgentEvent";
import { AgentState } from "../core/AgentState";


const behaviorTree = new LatchedSelector<AgentState, string>(
    'AgentBehavior',
    [
        new Sequence<AgentState, AgentEvent>(
            'GetAssignment',
            [
                new Predicate("HasNoAssignment", (state, event) => state.assignment === null),
                new AskForAssignmentAction("AskForAssignment1")
            ]
        ),
        new Sequence<AgentState, AgentEvent>(
            'GenerateTasks',
            [
                new Predicate("HasNoTasks", (state, event) => state.tasks.length === 0),
                new DetermineTasksFromAssignmentAction("DetermineTasksFromAssignment1")
            ]
        ),
        new LatchedSequence<AgentState, AgentEvent>(
            'WorkOnTasks',
            [
                new Selector<AgentState, AgentEvent>(
                    'FixTasks',
                    [
                        new Predicate("NextTaskIsProcessable", (state, event) => true),
                        new ResolveUnprocessableTaskAction("ResolveUnprocessableTask"),
                    ]
                ),
                new CompleteNextTaskAction("CompleteNextTask"),
            ]
        ),
    ]
)

export default behaviorTree;
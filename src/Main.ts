import { AgentEnvironment } from "./core/AgentEnvironment";
import { AgentState } from "./core/AgentState";
import agentBehavior from './behaviors/DesignAndGenerateApiBehavior';
import { ChatGPT } from "./clients/ChatGPT"
import { Terminal } from "./util/Terminal";
import { AgentWorkspace } from "./core/AgentWorkspace";
import ChatGPTClient from "./clients/chatgpt/Index";

async function main() {
    const agentState = new AgentState(new ChatGPTClient(), new Terminal(), new AgentWorkspace("./_playground"));
    agentState.debug = true;

    const environment = new AgentEnvironment("MyEnvironment", agentBehavior, agentState);

    environment.launch();
}

main();
import { AgentEnvironment } from "./core/AgentEnvironment";
import { AgentState } from "./core/AgentState";
import agentBehavior from './behaviors/DesignAndGenerateApiBehavior';
import { Terminal } from "./util/Terminal";
import { AgentWorkspace } from "./core/AgentWorkspace";
import ChatGPTClient from "./clients/chatgpt/Index";
import figlet from 'figlet';
import { Command } from 'commander';
import chalk from 'chalk';
import { LogFile } from "./util/LogFile";
import { WorkspaceTemplate } from "./core/WorkspaceTemplate";

const packageJson = require('../package.json');

const program = new Command();

console.log(chalk.cyanBright(figlet.textSync("APIButler", {
    font: 'Slant'
})));

program
  .version(packageJson.version)
  .description("AI-powered CLI tool used to generate API projects.")
  .argument('<filepath>', 'The filepath of the project')
  .action(async (filepath) => {
    const agentState = new AgentState(new ChatGPTClient(), new Terminal(), new AgentWorkspace(filepath), new LogFile(), new WorkspaceTemplate("./templates/express-node-api"));

    const environment = new AgentEnvironment("MyEnvironment", agentBehavior, agentState);

    environment.launch();
  })
  .parse(process.argv);
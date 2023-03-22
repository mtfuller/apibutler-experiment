import chalk from 'chalk';
import ora, { Ora } from 'ora';
import readline from 'readline';

export class Terminal {
    spinner: Ora | null = null;

    constructor() {

    }

    async print(message: string): Promise<void>  {
        console.log(message);
    }

    async displayMessageFromAPIButler(message: string, delayInMillis: number = 0): Promise<void>  {
        const apiButlerMessage = chalk.cyanBright(`\nAPIButler:\n${message}\n`)

        console.log(apiButlerMessage);

        await new Promise(r => setTimeout(r, delayInMillis));
    }

    startSpinner(message: string) {
        console.log();

        if (this.spinner === null) {
            this.spinner = ora(message)
        }

        this.spinner.clear().start(message)
    }

    stopSpinner(message: string) {
        if (this.spinner !== null) {
            this.spinner.stopAndPersist({
                text: message,
                prefixText: "✅"
            })
        }
    }

    async prompt(message: string): Promise<string> {
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        await this.displayMessageFromAPIButler(message);

        const promptMessage = `User:\n`

        return new Promise<string>((resolve, reject) => {
            rl.question(promptMessage, answer => {
                rl.close();
                resolve(answer);
            })
        })
    }
    
}
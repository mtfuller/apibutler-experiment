import readline from 'readline';

export class Terminal {


    async print(message: string): Promise<void>  {
        console.log(message);
    }

    async prompt(message: string): Promise<string> {
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise<string>((resolve, reject) => {
            rl.question(message, answer => {
                rl.close();
                resolve(answer);
            })
        })
    }
}
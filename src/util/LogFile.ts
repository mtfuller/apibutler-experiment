import fs from 'fs';

export class LogFile {
    filename: string

    constructor() {
        this.filename = `${Date.now()}_chatgpt_logs.txt`
    }

    write(data: string) {
        fs.appendFileSync(this.filename, data);
    }
}
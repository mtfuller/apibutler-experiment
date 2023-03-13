import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const whitelistedCommands = [
    "npm install",
    "npm init"
]

export type FileType = "MODEL" | "CONTROLLER" | "SERVICE" | "DB" | "MAIN"

export interface WorkspaceFile {
    type: FileType
    filename: string
    packages: string[]
    dependencies: string[]
    content: string | undefined
}

export interface WorkspaceModel extends WorkspaceFile {
    type: "MODEL"
    schema: object
}

export class AgentWorkspace {
    path: string
    isGenerated: boolean = false;
    workspaceFiles: WorkspaceFile[] = []


    constructor(path: string) {
        this.path = path;
        //console.log(this.runCommand("npm init -y"))
    }

    addWorkspaceFile(workspaceFile: WorkspaceFile) {
        this.workspaceFiles.push(workspaceFile);
    }



    writeFile(relpath: string, contents: string) {
        const targetPath = path.join(this.path, relpath);

        fs.writeFileSync(targetPath, contents);
    }

    readFile(relpath: string): string {
        const targetPath = path.join(this.path, relpath);

        return fs.readFileSync(targetPath, 'utf-8');
    }

    isFileCreated(relpath: string): boolean {
        const targetPath = path.join(this.path, relpath);

        return fs.existsSync(targetPath);
    }

    runCommand(command: string): string {
        const results = execSync(command, { cwd: this.path });

        return results.toString();
    }
}
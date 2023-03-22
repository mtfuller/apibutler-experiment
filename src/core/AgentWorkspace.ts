import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export type FileType = "MODEL" | "CONTROLLER" | "SERVICE" | "DB" | "MAIN"

export interface WorkspaceFile {
    type: FileType
    isGenerated: boolean 
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
    filepath: string
    isGenerated: boolean = false
    dataModel: WorkspaceModel[] = []
    workspaceFiles: WorkspaceFile[] = []


    constructor(filepath: string) {
        this.filepath = path.resolve(filepath);
    }

    addDataModel(workspaceModel: WorkspaceModel) {
        this.dataModel.push(workspaceModel);
    }

    addWorkspaceFile(workspaceFile: WorkspaceFile) {
        this.workspaceFiles.push(workspaceFile);
    }

    writeFile(relpath: string, contents: string) {
        const targetPath = path.join(this.filepath, relpath);

        fs.writeFileSync(targetPath, contents);
    }

    readFile(relpath: string): string {
        const targetPath = path.join(this.filepath, relpath);

        return fs.readFileSync(targetPath, 'utf-8');
    }

    isFileCreated(relpath: string): boolean {
        const targetPath = path.join(this.filepath, relpath);

        return fs.existsSync(targetPath);
    }

    runCommand(command: string): string {
        const results = execSync(command, { cwd: this.filepath });

        return results.toString();
    }
}
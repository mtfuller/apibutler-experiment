export type TaskType = "CREATE_FILE" | "EDIT_FILE" | "RUN_COMMAND";

export type FileType = "MAIN" | "CONTROLLER" | "SERVICE" | "MODEL" | "DB_CONFIG" | "DOCKERFILE" | "DOCKER_COMPOSE";

// export interface Task {
//     type: TaskType,
//     details: TaskFile | TaskCommand,
// }

// export interface TaskFile {
//     filename: string,
//     type: FileType,
//     controllerEndpoint?: string,
//     modelSchema?: object,
// }

// export interface TaskCommand {
//     command: string,
//     packages?: string[] 
// }

// export interface Task {
//     type: TaskType
// }

export interface TaskFile {
    type: "CREATE_FILE" | "EDIT_FILE"
    category: FileType
    filename: string
    controllerEndpoint?: string
    modelSchema?: object
}

export interface TaskCommand {
    type: "RUN_COMMAND"
    commands: string[]
}

export interface BetterTask {
    type: FileType
    filename: string
    packages: string[]
    dependencies: string[]
}

export type Task = TaskFile | TaskCommand;


/* 
CREATE_PROJECT: ['npm init -y']
INSTALL_DEPS: ['npm install express']
CREATE_FILE: ['MAIN', 'writeFile()']
CREATE_FILE: ['CONTROLLER', 'writeFile()']
CREATE_FILE: ['SERVICE', 'writeFile()']
CREATE_FILE: ['MODEL', 'writeFile()']
EDIT_FILE: ['readFile()', 'MAIN', 'writeFile()']
EDIT_FILE: ['readFile()', 'CONTROLLER', 'writeFile()']
EDIT_FILE: ['readFile()', 'SERVICE', 'writeFile()']
EDIT_FILE: ['readFile()', 'MODEL', 'writeFile()']
*/
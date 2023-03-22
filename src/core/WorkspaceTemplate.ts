import { parse, stringify } from 'yaml'
import path from 'path';
import fs from 'fs';

const mapAllValues = (obj: any, func: (x: any) => any) => {
    const newObj1 = Object.assign({}, obj)

    Object.entries(obj).map(entry => {
        if (Array.isArray(entry[1])) {
            const newArr = [...entry[1]];

            newObj1[entry[0]] = newArr.map(func);
        } else if (typeof entry[1] === "object") {
            const newObj2 = Object.assign({}, entry[1])

            newObj1[entry[0]] = mapAllValues(newObj2, func)
        } else {
            newObj1[entry[0]] = func(entry[1])
        }
    })

    return newObj1;
}

const BLAH = /^\$(?<function>[A-Za-z0-9_]+)\((?<args>.+)?\)$/

export class WorkspaceTemplate {
    templateDir: string
    templateModel: any
    inlineFunctions: any

    constructor(dirpath: string) {
        this.templateDir = path.resolve(dirpath);

        const templateModelYaml = fs.readFileSync(path.join(this.templateDir, 'template.apibutler.yml'))
        this.templateModel = parse(templateModelYaml.toString())

        this.inlineFunctions = {
            readfile: (args: string[]): string => {
                if (args.length !== 1) {
                    throw new Error(`readfile: Expected 1 arg`);
                }
        
                return fs.readFileSync(path.join(this.templateDir, args[0])).toString();
            }
        }

        this.templateModel = mapAllValues(this.templateModel, val => {
            if (typeof val !== "string") return val;

            const inlineFunctionMatches: any = val.match(BLAH);
            if (inlineFunctionMatches !== null) {
                return this.runFunc(inlineFunctionMatches.groups.function, inlineFunctionMatches.groups.args)
            }

            return val;
        })
    }
    
    runFunc = (functionName: string, args: string) => {
        const evaluatedArgs = args.split(",")
            .map(x => eval(x) as string);
    
        if (this.inlineFunctions.hasOwnProperty(functionName)) {
            return this.inlineFunctions[functionName](evaluatedArgs);
        }
    }

    readFile(filepath: string) {
        const templateFilePath = path.join(this.templateDir, filepath);

        return fs.readFileSync(templateFilePath).toString()
    }

    
}
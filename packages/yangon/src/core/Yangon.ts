import type { Client } from "eris";
import { getAllFiles } from "../Utils/getAllFiles";
import { commands } from "../decorators";
import type { CommandBuilder } from "../Commands/Builders/CommandBuilder";

export interface YangonInitOptions {
    commands: string;
    debug?: boolean;
}

export class Yangon {
    client: Client;
    options: YangonInitOptions;
    commands: Map<string, CommandBuilder>

    constructor(client: Client, options: YangonInitOptions) {
        this.client = client;
        this.options = options;

        const allCommandFiles = getAllFiles(options.commands)

        for (const file of allCommandFiles) {
            try {
                new (require(file))
            } catch {
                try {
                    new (require(file).default)
                } catch (error) {
                    throw new Error(`Unable to compile ${file}\n${error}`)
                }
            }
        }

        this.commands = commands
    }
}
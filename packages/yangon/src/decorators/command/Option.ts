import { CommandBuilder } from "../../Commands/Builders/CommandBuilder";
import { StringOption, YangonChoices } from "../../Commands/Options";
import { YangonOptionTypeStrings } from "../../types/types";
import { commands } from "../Cache/CommandMap";
import { YangonChatInputExecuteFunction } from "./Command";

export interface YangonBuildOption {
    type: YangonOptionTypeStrings,
    name: string,
    description: string,
    choices?: YangonChoices<string|number>,
    required?: boolean,
    at: number
}

const FUNCTION_REGEX = /\(.+?\)/gm

export function extractArgs(func: string, at: number) {
    const argsRaw = func.match(FUNCTION_REGEX)
    if(!argsRaw) throw new Error("INVALID FUNCTION")
    
    return argsRaw[0].split(",").map(v => v.trim())[at]
}

export function buildOption(option: YangonBuildOption) {
    switch(option.type) {
        case "StringOption": {
            return new StringOption<false>({
                name: option.name,
                description: option.description,
                required: option.required || false,
                at: option.at,
                choices: option.choices as YangonChoices<string>
            }, undefined)
        }
        default: throw new Error("Invalid")
    }
}

export function Option(description: string, required: boolean) {
    return function(target: { [key: string]: YangonChatInputExecuteFunction }, cmdName: string, deco: number) {
        let command = commands.get(cmdName)

        if(!command) {
            command = new CommandBuilder()
            .setName(cmdName)
        }

        const type = Reflect.getMetadata("design:paramtypes", target, cmdName).name as YangonOptionTypeStrings
        const name = extractArgs(target[cmdName].toString(), deco)

        const option = buildOption({
            name,
            description,
            type,
            required,
            at: deco
        })

        command.addOption(option)
    }
}
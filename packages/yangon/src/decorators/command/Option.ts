import { CommandBuilder } from "../../Commands/Builders/CommandBuilder";
import { BooleanOption, ChannelOption, IntegerOption, MentionableOption, NumberOption, RoleOption, StringOption, UserOption, YangonChoices } from "../../Commands/Options";
import { YangonChatInputExecuteFunctionArgs, YangonOptionTypeStrings } from "../../types/types";
import { commands } from "../Cache/CommandMap";
import { YangonChatInputExecuteFunction } from "./Command";

export interface YangonBuildOption {
    type: YangonOptionTypeStrings,
    name: string,
    description: string,
    choices?: YangonChoices<string|number>,
    required?: boolean,
    at: number,
    min?: number,
    max?: number
}

export type YangonCommandParamsOption = Omit<YangonBuildOption, "name" | "description" | "required" | "at" | "type">

const FUNCTION_REGEX = /\(.+?\)/gm

export function extractArgs(func: string, at: number) {
    const argsRaw = func.match(FUNCTION_REGEX)
    if(!argsRaw) throw new Error("INVALID FUNCTION")
    
    return argsRaw[0].split(",").map(v => v.trim())[at]
}

export type YangonBuildOptionWithChoices<T extends (string|number)> = YangonBuildOption & { choices?: YangonChoices<T> }

export function buildOption(option: YangonBuildOption): YangonChatInputExecuteFunctionArgs<false> {
    if((option.min || option.max) && option.type !== "NumberOption") throw new Error("min or max fields are invalid on types other than NumberOption")
    switch(option.type) {
        case "StringOption":
            return new StringOption<false>(option as YangonBuildOptionWithChoices<string>, undefined)
        case "BooleanOption":
            return new BooleanOption<false>(option, undefined)
        case "ChannelOption":
            return new ChannelOption<false>(option, undefined)
        case "IntegerOption":
            return new IntegerOption<false>(option as YangonBuildOptionWithChoices<number>, undefined)
        case "MentionableOption":
            return new MentionableOption<false>(option, undefined)
        case "NumberOption":
            return new NumberOption<false>(option as YangonBuildOptionWithChoices<number>, undefined)
        case "RoleOption":
            return new RoleOption<false>(option, undefined)
        case "UserOption":
            return new UserOption<false>(option, undefined)
        default: throw new Error("Invalid")
    }
}

export function Option(description: string, required: boolean, options?: YangonCommandParamsOption) {
    return function(target: { [key: string]: YangonChatInputExecuteFunction }, cmdName: string, deco: number) {
        let command = commands.get(cmdName)

        if(!command) {
            command = new CommandBuilder()
            .setName(cmdName)
        }

        const type = Reflect.getMetadata("design:paramtypes", target, cmdName)[deco].name as YangonOptionTypeStrings
        const name = extractArgs(target[cmdName].toString(), deco)

        const option = buildOption({
            name,
            description,
            type,
            required,
            at: deco,
            ...(options)
        })

        command.addOption(option)
    }
}
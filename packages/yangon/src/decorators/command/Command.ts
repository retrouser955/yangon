import type { CommandInteraction } from "eris";
import type { YangonChatInputArgs } from "../../types/types";
import { commands } from "../Cache/CommandMap";
import { CommandBuilder } from "../../Commands/Builders/CommandBuilder";
import { BaseCommandOption } from "../../Commands/Options";

export type YangonChatInputExecuteFunction = (ctx: CommandInteraction, ...args: any[]) => any;
export type YangonChatInputExecuteFunctionCompiled = (ctx: CommandInteraction) => any;

export function Command(description: string) {
    return function(
        target: any,
        commandName: string,
        deco: TypedPropertyDescriptor<YangonChatInputExecuteFunction>
    ) {
        const originalFn = target[commandName] as YangonChatInputExecuteFunction
        if(!originalFn) throw new Error("Something went wrong")

        let command = commands.get(commandName)

        if(!command) {
            command = new CommandBuilder()
            .setName(commandName)
        }

        command.setDescription(description)

        const compiledFn: YangonChatInputExecuteFunctionCompiled = (ctx) => {
            if(ctx.data.options) {
                const allOptions = commands.get(ctx.data.name)!.options

                const commandOptions = Array.from(allOptions.values()).sort((a, b) => {
                    return a.at - b.at
                }).map(v => {
                    const opt = ctx.data.options?.find((opt) => opt.name === v.name)
                    if(opt) {
                        return BaseCommandOption.from(opt as YangonChatInputArgs)
                    } else {
                        return undefined
                    }
                })
                originalFn(ctx, ...commandOptions)
            } else {
                originalFn(ctx)
            }
        }

        command.setFunction(compiledFn)

        commands.set(commandName, command)

        deco.value = compiledFn
    }
}

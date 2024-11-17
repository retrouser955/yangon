import type { CommandInteraction } from "eris";
import type { YangonChatInputArgs, YangonChatInputExecuteFunctionArgs } from "../../types/types";
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

                const commandOptions = ctx.data.options.sort((a, b) => {
                    const aOrigin = allOptions.get(a.name)!
                    const bOrigin = allOptions.get(b.name)!

                    return aOrigin.at! - bOrigin.at!
                }).map((v) => BaseCommandOption.from(v as YangonChatInputArgs)) as YangonChatInputExecuteFunctionArgs<true>[]
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
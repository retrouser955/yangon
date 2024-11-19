import type { ApplicationCommandOptionsBoolean, ApplicationCommandOptionsChannel, ApplicationCommandOptionsInteger, ApplicationCommandOptionsMentionable, ApplicationCommandOptionsNumber, ApplicationCommandOptionsRole, ApplicationCommandOptionsString, ApplicationCommandOptionsUser, Client } from "eris";
import { CommandInteraction, Constants } from "eris";
import { getAllFiles } from "../Utils/getAllFiles";
import { commands } from "../decorators";
import type { CommandBuilder } from "../Commands/Builders/CommandBuilder";
import { BooleanOption, ChannelOption, IntegerOption, MentionableOption, NumberOption, RoleOption, StringOption, UserOption } from "../Commands/Options";

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
        this.client.once("ready", () => {
            const iter = Object.values(Object.fromEntries(this.commands.entries()))
            for (const command of iter) {
                console.log(`[YANGON] CREATING COMMAND: ${command.name}`)
                client.createCommand({
                    name: command.name!,
                    description: command.description!,
                    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
                    options: Object.values(Object.fromEntries(command.options.entries())).map((v) => {
                        const defaultOption = {
                            name: v.name,
                            description: v.description,
                            required: v.required
                        }
                        if (v instanceof StringOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.STRING
                        } satisfies ApplicationCommandOptionsString

                        if (v instanceof BooleanOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.BOOLEAN
                        } as unknown as ApplicationCommandOptionsBoolean

                        if (v instanceof ChannelOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.CHANNEL,
                            channel_types: v.channelTypes || undefined
                        } satisfies ApplicationCommandOptionsChannel

                        if (v instanceof IntegerOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.INTEGER
                        } satisfies ApplicationCommandOptionsInteger

                        if (v instanceof MentionableOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.MENTIONABLE
                        } as unknown as ApplicationCommandOptionsMentionable

                        if (v instanceof NumberOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.NUMBER,
                            // @ts-expect-error
                            min_value: v.min,
                            // @ts-expect-error
                            max_value: v.max
                        } satisfies ApplicationCommandOptionsNumber

                        if (v instanceof RoleOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.ROLE
                        } as unknown as ApplicationCommandOptionsRole

                        if (v instanceof UserOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.USER
                        } as unknown as ApplicationCommandOptionsUser

                        throw new Error("ERR_INVALID_TYPE")
                    })
                })
            }
        })

        // event listener
        this.client.on("interactionCreate", (ctx) => {
            if (ctx instanceof CommandInteraction) {
                return void this.__handleChatInput(ctx)
            }
        })
    }

    __handleChatInput(ctx: CommandInteraction) {
        const cmd = this.commands.get(ctx.data.name)
        if (!cmd) return // TODO: Emit command not found to the event listener
        cmd.execute!(ctx)
    }
}
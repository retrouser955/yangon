import type { ApplicationCommandOptionsBoolean, ApplicationCommandOptionsChannel, ApplicationCommandOptionsInteger, ApplicationCommandOptionsMentionable, ApplicationCommandOptionsNumber, ApplicationCommandOptionsRole, ApplicationCommandOptionsString, ApplicationCommandOptionsUser, Client } from "eris";
import { Constants } from "eris";
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
        const iter = Object.values(Object.fromEntries(this.commands.entries()))
        for (const command of iter) {
            client.createCommand({
                name: command.name!,
                description: command.description!,
                type: Constants.ApplicationCommandTypes.CHAT_INPUT,
                options: Object.values(Object.fromEntries(command.options.entries())).map((v) => {
                    const defaultOption = {
                        name: v.name,
                        description: v.description
                    }
                    if(v instanceof StringOption) return {
                        ...defaultOption,
                        type: Constants.ApplicationCommandOptionTypes.STRING
                    } satisfies ApplicationCommandOptionsString

                    if(v instanceof BooleanOption) return {
                        ...defaultOption,
                        type: Constants.ApplicationCommandOptionTypes.BOOLEAN
                    } as unknown as ApplicationCommandOptionsBoolean

                    if(v instanceof ChannelOption) return {
                        ...defaultOption,
                        type: Constants.ApplicationCommandOptionTypes.CHANNEL,
                        channel_types: v.channelTypes || undefined
                    } satisfies ApplicationCommandOptionsChannel

                    if(v instanceof IntegerOption) return {
                        ...defaultOption,
                        type: Constants.ApplicationCommandOptionTypes.INTEGER
                    } satisfies ApplicationCommandOptionsInteger

                    if(v instanceof MentionableOption) return {
                        ...defaultOption,
                        type: Constants.ApplicationCommandOptionTypes.MENTIONABLE
                    } as unknown as ApplicationCommandOptionsMentionable
                    
                    if(v instanceof NumberOption) return {
                        ...defaultOption,
                        type: Constants.ApplicationCommandOptionTypes.NUMBER,
                        // @ts-expect-error
                        min_value: v.min,
                        // @ts-expect-error
                        max_value: v.max
                    } satisfies ApplicationCommandOptionsNumber

                    if(v instanceof RoleOption) return {
                        ...defaultOption,
                        type: Constants.ApplicationCommandOptionTypes.ROLE
                    } as unknown as ApplicationCommandOptionsRole

                    if(v instanceof UserOption) return {
                        ...defaultOption,
                        type: Constants.ApplicationCommandOptionTypes.USER
                    } as unknown as ApplicationCommandOptionsUser

                    throw new Error("ERR_INVALID_TYPE")
                })
            })
        }
    }
}
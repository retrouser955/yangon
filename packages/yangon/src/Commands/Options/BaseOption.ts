import { YangonChatInputArgs } from "../../types/types";
import { Constants } from "eris";
import { UserOption, StringOption, BooleanOption, ChannelOption, IntegerOption, MentionableOption, NumberOption, RoleOption } from "./index";

const { ApplicationCommandOptionTypes } = Constants;

export interface BaseCommandOptions<T extends boolean = true> {
    name: string,
    description: InCommand<T, string>,
    required?: boolean,
    at: InCommand<T, number>
}

export type NotInCommand<T extends boolean, R> = T extends true ? R : void
export type InCommand<T extends boolean, R> = T extends true ? void : R

export class BaseCommandOption<R extends YangonChatInputArgs, T extends boolean = true> {
    name: string;
    description: InCommand<T, string>;
    required: boolean;
    raw: NotInCommand<T, YangonChatInputArgs>
    value: NotInCommand<T, R['value']>;
    at: InCommand<T, number>

    constructor(options: BaseCommandOptions<T>, option: NotInCommand<T, YangonChatInputArgs>) {
        const { name, description, required } = options;
        this.name = name;
        this.description = description;
        this.required = required || false;
        this.raw = option;
        this.value = (option?.value as NotInCommand<T, R['value']>)
        this.at = options.at
    }

    static from(data: YangonChatInputArgs) {
        switch(data.type) {
            case ApplicationCommandOptionTypes.USER:
                return new UserOption<true>({
                    name: data.name,
                    description: undefined,
                    required: true,
                    at: undefined
                }, data)
            case ApplicationCommandOptionTypes.STRING:
                return new StringOption<true>({
                    name: data.name,
                    description: undefined,
                    choices: undefined,
                    at: undefined
                }, data)
            case ApplicationCommandOptionTypes.BOOLEAN:
                return new BooleanOption<true>({
                    name: data.name,
                    description: undefined,
                    at: undefined
                }, data)
            case ApplicationCommandOptionTypes.CHANNEL:
                return new ChannelOption<true>({
                    name: data.name,
                    description: undefined,
                    at: undefined
                }, data)
            case ApplicationCommandOptionTypes.INTEGER:
                return new IntegerOption<true>({
                    name: data.name,
                    description: undefined,
                    at: undefined
                }, data)
            case ApplicationCommandOptionTypes.MENTIONABLE:
                return new MentionableOption<true>({
                    name: data.name,
                    description: undefined,
                    at: undefined
                }, data)
            case ApplicationCommandOptionTypes.NUMBER:
                return new NumberOption<true>({
                    name: data.name,
                    description: undefined,
                    at: undefined
                }, data)
            case ApplicationCommandOptionTypes.ROLE:
                return new RoleOption<true>({
                    name: data.name,
                    description: undefined,
                    at: undefined
                }, data)
            default:
                throw new Error("UNKNOWN TYPE")
        }
    }
}
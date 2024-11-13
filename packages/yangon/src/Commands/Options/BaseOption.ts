import { YangonChatInputArgs } from "../../types/types";
import { Constants } from "eris";
import { UserOption } from "./User";
import { StringOption } from "./String";

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
    value: NotInCommand<T, R>;
    at: InCommand<T, number>

    constructor(options: BaseCommandOptions<T>, option: NotInCommand<T, YangonChatInputArgs>) {
        const { name, description, required } = options;
        this.name = name;
        this.description = description;
        this.required = required || false;
        this.raw = option;
        this.value = option?.value as NotInCommand<T, R>
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
                    required: true,
                    choices: undefined,
                    at: undefined
                }, data)
            default:
                throw new Error("UNKNOWN TYPE")
        }
    }
}
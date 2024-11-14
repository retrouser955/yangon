import { BaseCommandOption, BaseCommandOptions, InCommand, NotInCommand } from "./BaseOption";
import { YangonChatInputArgs } from "../../types/types";

export type YangonChoices<T extends string|number> = ({ name: string, value: T })[]

export interface Choices<R extends (string|number), T extends boolean> extends BaseCommandOptions<T> {
    choices?: InCommand<T, YangonChoices<R>>
}

export class BaseOptionWithChoices<R extends YangonChatInputArgs, Q extends (string|number), T extends boolean = true> extends BaseCommandOption<R, T> {
    constructor(options: Choices<Q, T>, option: NotInCommand<T, R>) {
        super(options, option)
    }

    toString() {
        return String(this.value)
    }
}
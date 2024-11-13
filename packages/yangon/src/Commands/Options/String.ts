import type { InteractionDataOptionsString } from "eris";
import { BaseCommandOption, BaseCommandOptions, InCommand, NotInCommand } from "./BaseOption";

export type YangonChoices<T extends string|number> = ({ name: string, value: T })[]

export interface StringOptionOptions<T extends boolean> extends BaseCommandOptions<T> {
    choices?: InCommand<T, YangonChoices<string>>
}

export class StringOption<T extends boolean = true> extends BaseCommandOption<InteractionDataOptionsString, T> {
    constructor(options: StringOptionOptions<T>, option: NotInCommand<T, InteractionDataOptionsString>) {
        super(options, option)
    }

    toString() {
        return this.value
    }
}
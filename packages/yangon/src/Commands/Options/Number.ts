import type { InteractionDataOptionsNumber } from "eris";
import { BaseOptionWithChoices, Choices } from "./BaseOptionWithChoices";

export interface NumberOptionConstructor<T extends boolean> extends Choices<number, T> {
    min?: number,
    max?: number
}

export class NumberOption<T extends boolean = true> extends BaseOptionWithChoices<InteractionDataOptionsNumber, number, T> {
    min?: number;
    max?: number;

    constructor(options: NumberOptionConstructor<T>, data: ConstructorParameters<typeof BaseOptionWithChoices<InteractionDataOptionsNumber, number, T>>[1]) {
        super(options, data)
        this.min = options.min
        this.max = options.max
    }
}
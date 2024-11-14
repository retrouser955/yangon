import type { InteractionDataOptionsInteger } from "eris";
import { BaseOptionWithChoices } from "./BaseOptionWithChoices";

export class IntegerOption<T extends boolean = true> extends BaseOptionWithChoices<InteractionDataOptionsInteger, number, T> {}
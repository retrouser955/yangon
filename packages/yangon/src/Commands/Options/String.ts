import type { InteractionDataOptionsString } from "eris";
import { BaseOptionWithChoices } from "./BaseOptionWithChoices";

export class StringOption<T extends boolean = true> extends BaseOptionWithChoices<InteractionDataOptionsString, string, T> {}
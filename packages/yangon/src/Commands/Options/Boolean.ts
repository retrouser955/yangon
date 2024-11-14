import type { InteractionDataOptionsBoolean } from "eris";
import { BaseCommandOption } from "./BaseOption";

export class BooleanOption<T extends boolean> extends BaseCommandOption<InteractionDataOptionsBoolean, T> {}
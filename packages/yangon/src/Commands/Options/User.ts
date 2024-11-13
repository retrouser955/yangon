import type { InteractionDataOptionsUser } from "eris";
import { BaseCommandOption } from "./BaseOption";
// shadow class
export class UserOption<T extends boolean = true> extends BaseCommandOption<InteractionDataOptionsUser, T> {}
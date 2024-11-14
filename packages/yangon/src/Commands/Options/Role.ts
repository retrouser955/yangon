import type { InteractionDataOptionsRole } from "eris";
import { BaseCommandOption } from "./BaseOption";
// shadow class
export class RoleOption<T extends boolean = true> extends BaseCommandOption<InteractionDataOptionsRole, T> {}
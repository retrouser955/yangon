import type { InteractionDataOptionsMentionable } from "eris";
import { BaseCommandOption } from "./BaseOption";

export class MentionableOption<T extends boolean> extends BaseCommandOption<InteractionDataOptionsMentionable, T> {}
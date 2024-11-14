import type { InteractionDataOptionsChannel } from "eris";
import { BaseCommandOption } from "./BaseOption";

export class ChannelOption<T extends boolean> extends BaseCommandOption<InteractionDataOptionsChannel, T> {}
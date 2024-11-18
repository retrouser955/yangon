import type { InteractionDataOptionsChannel } from "eris";
import { BaseCommandOption, BaseCommandOptions } from "./BaseOption";
import Eris from "eris";

export interface ChannelOptionConstructor<T extends boolean> extends BaseCommandOptions<T> {
    channelTypes?: Eris.ChannelTypes
}

export class ChannelOption<T extends boolean> extends BaseCommandOption<InteractionDataOptionsChannel, T> {
    channelTypes?: Eris.ChannelTypes
    constructor(options: ChannelOptionConstructor<T>, data: ConstructorParameters<typeof BaseCommandOption<InteractionDataOptionsChannel, T>>[1]) {
        super(options, data)
        this.channelTypes = options.channelTypes
    }
}
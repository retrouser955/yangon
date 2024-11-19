import type { CommandInteraction } from "eris";
import { Command, Option } from "@yangon-framework/shwedagon"
import { StringOption } from "@yangon-framework/core";

export default class SayCommand {
    @Command()
    async say(
        ctx: CommandInteraction,
        @Option()
        content: StringOption
    ) {
        ctx.createMessage(content.value)
    }
}
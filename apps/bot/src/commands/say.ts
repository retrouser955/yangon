import type { CommandInteraction } from "eris";
import { Command, Option } from "@yangon-framework/shwedagon"
import { StringOption } from "@yangon-framework/core";

export default class SayCommand {
    /// Repeat something from the bot
    @Command()
    async say(
        ctx: CommandInteraction,
        /// What content to repeat
        @Option()
        content: StringOption
    ) {

    }
}
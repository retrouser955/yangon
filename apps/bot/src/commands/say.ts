import { Command, Option, StringOption } from "@yangon-framework/core"
import type { CommandInteraction } from "eris";

export default class SayCommand {
    @Command("Hello")
    async say(
        ctx: CommandInteraction,
        @Option("", true)
        content: StringOption
    ) {

    }
}
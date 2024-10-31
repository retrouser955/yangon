import { ChatInputCommandInteraction } from "discord.js";
import { commandMetadataOptionBoolean, command } from "../../lib";

export default class SayCommand {
    @command("Dog or cat?")
    async animal(ctx: ChatInputCommandInteraction) {
        const content = commandMetadataOptionBoolean({
            required: true,
            name: "cat",
            description: "Are you a cat or not"
        })

        const toSay = content ? "😺 I love cats!" : "🐶 Dogs are super cute!"

        ctx.reply(toSay)
    }
}
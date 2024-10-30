import { ChatInputCommandInteraction } from "discord.js";
import { commandMetadataOptionString, command } from "../../lib";

export default class SayCommand {
    @command("Repeat something from the bot")
    async say(ctx: ChatInputCommandInteraction) {
        const content = commandMetadataOptionString({
            required: true,
            name: "content",
            description: "What the bot wants to say"
        })

        await ctx.deferReply()

        const toSay = `${ctx.user.username} 🗣️ | ${content}`

        ctx.followUp(toSay)
    }
}
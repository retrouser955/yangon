import { ChatInputCommandInteraction } from "discord.js";
import { commandMetadataOptionString, command } from "../../lib";

export default class SayCommand {
    @command("Repeat something from the bot")
    async say(ctx: ChatInputCommandInteraction) {
        // No need to create an option in SlashCommandBuilder
        // Discord Chakra will automatically recognize the option and will transpile it into a SlashCommandOptionString
        // On every run, the function will also get the user input so no need to use `interaction.option.getString()` anymore
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
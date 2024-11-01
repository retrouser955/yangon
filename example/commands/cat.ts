import { ChatInputCommandInteraction } from "discord.js";
import { command, commandMetadataOptionString } from "../../lib";

export default class SayCommand {
    @command("Dog or cat?")
    async animal(ctx: ChatInputCommandInteraction) {
        const content = commandMetadataOptionString({
            required: true,
            name: "cat",
            description: "Are you a cat or not",
            choices: [
                {
                    name: "cat",
                    value: "cat"
                },
                {
                    name: "dog",
                    value: "dog"
                }
            ]
        })

        const toSay = content === "cat" ? "😺 I love cats!" : "🐶 Dogs are super cute!"

        ctx.reply(toSay)
    }
}
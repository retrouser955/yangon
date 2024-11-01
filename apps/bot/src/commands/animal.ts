import { command, commandMetadataOptionString } from "discord-chakra";
import { ChatInputCommandInteraction } from "discord.js";

export default class AnimalCommand {
    @command("Which animal do you like")
    animal(ctx: ChatInputCommandInteraction) {
        const animal = commandMetadataOptionString({
            name: "name",
            description: "Name of the animal",
            choices: [
                {
                    name: "cat",
                    value: "cat"
                },
                {
                    name: "dog",
                    value: "dog"
                }
            ],
            required: true
        })

        const toSay = animal === "cat" ? "😺 I love cats too!" : "🐶 Dogs are super cute!"

        ctx.reply(toSay)
    }
}
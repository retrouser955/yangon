import { Yangon } from "@yangon-framework/core";
import { Command } from "@yangon-framework/shwedagon";
import { useDeps } from "@yangon-framework/syringe";
import type { CommandInteraction } from "eris";

export default class HelpCommand {
    /// Send a help menu
    @Command()
    help(ctx: CommandInteraction) {
        const yangon = useDeps(Yangon)
        const commands = Array.from(yangon.commands.values())

        const mapper = commands.map(v => `**${v.name}**\n> ${v.description}\n`)
        const helpDesc = mapper.join("\n")
        ctx.createMessage({
            embeds: [
                {
                    title: "Help!",
                    description: helpDesc,
                    color: 0xff00ff
                }
            ]
        })
    }
}
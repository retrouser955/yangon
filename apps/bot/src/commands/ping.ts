import { command } from "discord-chakra";
import { ChatInputCommandInteraction } from "discord.js";

export default class PingCommand {
    @command("Which animal do you like")
    ping(ctx: ChatInputCommandInteraction) {
        ctx.reply("🏓 Pong! My ping is `" + ctx.client.ws.ping + "ms`")
    }
}
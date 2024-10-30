import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { command } from "../../lib";

export default class PingCommand {
    @command("This is a ping command")
    async ping(ctx: ChatInputCommandInteraction<CacheType>) {
        ctx.reply(`🏓 Pong! My ping is ${ctx.client.ws.ping}`)
    }
}
import { DiscordChakra } from "../lib/index.js";
import path from "node:path"
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

const chakra = new DiscordChakra(client, {
    commands: path.join(__dirname, "commands"),
    debug: true
})

client.on("ready", () => {
    console.log(`${client.user?.username} is ready!`)
})

chakra.registerCommands(process.env.DISCORD_ID!, process.env.DISCORD_TOKEN!)

client.login(process.env.DISCORD_TOKEN!)
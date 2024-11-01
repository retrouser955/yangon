import { Client, GatewayIntentBits } from "discord.js";
import { DiscordChakra } from "discord-chakra"
import path from "node:path"

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

chakra.registerCommands(process.env.ID!, process.env.TOKEN!).then(() => {
    client.login(process.env.TOKEN!)
})
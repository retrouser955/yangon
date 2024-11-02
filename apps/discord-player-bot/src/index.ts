import { Client, GatewayIntentBits } from "discord.js";
import { DiscordChakra } from "discord-chakra"
import { Player } from "discord-player";
import path from "node:path"
import { YoutubeiExtractor } from "discord-player-youtubei";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
})

const player = new Player(client)

const chakra = new DiscordChakra(client, {
    commands: path.join(__dirname, "commands"),
    debug: true,
    context: {
        player
    }
})

client.on("ready", async () => {
    console.log(`${client.user?.username} is ready!`)
    await player.extractors.loadDefault((v) => v !== "YouTubeExtractor")
    await player.extractors.register(YoutubeiExtractor, {
        overrideBridgeMode: "ytmusic"
    })
})

chakra.registerCommands(process.env.ID!, process.env.TOKEN!).then(() => {
    client.login(process.env.TOKEN!)
})
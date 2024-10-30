# Discord Chakra

Discord Chakra is a Discord bot framework based on [discord.js](https://discord.js.org) that aims to eliminate as much boilerplate as possible using Typescript decorators thus, this project only supports TypeScript. If you are looking for a well-maintained framework for JavaScript, I recommend CommandKit and Sapphire.

# Bootstraping your Discord bot

Bootstrapping is extremely easy

```ts
import { DiscordChakra } from "../lib/index.js";
import path from "node:path"
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

const chakra = new DiscordChakra(client, {
    commands: path.join(__dirname, "commands"),
    debug: true // turn this off to avoid discord-chakra from printing to the console
})

// 😎 DiscordChakra automatically load all environment variables
chakra.registerCommands(process.env.DISCORD_ID!, process.env.DISCORD_TOKEN!)

client.login(process.env.DISCORD_TOKEN!)
```

### In your command folder ...

We only need to create a file and add the following code. Discord Chakra will automatically transpile the command and create a command for you!

```ts
// command/ping.ts
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { command } from "discord-chakra";

export default class PingCommand {
    // ⚛️ The command decorator will detect your function name and set it as the slash command name
    // The only required parameter is the description of the slash command
    @command("This is a ping command")
    async ping(ctx: ChatInputCommandInteraction<CacheType>) {
        ctx.reply(`🏓 Pong! My ping is ${ctx.client.ws.ping}`)
    }
}
```

# Regards

* This package is WIP. Expect bugs.
* Since the package uses decorators, you must set `experimentalDecorators` to `true` in your typescript compilerOptions
* Check out the [example bot](./example/) for more examples
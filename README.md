# The Yangon Framework

Yangon is a Discord App framework focused on minmal templating by utilizing TypeScript decorators. Due to decorators being experimental, Yangon only works with TypeScript. If you are looking for a JavaScript based framework, [commandkit](https://commandkit.js.org) and [sapphire](https://sapphirejs.dev) are other well-maintained libraries.

# Bootstraping

Bootstraping Yangon is easy. You can do it in just 5 lines!

```ts
import Eris from "eris";
import { Yangon } from "@yangon-framework/core"
import path from "node:path"

const client = new Eris.Client({
    intents: ["guilds"]
})

const yangon = new Yangon(client, {
    commands: path.join(__dirname, "commands"),
    debug: true/* Set this to false to disallow Yangon to print to the terminal */
})

client.on("ready", () => {
    console.log("ready!")
})

// Yangon will automatically load environment files for you!
yangon.registerCommands(process.env.ID!, process.env.TOKEN!).then(() => {
    client.login(process.env.TOKEN!)
})
```

### In your commands folder

```ts
// commands/ping.ts
import { Command } from "@yangon-framework/core";
import { CommandInteraction } from "eris";

export default class PingCommand {
    // The decorator will detect the function's name and automatically build the command accordingly
    // The only requried parameter of the decorator is the description
    @Command("Check the ping of the bot")
    ping(ctx: CommandInteraction) {
        ctx.reply("🏓 Pong! My ping is `" + ctx.client.ws.ping + "ms`")
    }
}
```

### But what if I want options?

Easy! Yangon provides you with yet another decorator `@Option` which automatically registers the function parameter as the option on the slash command. This is taken as an inspiration from [poise](https://github.com/serenity-rs/poise), a Rust Discord bot framework making use of Macros.

```ts
// commands/say.ts
import { Command, Option, StringOption } from "@yangon-framework/core";
import { CommandInteraction } from "eris";

export default class SayCommand {
    @Command("Get the bot to repeat something")
    say(
        ctx: CommandInteraction,
        @Option("What you would want the bot to say") // automatically register the option
        content: StringOption
    ) {
        ctx.createMessage(content.value)
    }
}
```
# Discord Chakra

Discord Chakra is a Discord App framework focused on minmal templating by utilizing TypeScript decorators. Due to decorators being experimental, Discord Chakra only works with TypeScript. If you are looking for a JavaScript based framework, [commandkit](https://commandkit.js.org) and [sapphire](https://sapphirejs.dev) are other well-maintained libraries.

# Bootstraping

Bootstraping Discord Chakra is easy. You can do it in just 5 lines!

```ts
import { Client, GatewayIntentBits } from "discord.js";
import { DiscordChakra } from "discord-chakra"
import path from "node:path"

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

const chakra = new DiscordChakra(client, {
    commands: path.join(__dirname, "commands"),
    debug: true/* Set this to false to disallow Discord Chakra to print to the terminal */
})

client.on("ready", () => {
    console.log(`${client.user?.username} is ready!`)
})

// Discord Chakra will automatically load environment files for you!
chakra.registerCommands(process.env.ID!, process.env.TOKEN!).then(() => {
    client.login(process.env.TOKEN!)
})
```

### In your commands folder

```ts
// commands/ping.ts
import { command } from "discord-chakra";
import { ChatInputCommandInteraction } from "discord.js";

export default class PingCommand {
    // The decorator will detect the function's name and automatically build the command accordingly
    // The only requried parameter of the decorator is the description
    @command("Check the ping of the bot")
    ping(ctx: ChatInputCommandInteraction) {
        ctx.reply("🏓 Pong! My ping is `" + ctx.client.ws.ping + "ms`")
    }
}
```

### But what if I want options?

Easy! Discord Chakra's `@command` decorator does more than just checking the name of your command! It also check your function for any **special** 'functions' that allows you to register and get the option of the slash command. The names of the function are a bit unpleasent as we had to make it as specific as possible for the detection to work. Let's have a look at a command that replies with a string based on user input.

```ts
// commands/animal.ts
import { command, commandMetadataOptionString } from "discord-chakra";
import { ChatInputCommandInteraction } from "discord.js";

export default class AnimalCommand {
    @command("Which animal do you like")
    animal(ctx: ChatInputCommandInteraction) {
        // The tokenizer will detect that this function is being used and will automatically register the option
        // As a bonus, it also elimanates the use of <ChatInputCommandInteraction>.options.getString()
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
```
import { Client } from "eris";
import { config } from "dotenv";
import { Yangon } from "@yangon-framework/core"
import { injector } from "@yangon-framework/syringe"
import { join } from "path";

config()

const client = injector(Client, `Bot ${process.env.TOKEN}`, {
    intents: ['guilds']
})

injector(Yangon, client, {
    commands: join(__dirname, "commands")
})

client.once("ready", () => {
    console.log(`${client.user.username} is ready!`)
})

client.connect()
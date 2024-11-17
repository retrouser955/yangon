import { Client } from "eris";
import { config } from "dotenv";
import { Yangon } from "@yangon-framework/core"
import { injector } from "@yangon-framework/syringe"
import { join } from "path";

config()

const client = injector(Client, `Bot ${process.env.TOKEN}`, {
    intents: ['guilds']
})

const frameowrk = injector(Yangon, client, {
    commands: join(__dirname, "commands")
})

console.log(frameowrk.commands)
import { ChatInputCommandInteraction, Client, REST, Routes } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { DecoReturnType, getAllCommandData } from "./decorators/Command";
import { provideInteraction } from "./hooks/useChatInput";
import { config } from "dotenv";
import { transformToBuilders } from "./transformers/toSlashCommandBuilder";
import { getAllFilesInDir } from "./utils";

export type ChakraInitOptions = {
    commands: string;
    debug?: boolean;
}

export class DiscordChakra {
    allCommandsFmt: SlashCommandBuilder[]
    allCommands: DecoReturnType[] = []
    commandMap = new Map<string, (ctx: ChatInputCommandInteraction) => any>()
    client: Client
    options: ChakraInitOptions

    debug(message: string) {
        if(this.options.debug) console.log(message)
    }

    constructor(client: Client, options: ChakraInitOptions) {
        this.client = client
        this.options = options

        this.debug("🕛 Loading environment files")
        config()
        this.debug("📦 Loaded environment files")

        this.debug("🕛 Compiling files ...")

        for(const command of getAllFilesInDir(options.commands)) {
            this.debug(`🗃️  Building ${command}`)
            try {
                // @ts-expect-error
                new require(command)
            } catch {
                try {
                    // @ts-expect-error
                    new require(command).default
                } catch (err) {
                    throw new Error(`ERR_INVALID_FILE: Invalid file found. Command with name ${command} is not following the framework's rules`)
                }
            }
            this.debug(`📦 Built ${command}`)
        }
        this.debug("🚚 Packaged all commands")

        this.allCommands = getAllCommandData()
        this.allCommandsFmt = transformToBuilders(this.allCommands, this.commandMap);

        this.handleInteraction()
    }

    async registerCommands(id: string, token: string) {
        const discordApiFormatCommands = this.allCommandsFmt.map((v) => v.toJSON())
        this.debug("🔼 Deploying " + discordApiFormatCommands.length + " command(s) to the Discord API")
        const rest = new REST({ version: "10" }).setToken(token)
        await rest.put(Routes.applicationCommands(id), {
            body: discordApiFormatCommands
        })
        this.debug(`⚛️  Deployed ${discordApiFormatCommands.length} command(s) to the Discord API`)
    }

    interactionHandler(interaction: ChatInputCommandInteraction) {
        const name = interaction.commandName
        
        const command = this.commandMap.get(name)

        if(!command) return interaction.reply("Command not found")

        provideInteraction(interaction, async () => {
            await command(interaction)
            this.debug("⚛️  Command dispatch of " + interaction.commandName + " successful!")
        })
    }

    handleInteraction() {
        this.client.on("interactionCreate", (interaction) => {
            if(interaction instanceof ChatInputCommandInteraction) {
                this.debug(`🗣️  DISCORD API: Got command ${interaction.commandName}. Executing ...`)
                this.interactionHandler(interaction)
            }
        })
    }
}

export * from "./decorators/Command"
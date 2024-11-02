import { AutocompleteInteraction, ChatInputCommandInteraction, Client, REST, Routes } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { DecoReturnType, getAllCommandData } from "./decorators/Command";
import { provideAutocomplete, provideInteraction } from "./hooks/useChatInput";
import { config } from "dotenv";
import { transformToBuilders } from "./transformers/toSlashCommandBuilder";
import { getAllFilesInDir } from "./utils";

export type ChakraInitOptions = {
    commands: string;
    debug?: boolean;
    context?: Record<string, any>;
}

export class DiscordChakra {
    allCommandsFmt: SlashCommandBuilder[]
    allCommands: DecoReturnType[] = []
    commandMap = new Map<string, DecoReturnType>()
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
		    console.log(err)
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

        if(!command) return interaction.reply("Command not found") // TODO: Make this configurable

        provideInteraction({
            interaction,
            context: this.options.context ?? {}
        }, async () => {
            const execute = command.execute
            await execute(interaction)
            this.debug("⚛️  Command dispatch of " + interaction.commandName + " successful!")
        })
    }

    handleInteraction() {
        this.client.on("interactionCreate", (interaction) => {
            if(interaction instanceof ChatInputCommandInteraction) {
                this.debug(`🗣️  DISCORD API: Got command ${interaction.commandName}. Executing ...`)
                this.interactionHandler(interaction)
            } else if (interaction instanceof AutocompleteInteraction) {
                const currentFocused = interaction.options.getFocused(true).name
                const { commandName } = interaction

                const command = this.commandMap.get(commandName)
                
                if(!command) return interaction.respond([]) // TODO: Make this configurable

                provideAutocomplete({
                    context: this.options.context || {}
                }, () => {
                    const executer = command.options.find(v => v.name === currentFocused)
                    if(!executer || !executer.autocompleteHandler) throw new Error("Cannot find autocomplete handler for " + command.name)
                    executer.autocompleteHandler(interaction)
                })
            }
        })
    }
}

export * from "./decorators/Command"
export * from "./hooks/useChatInput"
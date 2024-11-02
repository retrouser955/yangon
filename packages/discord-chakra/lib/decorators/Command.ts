import { APIApplicationCommandOptionChoice, AutocompleteInteraction, SlashCommandBuilder, User, type ChatInputCommandInteraction } from "discord.js";
import { getOptionBool, getOptionNumber, getOptionString, getOptionUser } from "../hooks/useChatInput";
const COMPILER_REGEX = /(\()?commandMetadataOption(String|Number|User|Boolean)(\))?((\s|\n)+)?\(.+?\)/sg
const START_REMOVE_REGEX = /^((\()?commandMetadataOption(String|Number|User|Boolean)(\))?\()/
const TYPE_MATCH_REGEX = /^((\()?commandMetadataOption(String|Number|User|Boolean)(\))?)/
const TSC_BULLSHIT = /0,(\s)?[A-Za-z0-9]+?_[0-9]\./g

export type AllCommandOptionTypeRaw = "STRING" | "NUMBER" | "USER" | "BOOLEAN"

const optionType: Record<string, AllCommandOptionTypeRaw> = {
    commandMetadataOptionString: "STRING",
    commandMetadataOptionNumber: "NUMBER",
    commandMetadataOptionUser: "USER",
    commandMetadataOptionBoolean: "BOOLEAN"
} as const

export type CommandInitOptions = {
    category?: string,
    contexts?: SlashCommandBuilder['contexts'],
    integrationTypes?: SlashCommandBuilder['integration_types']
}

export type ChakraOption = {
    type: AllCommandOptionTypeRaw,
    name: string,
    description: string,
    required: boolean,
    choices?: APIApplicationCommandOptionChoice<string|number>[],
    autocomplete?: boolean,
    autocompleteHandler?: ChakraAutoCompleteHandler
}

export type DecoReturnType = {
    options: ChakraOption[],
    name: string,
    description: string,
    execute: (ctx: ChatInputCommandInteraction) => void | Promise<void>,
    commandOptions?: CommandInitOptions,
    ingerationTypes?: SlashCommandBuilder['integration_types']
    contexts?: SlashCommandBuilder['contexts']
}

const allCommandData: DecoReturnType[] = []

export type ChakraAutoCompleteHandler = (interaction: AutocompleteInteraction) => any

export function autocomplete(...args: [...string[], ChakraAutoCompleteHandler]) {
    const handler = args.pop()
    if(typeof handler !== 'function') throw new SyntaxError("Cannot create an autocomplete handler without a handler function")

    return function(_: any, commandName: string, _deco: TypedPropertyDescriptor<(ctx: ChatInputCommandInteraction) => any>) {
        const cmd = allCommandData.findIndex((v) => v.name === commandName)
        const command = allCommandData[cmd]
        if(!command) throw new SyntaxError("Cannot find the command. Make sure @autocomplete is used before @command")

        for(const option of args) {
            if(typeof option !== "string") throw new SyntaxError("Cannot have multiple handlers")
            const optIndex = command.options.findIndex((v) => v.name === option)
            const opt = command.options[optIndex]
            if(!opt) throw new Error("Unable to find that option. Make sure you are registering it!")
            if(opt.type !== "STRING") throw new Error("Autocomplete is only valid on string type options")

            allCommandData[cmd].options[optIndex].autocompleteHandler = handler
        }
    }
}

export function command(description: string, options?: CommandInitOptions) {
    return function(_: any, name: string, deco: TypedPropertyDescriptor<(ctx: ChatInputCommandInteraction) => any>) {
        let allJsonBasedCommandParamsRaw = deco.value?.toString().replaceAll(TSC_BULLSHIT, "")
        const allJsonBasedCommandParamsMatched = allJsonBasedCommandParamsRaw?.match(COMPILER_REGEX)
        const allJsonBasedCommandParams = allJsonBasedCommandParamsMatched == undefined ? [] : allJsonBasedCommandParamsMatched.map((v) => {
            const matcher = v.match(TYPE_MATCH_REGEX)
            if(!matcher) throw new Error("CANNOT FIND TYPE")
            let key = matcher[0].startsWith("(") && matcher[0].endsWith(")") ? matcher[0].substring(1).slice(0, -1) : matcher[0]
	    if(key.endsWith(")")) key = key.slice(0, -1)
            const type = optionType[key] || "UNKNOWN"
            let obj: Record<string, string|boolean|APIApplicationCommandOptionChoice<string|number>[]> = {
                type
            }
            const commandOptionsRaw = v.trim()
                .replace(START_REMOVE_REGEX, "")
                .replace(")", "")
                .split(",")
                .map(v => {
                    const vFixed = v
                    const REGEX_COLON_MATCH = /^[^:]*/g

                    if(vFixed.includes("[")) {
                        const chunks = vFixed.replace(/:((\s|\n)+)?\[/, ":DISCORD_CHAKRA_TOKEN_SPLIT_ARRAY[").split(":DISCORD_CHAKRA_TOKEN_SPLIT_ARRAY[")
                        const formatted = chunks.map((arr) => {
                            const matched = arr.match(REGEX_COLON_MATCH)
                            if(!matched) return arr

                            if(matched[0].trim().startsWith("{")) {
                                return `{"${matched[0].trim().replace("{", "").trim()}"${arr.replace(matched[0], "")}`
                            } else {
                                return `"${matched[0].trim()}"${arr.replace(matched[0], "")}`
                            }
                        }).join(":[")

                        return formatted
                    }

                    const match = vFixed.match(REGEX_COLON_MATCH)
                    if(!match) return vFixed
                    const wordRaw = match[0].trim().includes("[") ? match[0].trim().split('[')[1] : match[0].trim()
                    let word = wordRaw.startsWith("{") ? `{"${wordRaw.replace("{", "").trim()}"${vFixed.trim().replace(wordRaw.trim(), "")}` : `"${wordRaw}"${vFixed.trim().replace(wordRaw, "")}`
                    return word
                })
            
            const commandOptions = commandOptionsRaw.join(",").replaceAll("\n", "")
            
            obj = {
                ...obj,
                ...(JSON.parse(commandOptions))
            }

            return obj
        })
        const returnData: DecoReturnType = {
            options: allJsonBasedCommandParams as Omit<ChakraOption, "autocompleteHandler">[] || [],
            name,
            description,
            execute: deco.value!,
            commandOptions: options,
            contexts: options?.contexts,
            ingerationTypes: options?.integrationTypes
        }

        allCommandData.push(returnData)
    }
}

export function getAllCommandData() {
    return allCommandData
}

export type BaseOption<T extends boolean = boolean> = {
    name: string,
    description: string
    required?: T
}

export type StringOption<T extends boolean = boolean> = {
    autocomplete?: boolean,
    choices?: APIApplicationCommandOptionChoice<string>[]
} & BaseOption<T>

export type NumberOption<T extends boolean = boolean> = {
    min?: number,
    max?: number
} & BaseOption<T>

export type InteractionOptionReturnData<T extends boolean, R> = T extends true ? R : R | null

export function commandMetadataOptionString<T extends boolean>(options: StringOption<T>): InteractionOptionReturnData<T, string> {
    return getOptionString(options.name, options.required)!
}

export function commandMetadataOptionBoolean<T extends boolean>(option: BaseOption<T>): InteractionOptionReturnData<T, boolean> {
    return getOptionBool(option.name)!
}

export function commandMetadataOptionUser<T extends boolean>(option: BaseOption<T>): InteractionOptionReturnData<T, User> {
    return getOptionUser(option.name)!
}

export function commandMetadataOptionNumber<T extends boolean>(option: NumberOption<T>): InteractionOptionReturnData<T, number> {
    return getOptionNumber(option.name)!
}
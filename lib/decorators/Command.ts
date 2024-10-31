import { APIApplicationCommandOptionChoice, SlashCommandBuilder, User, type ChatInputCommandInteraction } from "discord.js";
import { getOptionBool, getOptionString, getOptionUser } from "../hooks/useChatInput";
const COMPILER_REGEX = /(\()?commandMetadataOption(String|Number|User|Boolean)(\))?((\s|\n)+)?\(.+?\)/sg
const START_REMOVE_REGEX = /^((\()?commandMetadataOption(String|Number|User|Boolean)(\))?\()/
const TYPE_MATCH_REGEX = /^((\()?commandMetadataOption(String|Number|User|Boolean)(\))?)/
const TSC_BULLSHIT = /0,(\s)?[A-Za-z0-9]+?_[0-9]\./g
const RESERVED_WORDS_BOOL = ["true", "false"]

export type AllCommandOptionTypeRaw = "STRING" | "NUMBER" | "USER" | "BOOLEAN"

const optionType: Record<string, AllCommandOptionTypeRaw> = {
    commandMetadataOptionString: "STRING",
    commandMetadataOptionNumber: "NUMBER",
    commandMetadataOptionUser: "USER",
    commandMetadataOptionBoolean: "BOOLEAN"
} as const

export type CommandInitOptions = {
    category?: string,
    context?: SlashCommandBuilder['contexts'],
    integrationTypes?: SlashCommandBuilder['integration_types']
}

export type ChakraOption = {
    type: AllCommandOptionTypeRaw,
    name: string,
    description: string,
    required: boolean
}

export type DecoReturnType = {
    options: ChakraOption[],
    name: string,
    description: string,
    execute: (ctx: ChatInputCommandInteraction) => void | Promise<void>,
    commandOptions?: CommandInitOptions,
    ingerationType?: SlashCommandBuilder['contexts']
    context?: SlashCommandBuilder['contexts']
}

const allCommandData: DecoReturnType[] = []

export function getAllCommandData() {
    return allCommandData
}

export function choices() {}

export function command(description: string, options?: CommandInitOptions) {
    const seen: string[] = []
    return function(_: any, pk: string, deco: TypedPropertyDescriptor<(ctx: ChatInputCommandInteraction) => any>) {
        const name = pk
        let allJsonBasedCommandParamsRaw = deco.value?.toString().replaceAll(TSC_BULLSHIT, "")
        const allJsonBasedCommandParamsMatched = allJsonBasedCommandParamsRaw?.match(COMPILER_REGEX)
        const allJsonBasedCommandParams = allJsonBasedCommandParamsMatched == undefined ? [] : allJsonBasedCommandParamsMatched.map((v) => {
            const matcher = v.match(TYPE_MATCH_REGEX)
            if(!matcher) throw new Error("CANNOT FIND TYPE")
            let key = matcher[0].startsWith("(") && matcher[0].endsWith(")") ? matcher[0].substring(1).slice(0, -1) : matcher[0]
            const type = optionType[key] || "UNKNOWN"
            let obj: Record<string, string|boolean> = {
                type
            }
            const commandOptions = v.trim()
                .replace(START_REMOVE_REGEX, "")
                .replace(")", "")
                .split(",")

            for(const option of commandOptions) {
                const tup = option.split(":")
                const keyRaw = tup[0].replaceAll(/\s|\n|{/g, "")
                const key = keyRaw.startsWith("\"") && keyRaw.endsWith("\"") ? keyRaw.substring(1).slice(0, -1) : keyRaw
                if(RESERVED_WORDS_BOOL.includes(tup[1].trim())) {
                    obj[key] = tup[1].trim() === "true"
                } else {
                    // @ts-expect-error
                    obj[key] = tup[1].match(/".+?"/sg)[0].substring(1).slice(0, -1)
                }
            }

            return obj
        })
        const returnData: DecoReturnType = {
            options: allJsonBasedCommandParams as ChakraOption[] || [],
            name,
            description,
            execute: deco.value!,
            commandOptions: options
        }
        allCommandData.push(returnData)
    }
}

type BaseOption<T extends boolean = boolean> = {
    name: string,
    description: string
    required?: T
}

type StringOption<T extends boolean = boolean> = {
    autocomplete?: boolean;
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
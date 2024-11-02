import { ChakraOption, DecoReturnType } from "../decorators/Command";
import type { APIApplicationCommandOptionChoice, ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandNumberOption, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { SlashCommandBuilder } from "discord.js";

export type SlashCommandOption = 
    SlashCommandNumberOption |
    SlashCommandStringOption |
    SlashCommandUserOption |
    SlashCommandBooleanOption

export function defaultOpt<T extends SlashCommandOption = SlashCommandOption>(option: T, details: ChakraOption): T {
    return (option
        .setName(details.name)
        .setDescription(details.description)
        .setRequired(details.required || false)) as T
}

export function transformString(option: ChakraOption, builder: SlashCommandBuilder) {
    builder.addStringOption(opt => {
        const optDefault = defaultOpt(opt, option)

        if(option.choices)
            optDefault.addChoices(...(option.choices as APIApplicationCommandOptionChoice<string>[]))
        if(option.autocomplete)
            optDefault.setAutocomplete(option.autocomplete)

        return optDefault
    })
}

export function transformUser(option: ChakraOption, builder: SlashCommandBuilder) {
    builder.addUserOption(opt => defaultOpt(opt, option))
}

export type ChakraOptionNumber = {
    min?: number,
    max?: number
} & ChakraOption

export function transformNumber(option: ChakraOptionNumber, builder: SlashCommandBuilder) {
    builder.addNumberOption(opt => {
        const defaultOption = defaultOpt(opt, option)

        if(option.max)
            defaultOption.setMaxValue(option.max)
        if(option.min)
            defaultOption.setMinValue(option.min)

        return defaultOption
    })
}

export function transformBool(option: ChakraOption, builder: SlashCommandBuilder) {
    builder.addBooleanOption(opt => defaultOpt(opt, option))
}

export function transformToBuilders(commands: DecoReturnType[], map: Map<string, (ctx: ChatInputCommandInteraction) => any>) {
    return commands.map((v) => {
        // this is hacky but it saves some startup time so
        map.set(v.name, v.execute)

        const builder = new SlashCommandBuilder()
            .setName(v.name)
            .setDescription(v.description)
        
        if(v.contexts)
            builder.setContexts(v.contexts)
        if(v.ingerationTypes)
            builder.setIntegrationTypes(v.ingerationTypes)

        for (const option of v.options) {
            switch(option.type) {
                case "STRING": {
                    transformString(option, builder)
                    break
                }
                case "BOOLEAN": {
                    transformBool(option, builder)
                    break
                }
                case "USER": {
                    transformUser(option, builder)
                    break;
                }
                case "NUMBER": {
                    transformNumber(option, builder)
                    break;
                }
            }
        }

        return builder
    })
}
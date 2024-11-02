import type { ChatInputCommandInteraction } from "discord.js";
import { AsyncLocalStorage } from "async_hooks"

export type ChakraContextChatInputContext<T> = {
    interaction: ChatInputCommandInteraction,
} & ChakraContext<T>

export type ChakraContext<T> = {
    context: T
}

export const interactionInputProvider = new AsyncLocalStorage<ChakraContextChatInputContext<Record<string, any>>>()
export const interactionAutocompleteProvider = new AsyncLocalStorage<ChakraContext<Record<string, any>>>()

export function provideInteraction(option: ChakraContextChatInputContext<Record<string, any>>, callback: () => void) {
    interactionInputProvider.run(option, () => {
        callback()
    })
}

export function provideAutocomplete(option: ChakraContext<Record<string, any>>, callback: () => void) {
    interactionAutocompleteProvider.run(option, () => {
        callback()
    })
}

export function getContextInteraction() {
    const context = interactionInputProvider.getStore()
    if(!context) throw new Error("INVALID CONTEXT")
        
    return context.interaction
}

export function getOptionString(key: string, required = false) {
    const context = getContextInteraction()
    return context.options.getString(key, required)
}

export function getOptionBool(key: string) {
    const ctx = getContextInteraction()
    return ctx.options.getBoolean(key)
}

export function getOptionUser(key: string) {
    const ctx = getContextInteraction()
    return ctx.options.getUser(key)
}

export function getOptionNumber(key: string) {
    const ctx = getContextInteraction()
    return ctx.options.getNumber(key)
}
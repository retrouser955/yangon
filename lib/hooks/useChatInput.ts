import type { ChatInputCommandInteraction } from "discord.js";
import { AsyncLocalStorage } from "async_hooks"

const interactionProvider = new AsyncLocalStorage<ChatInputCommandInteraction>()

export function provideInteraction(interaction: ChatInputCommandInteraction, callback: () => void) {
    interactionProvider.run(interaction, () => {
        callback()
    })
}

export function getContext() {
    const context = interactionProvider.getStore()
    if(!context) throw new Error("INVALID CONTEXT")
        
    return context
}

export function getOptionString(key: string, required = false) {
    const context = getContext()
    return context.options.getString(key, required)
}

export function getOptionBool(key: string) {
    const ctx = getContext()
    return ctx.options.getBoolean(key)
}

export function getOptionUser(key: string) {
    const ctx = getContext()
    return ctx.options.getUser(key)
}
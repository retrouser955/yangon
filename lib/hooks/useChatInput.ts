import type { ChatInputCommandInteraction } from "discord.js";
import { AsyncLocalStorage } from "async_hooks"

const interactionProvider = new AsyncLocalStorage<ChatInputCommandInteraction>()

export function provideInteraction(interaction: ChatInputCommandInteraction, callback: () => void) {
    interactionProvider.run(interaction, () => {
        callback()
    })
}

export function getOptionString(key: string, required = false) {
    const context = interactionProvider.getStore()
    if(!context) throw new Error("INVALID CONTEXT")
    return context.options.getString(key, required)
}
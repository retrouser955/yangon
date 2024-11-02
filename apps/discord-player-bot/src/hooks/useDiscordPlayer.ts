import { interactionAutocompleteProvider, interactionInputProvider } from "discord-chakra"
import { Player } from "discord-player"

export function useDiscordPlayer() {
    const store = interactionInputProvider.getStore()
    if(store && store.context && (store.context.player instanceof Player)) return store.context.player
    const autoStore = interactionAutocompleteProvider.getStore()
    if(autoStore && autoStore.context && (autoStore.context.player instanceof Player)) return autoStore.context.player
    throw new Error("INVALID INVOKCATION")
}
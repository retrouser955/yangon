import { autocomplete, command, commandMetadataOptionString } from "discord-chakra";
import type { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { useDiscordPlayer } from "../hooks/useDiscordPlayer";
import { QueryType } from "discord-player";
import { checkVcStatus } from "../validators/checkVcStatus";

export default class PlayCommand {
    @autocomplete("query", async (ctx) => {
        const option = ctx.options.getString("query")
        if(!option || !option.trim()) return ctx.respond([])
        
        const player = useDiscordPlayer()
        
        const results = await player.search(option, {
            fallbackSearchEngine: QueryType.SPOTIFY_SEARCH
        })

        ctx.respond(results.tracks.map((v) => {
            return {
                name: v.title,
                value: v.url
            }
        }))
    })
    @command("Play a URL/A query")
    async play(interaction: ChatInputCommandInteraction) {
        const player = useDiscordPlayer()
        if(!checkVcStatus(interaction)) return

        const query = commandMetadataOptionString({
            required: true,
            autocomplete: true,
            name: "query",
            description: "The URL/A query you wish to play"
        })

        await interaction.deferReply()
        const results = await player.search(query, {
            fallbackSearchEngine: QueryType.SPOTIFY_SEARCH
        })

        await player.play((interaction.member as GuildMember).voice.channel!, results.tracks)
    }
}
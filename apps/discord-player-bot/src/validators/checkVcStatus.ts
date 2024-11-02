import { ChatInputCommandInteraction, GuildMember } from "discord.js";

export function checkVcStatus(interaction: ChatInputCommandInteraction) {
    if(!(interaction.member as GuildMember).voice.channelId) {
        interaction.reply("You are not in a voice channel")
        return false
    }
    if((interaction.member as GuildMember).voice.channelId !== interaction.guild!.members.me?.voice.channelId) {
        interaction.reply("You are not in a voice channel")
        return false
    }

    return true
}
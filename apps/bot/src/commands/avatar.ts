import { Command, Option } from "@yangon-framework/shwedagon"
import { CommandInteraction } from "eris";
import { UserOption, useAvatar } from "@yangon-framework/core"
import { useDeps } from "@yangon-framework/syringe"
import { Client } from "eris"

export default class Avatar {
  /// Get the avatar of a user
  @Command()
  avatar(
    ctx: CommandInteraction,
    /// The member which you want the avatar from
    @Option()
    user?: UserOption
  ) {
    const eris = useDeps(Client)
    const avatar = useAvatar(undefined, undefined, user?.value ? eris.users.get(user.value) : undefined)
    console.log(user)
    ctx.createMessage({
      embeds: [
        {
          title: `Avatar`,
          image: {
            url: avatar
          }
        }
      ]
    })
  }
}

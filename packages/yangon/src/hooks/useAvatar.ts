import type { User } from "eris";
import { createHook } from "./createHooks";
import type Eris from "eris"

export const useAvatar = createHook((data, format?: Eris.ImageFormat, size?: number, user?: User) => {
  const author = user || data.ctx.user
  const avatar = author?.dynamicAvatarURL(format, size)

  return avatar
})

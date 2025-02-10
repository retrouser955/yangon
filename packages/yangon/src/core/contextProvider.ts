import { AsyncLocalStorage } from "node:async_hooks"
import type { Client, CommandInteraction } from "eris"

const provider = new AsyncLocalStorage<YangonContext>()

export interface YangonContext {
  ctx: CommandInteraction,
  client: Client
}

export function getContext(): YangonContext {
  const ctx = provider.getStore()

  if(!ctx) throw new Error("HOOKS_ERR: INVALID INVOCATION")

  return ctx
}

export function provideContext(context: YangonContext, callback: () => void) {
  provider.run(context, callback)
}

import { AsyncLocalStorage } from "node:async_hooks"
import type { HookData } from "./createHooks"
import { useGlobalTracker } from "./Tracker"

export class AsyncContextProvider<T extends Omit<HookData, "yangon">> {
  store: AsyncLocalStorage<HookData>
  
  constructor() {
    this.store = new AsyncLocalStorage<HookData>()
  }

  provideContext(data: T, callback: () => void) {
    const yangon = useGlobalTracker()
    const newData = {
      ...data,
      yangon
    }

    this.store.run(newData, callback)
  }

  getContext() {
    const ctx = this.store.getStore()
    if(!ctx) throw new Error("A hook was called outside of a context")

    return ctx
  }
}

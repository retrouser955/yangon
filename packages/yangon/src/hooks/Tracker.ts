import { AsyncLocalStorage } from "node:async_hooks"
import type { Yangon } from "../core/Yangon"

const GLOBAL_TRACKER = new AsyncLocalStorage<Yangon>()

export function useGlobalTracker() {
  const store = GLOBAL_TRACKER.getStore()
  if(!store) throw new Error('INVALID INVOKCATION OF USE GLOBAL TRACKER OUTSIDE OF CONTEXT')
  return store
}

export function provideGlobalTracker(yangon: Yangon, callback: () => void) {
  GLOBAL_TRACKER.run(yangon, callback)
}

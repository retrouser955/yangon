import { getContext } from "../core/contextProvider"

export type HookFactoryReturn<T extends unknown[] = unknown[], R extends unknown = unknown> = (...args: T) => R;

export function createHook(callback: (contextGetter: typeof getContext) => HookFactoryReturn) {
  
}

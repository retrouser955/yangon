import type { CommandInteraction, ComponentInteraction, ModalSubmitInteraction } from "eris";
import type { Yangon } from "../core/Yangon";
import { useGlobalTracker } from "./Tracker";

export type HookFunction<T extends unknown[], R extends unknown> = (data: HookData, ...args: T) => R;
export type HookReturnData<T extends unknown[], R extends unknown> = (...args: T) => R;
export type HookData = {
  yangon: Yangon
  ctx: CommandInteraction | ComponentInteraction | ModalSubmitInteraction
}
export type CommandHookData = {
  ctx: CommandInteraction
} & HookData
export type ComponentHookData = {
  ctx: ComponentInteraction
} & HookData
export type ModalHookData = {
  ctx: ModalSubmitInteraction
} & HookData

export function createHook<T extends unknown[], R extends unknown>(callback: HookFunction<T, R>): HookReturnData<T, R> {
  return (...args: T) => {
    const yangon = useGlobalTracker()
    const context = yangon.__getContext()

    return callback(context, ...args)
  }
}

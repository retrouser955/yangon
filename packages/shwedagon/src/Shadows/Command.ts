import type { YangonChatInputExecuteFunction } from "@yangon-framework/core"

export function Command() {
    return function(_target: any, _commandName: string, _deco: TypedPropertyDescriptor<YangonChatInputExecuteFunction>) {
        
    }
}
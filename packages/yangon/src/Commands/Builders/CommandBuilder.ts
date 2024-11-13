import { YangonChatInputExecuteFunctionCompiled } from "../../decorators";
import { Modify, YangonChatInputExecuteFunctionArgs } from "../../types/types";

export class CommandBuilder {
    name: string | undefined
    description: string | undefined
    execute: YangonChatInputExecuteFunctionCompiled | undefined
    options = new Map<string, YangonChatInputExecuteFunctionArgs<false>>()

    setName(name: string) {
        this.name = name;
        return this as Modify<CommandBuilder, { name: string }>
    }

    setDescription(desc: string) {
        this.description = desc
        return this as Modify<CommandBuilder, { description: string }>
    }

    setFunction(execute: YangonChatInputExecuteFunctionCompiled) {
        this.execute = execute
        return this as Modify<CommandBuilder, { execute: YangonChatInputExecuteFunctionCompiled }>
    }

    addOption(...options: YangonChatInputExecuteFunctionArgs<false>[]) {
        for (const option of options) {
            this.options.set(option.name, option)
        }
    }
}
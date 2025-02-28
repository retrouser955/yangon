import type { ApplicationCommandOptionsBoolean, ApplicationCommandOptionsChannel, ApplicationCommandOptionsInteger, ApplicationCommandOptionsMentionable, ApplicationCommandOptionsNumber, ApplicationCommandOptionsRole, ApplicationCommandOptionsString, ApplicationCommandOptionsUser, Client } from "eris";
import { CommandInteraction, ComponentInteraction, Constants } from "eris";
import { getAllFiles } from "../Utils/getAllFiles";
import { commands } from "../decorators";
import type { CommandBuilder } from "../Commands/Builders/CommandBuilder";
import { BooleanOption, ChannelOption, IntegerOption, MentionableOption, NumberOption, RoleOption, StringOption, UserOption } from "../Commands/Options";
import { TypedEmitter } from "tiny-typed-emitter";
import { AsyncContextProvider } from "../hooks/AsyncTracker";
import { HookData } from "../hooks/createHooks";
import { provideGlobalTracker } from "../hooks/Tracker";
import { BUTTON_CACHE, ButtonInteraction } from "../decorators/Button/Button";
import { ReservedWords } from "../types/types";

export interface YangonInitOptions {
    commands: string;
    debug?: boolean;
}

export const Events = {
  CommandNotFound: "commandNotFound",
  ButtonNotFound: "buttonNotFound"
} as const;

export type Events = (typeof Events)[keyof typeof Events];

export interface YangonEvents {
  [Events.CommandNotFound]: (ctx: CommandInteraction) => any;
  [Events.ButtonNotFound]: (ctx: ButtonInteraction) => any;
}

export class Yangon extends TypedEmitter<YangonEvents> {
    client: Client;
    options: YangonInitOptions;
    commands: Map<string, CommandBuilder>;
    #context = new AsyncContextProvider()

    __provideContext(data: Omit<HookData, "yangon">, callback: () => void) {
      provideGlobalTracker(this, () => {
        this.#context.provideContext(data, callback)
      })
    }

    constructor(client: Client, options: YangonInitOptions) {
        super()
        this.client = client;
        this.options = options;

        const allCommandFiles = getAllFiles(options.commands)

        for (const file of allCommandFiles) {
            try {
                new (require(file))
            } catch {
                try {
                    new (require(file).default)
                } catch (error) {
                    throw new Error(`Unable to compile ${file}\n${error}`)
                }
            }
        }

        this.commands = commands
        this.client.once("ready", () => {
            const iter = Array.from(this.commands.values())
            for (const command of iter) {
                console.log(`[YANGON] CREATING COMMAND: ${command.name}`)
                client.createCommand({
                    name: command.name!,
                    description: command.description!,
                    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
                    options: Array.from(command.options.values()).map((v) => {
                        const defaultOption = {
                            name: v.name,
                            description: v.description,
                            required: v.required
                        }
                        if (v instanceof StringOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.STRING
                        } satisfies ApplicationCommandOptionsString

                        if (v instanceof BooleanOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.BOOLEAN
                        } as unknown as ApplicationCommandOptionsBoolean

                        if (v instanceof ChannelOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.CHANNEL,
                            channel_types: v.channelTypes || undefined
                        } satisfies ApplicationCommandOptionsChannel

                        if (v instanceof IntegerOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.INTEGER
                        } satisfies ApplicationCommandOptionsInteger

                        if (v instanceof MentionableOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.MENTIONABLE
                        } as unknown as ApplicationCommandOptionsMentionable

                        if (v instanceof NumberOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.NUMBER,
                            // @ts-expect-error
                            min_value: v.min,
                            // @ts-expect-error
                            max_value: v.max
                        } satisfies ApplicationCommandOptionsNumber

                        if (v instanceof RoleOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.ROLE
                        } as unknown as ApplicationCommandOptionsRole

                        if (v instanceof UserOption) return {
                            ...defaultOption,
                            type: Constants.ApplicationCommandOptionTypes.USER
                        } as unknown as ApplicationCommandOptionsUser

                        throw new Error("ERR_INVALID_TYPE")
                    })
                })
            }
        })

        // event listener
        this.client.on("interactionCreate", (ctx) => {
            if (ctx instanceof CommandInteraction) return void this.__handleChatInput(ctx)
            if (ctx instanceof ComponentInteraction && ctx.data.component_type === Constants.ComponentTypes.BUTTON) return void this.__handleButtonInput(ctx as ButtonInteraction)
        })
    }

    __getContext() {
      return this.#context.getContext()
    }

    __handleButtonInput(ctx: ButtonInteraction) {
      const params = ctx.data.custom_id.split(ReservedWords.ButtonIdSplitter)

      const name = params.shift()

      if(!name) throw new Error("Button without a CustomID found")

      const button = BUTTON_CACHE.get(name)
      if(!button) {
        if(this.listeners(Events.ButtonNotFound).length === 0) throw new Error("Button Not Found! Make sure you have registered this with yangon or handle a `buttonNotFound` event")
        this.emit(Events.ButtonNotFound, ctx)
        return
      }

      this.__provideContext({
        ctx
      }, () => {
        button.execute(ctx)
      })
    }

    __handleChatInput(ctx: CommandInteraction) {
        const cmd = this.commands.get(ctx.data.name)
        if (!cmd) {
          if(this.listeners(Events.CommandNotFound).length === 0) throw new Error("Command Not Found! Make sure you have registered this with yangon")
          this.emit(Events.CommandNotFound, ctx)
          return  
        }
        this.__provideContext({
          ctx
        }, () => {
          cmd.execute!(ctx)
        })
    }
}

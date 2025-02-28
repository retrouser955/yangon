import type { ComponentInteraction, ComponentInteractionButtonData } from "eris";
import { ReservedWords } from "../../types/types";

// args will always be parsed using the reserved character "-"
export type ButtonDecorator = (ctx: ButtonInteraction, ...args: string[]) => any;
export type ButtonDecoratorCompiled = (ctx: ButtonInteraction) => any;

export type ButtonInteraction = ComponentInteraction & { data: ComponentInteractionButtonData }

export interface ButtonData {
  execute: ButtonDecoratorCompiled
}

export const BUTTON_CACHE = new Map<string, ButtonData>()

export function Button() {
  return (
    target: any,
    buttonId: string, // this will be checked by splitting "-" and checking the first "word"
    deco: TypedPropertyDescriptor<ButtonDecorator>
  ) => {
    const originalFn = target[buttonId] as ButtonDecorator | undefined
    if(!originalFn) throw new Error("Failed to compile " + buttonId)
    
    const compiledFn: ButtonDecoratorCompiled = (ctx) => {
      const customId = ctx.data.custom_id
      const params = customId.split(ReservedWords.ButtonIdSplitter)

      params.shift() // remove the name
      
      originalFn(ctx, ...params)
    }

    deco.value = compiledFn

    BUTTON_CACHE.set(buttonId, {
      execute: compiledFn
    })
  }
}

import type { Button } from "eris"
import { buttonMap } from "../Cache/ButtonMap";

export const ButtonModes = {
  Includes: 0,
  StartsWith: 1,
  EndsWith: 2
} as const

export type ButtonModes = (typeof ButtonModes)[keyof typeof ButtonModes]

export interface ButtonOptions {
 validator?: ButtonModes; 
}

export type ButtonDecorator = (ctx: Button) => any|void;

export function Button(options?: ButtonOptions) {
  return function (
    _: unknown,
    buttonId: string,
    decorator: TypedPropertyDescriptor<ButtonDecorator>
  ) {
    buttonMap.set(buttonId, {
      callback: decorator.value!,
      validator: options?.validator ?? ButtonModes.Includes
    })    
  }
}

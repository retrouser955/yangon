import type { ButtonDecorator, ButtonModes } from "../button";

export interface ButtonMetadata {
  callback: ButtonDecorator;
  validator: ButtonModes;
}

export const buttonMap = new Map<string, ButtonMetadata>()

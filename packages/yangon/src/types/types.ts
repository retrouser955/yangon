import type { InteractionDataOptionsString, InteractionDataOptionsBoolean, InteractionDataOptionsChannel, InteractionDataOptionsInteger, InteractionDataOptionsMentionable, InteractionDataOptionsNumber, InteractionDataOptionsRole, InteractionDataOptionsUser } from "eris";
import { StringOption, UserOption } from "../Commands/Options";

export type YangonChatInputArgs = (
    InteractionDataOptionsString |
    InteractionDataOptionsBoolean |
    InteractionDataOptionsChannel |
    InteractionDataOptionsInteger |
    InteractionDataOptionsMentionable |
    InteractionDataOptionsNumber |
    InteractionDataOptionsRole |
    InteractionDataOptionsUser
)

export type YangonOptionTypeStrings = (
    "StringOption" |
    "UserOption"
)

export type YangonChatInputExecuteFunctionArgs<T extends boolean = false> = (
    StringOption<T> |
    UserOption<T>
)

export type Modify<T, R> = Omit<T, keyof R> & R;
import type { InteractionDataOptionsString, InteractionDataOptionsBoolean, InteractionDataOptionsChannel, InteractionDataOptionsInteger, InteractionDataOptionsMentionable, InteractionDataOptionsNumber, InteractionDataOptionsRole, InteractionDataOptionsUser } from "eris";
import { BooleanOption, ChannelOption, IntegerOption, MentionableOption, NumberOption, RoleOption, StringOption, UserOption } from "../Commands/Options";

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
    UserOption<T> |
    BooleanOption<T> |
    ChannelOption<T> |
    IntegerOption<T> |
    MentionableOption<T> |
    NumberOption<T> |
    RoleOption<T>
)

export type Modify<T, R> = Omit<T, keyof R> & R;
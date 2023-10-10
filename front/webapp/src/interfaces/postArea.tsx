import { ActionReactionParameters } from "./aboutDotJson"

export interface PostArea {
    actionService: string,
    reactionService: string,
    actionName: string,
    reactionName: string,
    actionParameters: ActionReactionParameters[],
    reactionParameters: ActionReactionParameters[],
}
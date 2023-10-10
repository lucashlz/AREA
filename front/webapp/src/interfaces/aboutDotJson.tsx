import { TriggerReactionParameters } from "./postArea"

export interface aboutService {
    name: string
    color: string
    triggers: TriggerActions[]
    actions: TriggerActions[]
}

export interface TriggerActions {
    name: string
    description: string
    parameters: TriggerReactionParameters[]
}


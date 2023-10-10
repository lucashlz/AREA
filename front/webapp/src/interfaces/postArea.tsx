export interface TriggerReactionParameters {
    name: string;
    input: string;
}

export interface TriggerReaction {
    name: string;
    service: string;
    parameters: TriggerReactionParameters[];
}

export interface postService {
    action: TriggerReaction;
    reactions: TriggerReaction[];
}

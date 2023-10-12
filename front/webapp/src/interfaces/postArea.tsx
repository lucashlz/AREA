export interface TriggerReactionParameters {
    name: string;
    input: string;
}

export interface TriggerReaction {
    service: string;
    name: string;
    parameters: TriggerReactionParameters[];
}

export interface postService {
    action: TriggerReaction;
    reactions: TriggerReaction[];
}

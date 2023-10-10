export interface ActionReactionParameters {
    name: string;
    input: string;
}

export interface ActionReaction {
    name: string;
    description: string;
    parameters: ActionReactionParameters[];
}

export interface Service {
    name: string;
    color: string;
    actions: ActionReaction[];
    reactions: ActionReaction[];
}

export interface AboutDotJson {
    services: Service[];
}

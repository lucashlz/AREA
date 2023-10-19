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
    _id: string
    trigger: TriggerReaction;
    actions: TriggerReaction[];
}

export function getLocalSelectedArea(): postService {
    let currArea: postService = JSON.parse(localStorage.getItem('selectedArea') || 'null')
    if (currArea)
        return (currArea)
    else
        return (
            {
                _id: '',
                trigger: {
                    service: '',
                    name: '',
                    parameters: []
                },
                actions: [
                    {
                        service: '',
                        name: '',
                        parameters: []
                    }
                ]
            })
}

const {
    newRepositoryTrigger,
    newFollowerTrigger,
    createRepository,
    createIssue,
} = require("../area/githubArea");

const {
    newTopTrackTrigger,
    newPlaylistTrigger,
    addToPlaylist,
    createPlaylist,
} = require("../area/spotifyArea");

class Area {
    constructor(actions, reactions, color) {
        this.actions = actions;
        this.reactions = reactions;
        this.color = color;
    }
}

class TriggerAction {
    constructor(name, description, parameters, triggerFunction) {
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.triggerFunction = triggerFunction;
    }
}

class ReactionAction {
    constructor(name, description, parameters, actionFunction) {
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.actionFunction = actionFunction;
    }
}

const GITHUB_TRIGGERS = [
    new TriggerAction(
        "new_repository",
        "Triggers when a new repository is created",
        [], // No parameters
        newRepositoryTrigger
    ),
    new TriggerAction(
        "new_follower",
        "Triggers when a user gains a new follower",
        [], // No parameters
        newFollowerTrigger
    ),
];

const GITHUB_REACTIONS = [
    new ReactionAction(
        "create_repository",
        "Creates a new repository on GitHub",
        [
            { name: "repo-name", input: "Name of the new repository" },
            {
                name: "input",
                input: "Description of the new repository",
            },
            {
                name: "is_private",
                input: "Should the repository be private?",
            },
        ],
        createRepository
    ),
    new ReactionAction(
        "create_issue",
        "Creates a new issue on a GitHub repository",
        [
            { name: "repo_name", input: "Name of the target repository" },
            { name: "issue_title", input: "Title of the new issue" },
            { name: "issue_body", input: "Body content of the new issue" },
        ],
        createIssue
    ),
];

const SPOTIFY_TRIGGERS = [
    new TriggerAction(
        "new_top_track",
        "Triggers when a new top track is detected",
        [], // No parameters
        newTopTrackTrigger
    ),
    new TriggerAction(
        "new_playlist",
        "Triggers when a new playlist is created",
        [], // No parameters
        newPlaylistTrigger
    ),
];

const SPOTIFY_REACTIONS = [
    new ReactionAction(
        "create_playlist",
        "Creates a new playlist on Spotify",
        [{ name: "playlist_name", input: "Name of the new playlist" }],
        createPlaylist
    ),
    new ReactionAction(
        "add_track_to_playlist",
        "Adds a track to a Spotify playlist",
        [
            { name: "playlist_name", input: "Name of the target playlist" },
            { name: "trackId", input: "ID of the track to add" },
        ],
        addToPlaylist
    ),
];

const AREAS = {
    github: new Area(GITHUB_TRIGGERS, GITHUB_REACTIONS, "#282828"),
    spotify: new Area(SPOTIFY_TRIGGERS, SPOTIFY_REACTIONS, "#3CC339"),
};

module.exports = AREAS;

const {
    newSavedTrack,
    newSavedAlbum,
    newRecentlyPlayedTrack,
    newTrackAddedToPlaylist,
    followPlaylist,
    saveTrack,
    addToPlaylistById,
} = require("../area/spotifyArea");

const {
    everyDayAt,
    everyHourAt,
    everyDayOfTheWeekAt,
    everyMonthOnThe,
    everyYearOn,
} = require("../area/dateTimeArea")

class Area {
    constructor(triggers, actions, color) {
        this.triggers = triggers;
        this.actions = actions;
        this.color = color;
    }
}

class Trigger {
    constructor(name, description, parameters, triggerFunction) {
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.triggerFunction = triggerFunction;
    }
}

class Action {
    constructor(name, description, parameters, actionFunction) {
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.actionFunction = actionFunction;
    }
}

const SPOTIFY_TRIGGERS = [
    new Trigger(
        "new_saved_track",
        "Triggers every time you save a new track to Your Music on Spotify",
        [],
        newSavedTrack
    ),
    new Trigger(
        "new_saved_album",
        "Triggers every time you save a new album to Your Music on Spotify",
        [],
        newSavedAlbum
    ),
    new Trigger(
        "new_recently_played_track",
        "Triggers every time you have played a new track on Spotify",
        [],
        newRecentlyPlayedTrack
    ),
    new Trigger(
        "new_track_added_to_playlist",
        "Triggers every time a new track is added to a specified Spotify playlist",
        [{ name: "playlist_name", input: "Name of the Spotify playlist to monitor" }],
        newTrackAddedToPlaylist
    ),
];

const SPOTIFY_ACTIONS = [
    new Action(
        "follow_playlist",
        "Follows a specified Spotify playlist",
        [{ name: "playlist_id", input: "Spotify Playlist ID to follow" }],
        followPlaylist
    ),
    new Action(
        "save_track",
        "Searches for a track and saves the first matching result to Spotify library",
        [{ name: "track_name", input: "Name of the track to search and save" }],
        saveTrack
    ),
    new Action(
        "add_track_to_playlist_by_id",
        "Adds a track to a playlist using TrackID",
        [
            { name: "playlist_name", input: "Name of the target playlist" },
            { name: "track_id", input: "Spotify Track ID to add to the playlist" },
        ],
        addToPlaylistById
    ),
];

const DATETIME_TRIGGERS = [
    new Trigger(
        "every_day_at",
        "Triggers every single day at a specific time set by you",
        [
            { name: "target_hour", input: "Hour (0-23)" },
            { name: "target_minute", input: "Minute (0-59)" },
        ],
        everyDayAt
    ),
    new Trigger(
        "every_hour_at",
        "Triggers once an hour at :00, :15, :30, or :45 minutes past the hour",
        [{ name: "target_minute", input: "Minute (0, 15, 30, 45)" }],
        everyHourAt
    ),
    new Trigger(
        "every_day_of_the_week_at",
        "Triggers only on specific days of the week at the time you provide",
        [
            { name: "days_array", input: "Array of days (e.g., ['Monday', 'Wednesday'])" },
            { name: "target_hour", input: "Hour (0-23)" },
            { name: "target_minute", input: "Minute (0-59)" },
        ],
        everyDayOfTheWeekAt
    ),
    new Trigger(
        "every_month_on_the",
        "Triggers every month on the day and time you specify",
        [
            { name: "target_day", input: "Day of the month (1-31)" },
            { name: "target_hour", input: "Hour (0-23)" },
            { name: "target_minute", input: "Minute (0-59)" },
        ],
        everyMonthOnThe
    ),
    new Trigger(
        "every_year_on",
        "Triggers once a year on the date and time you specify",
        [
            { name: "target_month", input: "Month (1-12)" },
            { name: "target_day", input: "Day of the month (1-31)" },
            { name: "target_hour", input: "Hour (0-23)" },
            { name: "target_minute", input: "Minute (0-59)" },
        ],
        everyYearOn
    ),
];

const DATETIME_ACTIONS = [];

const AREAS = {
    spotify: new Area(SPOTIFY_TRIGGERS, SPOTIFY_ACTIONS, "#3CC339"),
    dateTime: new Area(DATETIME_TRIGGERS, DATETIME_ACTIONS, "#000000"),
};

module.exports = AREAS;

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
} = require("../area/dateTimeArea");

const {
    anyNewCommit,
    anyNewIssue,
    newIssueAssignedToYou,
    newRepositoryByUserOrOrg,
    createIssue,
} = require("../area/githubArea");

const {
    streamGoingLiveForChannel,
    youFollowNewChannel,
    userFollowedChannel,
    newFollowerOnYourChannel,
} = require("../area/twitchArea");

const {
    newLikedVideo,
    newVideoByChannel,
    newSubscription,
    likeVideo,
} = require("../area/youtubeArea");

const { sendEmail, sendEmailToSelf } = require("../area/gmailArea");

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

const GITHUB_TRIGGERS = [
    new Trigger(
        "any_new_commit",
        "Triggers every time a new commit in a repo is created on Github",
        [{ name: "repository_name", input: "Repository name" }],
        anyNewCommit
    ),
    new Trigger(
        "any_new_issue",
        "Triggers every time any new issue is opened in a repository you own or collaborate on",
        [],
        anyNewIssue
    ),
    new Trigger(
        "new_issue_assigned_to_you",
        "Triggers every time a new issue is assigned to you",
        [],
        newIssueAssignedToYou
    ),
    new Trigger(
        "new_repository_by_user_or_org",
        "Triggers every time a new repository is created by the username or organization you specify",
        [{ name: "user_or_org_name", input: "Username or organization name" }],
        newRepositoryByUserOrOrg
    ),
];

const GITHUB_ACTIONS = [
    new Action(
        "create_issue",
        "This Action will create a new issue for the repository you specify",
        [
            { name: "repository", input: "Repository name" },
            { name: "title", input: "Issue title" },
            { name: "body", input: "Issue body (description)" },
        ],
        createIssue
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

const TWITCH_TRIGGERS = [
    new Trigger(
        "stream_going_live_for_channel",
        "Triggers every time a stream is going live for the specified Channel that you follow",
        [{ name: "channel_name", input: "Which channel?" }],
        streamGoingLiveForChannel
    ),
    new Trigger(
        "you_follow_new_channel",
        "This trigger fires every time you follow a new channel on Twitch",
        [],
        youFollowNewChannel
    ),
    new Trigger(
        "user_followed_channel",
        "This trigger fires every time the specified user starts following a channel on Twitch",
        [{ name: "user_name", input: "Which user?" }],
        userFollowedChannel
    ),
    new Trigger(
        "new_follower_on_your_channel",
        "This trigger fires every time there is a new follower of your channel",
        [],
        newFollowerOnYourChannel
    ),
];

const TWITCH_ACTIONS = [];

const YOUTUBE_TRIGGERS = [
    new Trigger(
        "new_liked_video",
        "Triggers every time you like a video on YouTube",
        [],
        newLikedVideo
    ),
    new Trigger(
        "new_video_by_channel",
        "Triggers every time a specific channel publishes a video",
        [{ name: "channel_id", input: "Enter the Channel ID" }],
        newVideoByChannel
    ),
    new Trigger(
        "new_subscription",
        "This trigger fires when a new subscription is made by a specific channel",
        [{ name: "channel_id", input: "Channel id" }],
        newSubscription
    ),
];

const YOUTUBE_ACTIONS = [
    new Action(
        "like_video",
        "Likes a specified video",
        [{ name: "video_id", input: "YouTube Video ID to like" }],
        likeVideo
    ),
];

const GMAIL_ACTIONS = [
    new Action(
        "send_email",
        "This Action will send an email to up to 20 recipients from your Gmail account.",
        [
            { name: "to_address", input: "To address" },
            { name: "cc_address", input: "CC address (optional)" },
            { name: "bcc_address", input: "BCC address (optional)" },
            { name: "subject", input: "Subject" },
            { name: "body", input: "Body (Some HTML ok)" },
            { name: "attachment_url", input: "Attachment URL (optional)" },
        ],
        sendEmail
    ),

    new Action(
        "send_email_to_self",
        "This action will send yourself an email. HTML, images and links are supported.",
        [
            { name: "subject", input: "Subject" },
            { name: "body", input: "Body (Some HTML ok)" },
            { name: "attachment_url", input: "Attachment URL (optional)" },
        ],
        sendEmailToSelf
    ),
];

const GMAIL_TRIGGERS = [];

const AREAS = {
    dateTime: new Area(DATETIME_TRIGGERS, DATETIME_ACTIONS, "#000000"),
    spotify: new Area(SPOTIFY_TRIGGERS, SPOTIFY_ACTIONS, "#3CC339"),
    github: new Area(GITHUB_TRIGGERS, GITHUB_ACTIONS, "#282828"),
    twitch: new Area(TWITCH_TRIGGERS, TWITCH_ACTIONS, "#5865F2"),
    youtube: new Area(YOUTUBE_TRIGGERS, YOUTUBE_ACTIONS, "#FF0000"),
    gmail: new Area(GMAIL_TRIGGERS, GMAIL_ACTIONS, "#94BAF5"),
};

module.exports = AREAS;

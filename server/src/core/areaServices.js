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
    newFollowerOnYourChannel,
} = require("../area/twitchArea");

const {
    newLikedVideo,
    newVideoByChannel,
    newSubscription,
    likeVideo,
} = require("../area/youtubeArea");

const { sendEmail, sendEmailToSelf } = require("../area/gmailArea");

const {
    newFileInFolder,
    newSharedFileLink,
    moveFileOrFolder,
    addFileFromURL,
} = require("../area/dropboxArea");

class Area {
    constructor(triggers, actions, color) {
        this.triggers = triggers;
        this.actions = actions;
        this.color = color;
    }
}

class Trigger {
    constructor(name, description, parameters, triggerFunction, ingredients) {
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.triggerFunction = triggerFunction;
        this.ingredients = ingredients;
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
        newSavedTrack,
        [
            { name: "song_name", description: "Name of the saved song" },
            { name: "song_id", description: "ID of the saved song" },
            { name: "artist", description: "Artist of the saved song" },
            { name: "trackURL", description: "URL of the saved track" },
            { name: "coverURL", description: "Cover image URL of the saved track" },
        ]
    ),
    new Trigger(
        "new_saved_album",
        "Triggers every time you save a new album to Your Music on Spotify",
        [],
        newSavedAlbum,
        [
            { name: "album_name", description: "Name of the saved album" },
            { name: "album_id", description: "ID of the saved album" },
            { name: "artist", description: "Artist of the saved album" },
            { name: "albumURL", description: "URL of the saved album" },
            { name: "coverURL", description: "Cover image URL of the saved album" },
        ]
    ),
    new Trigger(
        "new_recently_played_track",
        "Triggers every time you have played a new track on Spotify",
        [],
        newRecentlyPlayedTrack,
        [
            { name: "song_name", description: "Name of the recently played song" },
            { name: "song_id", description: "ID of the recently played song" },
            { name: "artist", description: "Artist of the recently played song" },
            { name: "trackURL", description: "URL of the recently played track" },
            { name: "coverURL", description: "Cover image URL of the recently played track" },
        ]
    ),
    new Trigger(
        "new_track_added_to_playlist",
        "Triggers every time a new track is added to a specified Spotify playlist",
        [{ name: "playlist_id", input: "ID of the Spotify playlist to monitor", optional: false }],
        newTrackAddedToPlaylist,
        [
            { name: "song_name", description: "Name of the song added to the playlist" },
            { name: "song_id", description: "ID of the song added to the playlist" },
            { name: "playlist_name", description: "Name of the target playlist" },
            { name: "playlist_id", description: "ID of the target playlist" },
            { name: "artist", description: "Artist of the song added to the playlist" },
            { name: "trackURL", description: "URL of the track added to the playlist" },
            { name: "coverURL", description: "Cover image URL of the track added to the playlist" },
        ]
    )
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
        [{ name: "track_id", input: "ID of the track to search and save" }],
        saveTrack
    ),
    new Action(
        "add_track_to_playlist_by_id",
        "Adds a track to a playlist using TrackID",
        [
            { name: "playlist_id", input: "ID of the target playlist" },
            { name: "track_id", input: "Spotify Track ID to add to the playlist" },
        ],
        addToPlaylistById
    ),
];

const GITHUB_TRIGGERS = [
    new Trigger(
        "any_new_commit",
        "Triggers every time a new commit in a repo is created on Github",
        [{ name: "repository_name", input: "Repository name", optional: false }],
        anyNewCommit,
        [
            { name: "commit_message", description: "The commit message" },
            { name: "committer_name", description: "Name of the person who made the commit" },
            { name: "commit_date", description: "The date and time the commit was made" },
            { name: "commit_url", description: "URL to view the commit on GitHub" },
            { name: "repository_name", description: "Name of the repository where the commit was made" }
        ]
    ),
    new Trigger(
        "any_new_issue",
        "Triggers every time a new issue is created by the authenticated user on Github",
        [],
        anyNewIssue,
        [
            { name: "issue_title", description: "Title of the issue" },
            { name: "issue_url", description: "URL of the issue" },
            { name: "issue_body", description: "Description of the issue" },
            { name: "issue_creator", description: "Username of the issue creator" },
            { name: "issue_date", description: "Date the issue was created" },
            { name: "repository_name", description: "Name of the repository where the issue was created" }
        ]
    ),
    new Trigger(
        "new_issue_assigned_to_you",
        "Triggers every time a new issue is assigned to the authenticated user on Github",
        [],
        newIssueAssignedToYou,
        [
            { name: "issue_title", description: "Title of the issue" },
            { name: "issue_url", description: "URL of the issue" },
            { name: "issue_body", description: "Description of the issue" },
            { name: "issue_creator", description: "Username of the issue creator" },
            { name: "assigned_to_you_date", description: "Date the issue was assigned to you" },
            { name: "repository_name", description: "Name of the repository where the issue was created" }
        ]
    ),
    new Trigger(
        "new_repository_by_user_or_org",
        "Triggers every time a new repository is created by a specified user or organization on Github",
        [{ name: "username_or_orgname", input: "Username or Organization name", optional: false }],
        newRepositoryByUserOrOrg,
        [
            { name: "repository_name", description: "Name of the repository" },
            { name: "repository_description", description: "Description of the repository" },
            { name: "repository_url", description: "URL of the repository" },
            { name: "repository_owner", description: "Username of the repository owner" },
            { name: "repository_date", description: "Date the repository was created" }
        ]
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

const DATETIME_INGREDIENTS = [
    { name: "date", description: "The current date when the trigger is activated" },
    { name: "day", description: "The current day (e.g., Monday, Tuesday) when the trigger is activated" },
    { name: "month", description: "The current month when the trigger is activated" },
    { name: "year", description: "The current year when the trigger is activated" },
    { name: "hour", description: "The current hour when the trigger is activated" },
    { name: "minute", description: "The current minute when the trigger is activated" }
];

const DATETIME_TRIGGERS = [
    new Trigger(
        "every_day_at",
        "Triggers every single day at a specific time set by you",
        [
            { name: "target_hour", input: "Hour (0-23)", optional: false },
            { name: "target_minute", input: "Minute (0-59)", optional: false },
        ],
        everyDayAt,
        DATETIME_INGREDIENTS
    ),
    new Trigger(
        "every_hour_at",
        "Triggers once an hour at :00, :15, :30, or :45 minutes past the hour",
        [{ name: "target_minute", input: "Minute (0, 15, 30, 45)", optional: false }],
        everyHourAt,
        DATETIME_INGREDIENTS
    ),
    new Trigger(
        "every_day_of_the_week_at",
        "Triggers only on specific days of the week at the time you provide",
        [
            { name: "days_array", input: "Days (e.g., Monday, Wednesday)", optional: false },
            { name: "target_hour", input: "Hour (0-23)", optional: false },
            { name: "target_minute", input: "Minute (0-59)", optional: false },
        ],
        everyDayOfTheWeekAt,
        DATETIME_INGREDIENTS
    ),
    new Trigger(
        "every_month_on_the",
        "Triggers every month on the day and time you specify",
        [
            { name: "target_day", input: "Day of the month (1-31)", optional: false },
            { name: "target_hour", input: "Hour (0-23)", optional: false },
            { name: "target_minute", input: "Minute (0-59)", optional: false },
        ],
        everyMonthOnThe,
        DATETIME_INGREDIENTS
    ),
    new Trigger(
        "every_year_on",
        "Triggers once a year on the date and time you specify",
        [
            { name: "target_month", input: "Month (1-12)", optional: false },
            { name: "target_day", input: "Day of the month (1-31)", optional: false },
            { name: "target_hour", input: "Hour (0-23)", optional: false },
            { name: "target_minute", input: "Minute (0-59)", optional: false },
        ],
        everyYearOn,
        DATETIME_INGREDIENTS
    ),
];

const DATETIME_ACTIONS = [];

const TWITCH_TRIGGERS = [
    new Trigger(
        "stream_going_live_for_channel",
        "Triggers every time a stream is going live for the specified Channel that you follow",
        [{ name: "channel_name", input: "Name of the channel", optional: false }],
        streamGoingLiveForChannel,
        [
            { name: "twitch_stream_title", description: "Title of the live stream" },
            { name: "twitch_streamer_name", description: "Name of the streamer" },
            { name: "twitch_stream_url", description: "URL to the live stream" },
            { name: "twitch_viewers_count", description: "Current number of viewers" },
            { name: "twitch_stream_started_at", description: "Date and time when the stream started" },
            { name: "twitch_game_being_played", description: "Name of the game being streamed" }
        ]
    ),
    new Trigger(
        "you_follow_new_channel",
        "This trigger fires every time you follow a new channel on Twitch",
        [],
        youFollowNewChannel,
        [
            { name: "twitch_channel_name", description: "Name of the channel you followed" },
            { name: "twitch_channel_url", description: "URL to the channel's page" },
            { name: "twitch_channel_followers_count", description: "Number of followers of the channel" },
            { name: "twitch_channel_total_views", description: "Total views on the channel" },
            { name: "twitch_followed_date", description: "Date when you followed the channel" }
        ]
    ),
    new Trigger(
        "new_follower_on_your_channel",
        "This trigger fires every time there is a new follower of your channel",
        [],
        newFollowerOnYourChannel,
        [
            { name: "twitch_follower_username", description: "Username of the new follower" },
            { name: "twitch_follower_profile_url", description: "URL to the follower's Twitch profile" },
            { name: "twitch_followed_date", description: "Date when they followed your channel" }
        ]
    ),
];

const TWITCH_ACTIONS = [];

const YOUTUBE_TRIGGERS = [
    new Trigger(
        "new_liked_video",
        "Triggers every time you like a video on YouTube",
        [],
        newLikedVideo,
        [
            { name: "youtube_video_title", description: "Title of the liked video" },
            { name: "youtube_channel_name", description: "Name of the channel that uploaded the video" },
            { name: "youtube_video_url", description: "URL to the video" },
            { name: "youtube_published_date", description: "Date and time when the video was published" },
            { name: "youtube_video_description", description: "Description of the video" }
        ]
    ),
    new Trigger(
        "new_video_by_channel",
        "Triggers every time a specific channel publishes a video",
        [{ name: "channel_id", input: "Enter the Channel ID", optional: false }],
        newVideoByChannel,
        [
            { name: "youtube_video_title", description: "Title of the new video" },
            { name: "youtube_channel_name", description: "Name of the channel that uploaded the video" },
            { name: "youtube_video_url", description: "URL to the video" },
            { name: "youtube_published_date", description: "Date and time when the video was published" },
            { name: "youtube_video_description", description: "Description of the video" }
        ]
    ),
    new Trigger(
        "new_subscription",
        "This trigger fires when a new subscription is made by a specific channel",
        [{ name: "channel_id", input: "Channel id", optional: false }],
        newSubscription,
        [
            { name: "youtube_channel_name", description: "Name of the channel you subscribed to" },
            { name: "youtube_channel_url", description: "URL to the channel's page" },
            { name: "youtube_subscribed_date", description: "Date and time when you subscribed" }
        ]
    ),
];

const YOUTUBE_ACTIONS = [
    new Action(
        "like_video",
        "Likes a specified video",
        [{ name: "video_id", input: "YouTube Video ID to like", optional: false }],
        likeVideo
    ),
];

const GMAIL_ACTIONS = [
    new Action(
        "send_email",
        "This Action will send an email to up to 20 recipients from your Gmail account.",
        [
            { name: "to_address", input: "To address", optional: false },
            { name: "cc_address", input: "CC address (Optional)", optional: true },
            { name: "bcc_address", input: "BCC address (Optional)", optional: true },
            { name: "subject", input: "Subject", optional: false },
            { name: "body", input: "Body", optional: false },
            { name: "attachment_url", input: "Attachment URL (Optional)", optional: true },
        ],
        sendEmail,
        []
    ),

    new Action(
        "send_email_to_self",
        "This action will send yourself an email. HTML, images and links are supported.",
        [
            { name: "subject", input: "Subject", optional: false },
            { name: "body", input: "Body", optional: false },
            { name: "attachment_url", input: "Attachment URL (Optional)", optional: true },
        ],
        sendEmailToSelf
    ),
];

const GMAIL_TRIGGERS = [];

const DROPBOX_TRIGGERS = [
    new Trigger(
        "new_file_in_folder",
        "This Trigger fires every time any file is saved in the folder you specify",
        [{ name: "folder_path", input: "Path to the Dropbox folder", optional: false }],
        newFileInFolder,
        [
            { name: "file_name", description: "Name of the new file" },
            { name: "folder_path", description: "Path to the Dropbox folder where the file was added" },
        ]
    ),
    new Trigger(
        "new_shared_file_link",
        "This trigger fires every time a shared link for a file is created. Note: doesn't include folders.",
        [],
        newSharedFileLink,
        [
            { name: "file_url", description: "Shared link URL of the file" },
            { name: "file_name", description: "Name of the file" },
        ]
    ),
];

const DROPBOX_ACTIONS = [
    new Action(
        "move_file_or_folder",
        "This action will move a file or a folder to new location.",
        [
            { name: "original_path", input: "Original path", optional: false },
            { name: "destination_path", input: "Destination path", optional: false },
        ],
        moveFileOrFolder
    ),
    new Action(
        "add_file_from_url",
        "This Action will download a file at a given URL and add it to Dropbox at the path you specify. NOTE: 30 MB file size limit.",
        [
            { name: "file_url", input: "URL of the file to download", optional: false },
            { name: "file_name", input: "Name of the file to be saved", optional: false },
            { name: "dropbox_folder_path", input: "Path in Dropbox", optional: false },
        ],
        addFileFromURL
    ),
];

const AREAS = {
    dateTime: new Area(DATETIME_TRIGGERS, DATETIME_ACTIONS, "#333333"),
    spotify: new Area(SPOTIFY_TRIGGERS, SPOTIFY_ACTIONS, "#1DB954"),
    github: new Area(GITHUB_TRIGGERS, GITHUB_ACTIONS, "#4078C0"),
    twitch: new Area(TWITCH_TRIGGERS, TWITCH_ACTIONS, "#6441A5"),
    youtube: new Area(YOUTUBE_TRIGGERS, YOUTUBE_ACTIONS, "#FF0000"),
    gmail: new Area(GMAIL_TRIGGERS, GMAIL_ACTIONS, "#BF02AF"),
    dropbox: new Area(DROPBOX_TRIGGERS, DROPBOX_ACTIONS, "#0062FE"),
};

module.exports = AREAS;

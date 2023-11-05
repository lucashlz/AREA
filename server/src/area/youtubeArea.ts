import User from "../models/userModels";
import { getYouTubeToken } from "../utils/token/servicesTokenUtils";
import { processTriggerDataTotal } from "../utils/area/areaValidation";
import { updateIngredients } from "../utils/ingredients/ingredientsHelper";
import {
    fetchSubscription,
    fetchLikedVideosPlaylistId,
    fetchPlaylistItems,
    fetchChannelDetails,
    fetchTotalVideosForPlaylist,
    fetchRecentVideoByChannel,
    fetchTotalPlaylistItems,
    fetchLikeVideo,
} from "../utils/API/youtubeAPI";

interface AreaEntry {
    userId: string;
    trigger: {
        parameters: Array<{ input: string }>;
        data?: { value: string };
    };
}

interface PlaylistItemSnippet {
    resourceId: { videoId: string };
    title: string;
    channelTitle: string;
    publishedAt: string;
    description: string;
}

interface PlaylistItemsResponse {
    items: Array<{ snippet: PlaylistItemSnippet }>;
}

interface SubscriptionSnippet {
    resourceId: { channelId: string };
    title: string;
    publishedAt: string;
}

interface SubscriptionResponse {
    pageInfo: { totalResults: number };
    items: Array<SubscriptionSnippet>;
}

export const newLikedVideo = async (areaEntry: AreaEntry): Promise<boolean> => {
    try {
        const accessToken = await getYouTubeToken(areaEntry.userId);
        const likedVideosPlaylistId = await fetchLikedVideosPlaylistId(accessToken);
        const playlistItemsResponse = await fetchPlaylistItems(accessToken, likedVideosPlaylistId);
        const recentLike = playlistItemsResponse.items.length > 0 ? playlistItemsResponse.items[0].snippet : null;
        const totalLikedVideos = await fetchTotalPlaylistItems(accessToken, likedVideosPlaylistId);
        if (!recentLike) return await processTriggerDataTotal(areaEntry, "videoId", "", 0);

        if (await processTriggerDataTotal(areaEntry, "videoId", recentLike.resourceId.videoId, totalLikedVideos)) {
            updateIngredients(areaEntry, [
                { name: "youtube_video_title", value: recentLike.title },
                { name: "youtube_channel_name", value: recentLike.channelTitle },
                { name: "youtube_video_url", value: `https://www.youtube.com/watch?v=${recentLike.resourceId.videoId}` },
                { name: "youtube_published_date", value: recentLike.publishedAt.split("T")[0] },
                { name: "youtube_video_description", value: recentLike.description },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in newLikedVideo function:", error);
        return false;
    }
};

export const newVideoByChannel = async (areaEntry: AreaEntry): Promise<boolean> => {
    try {
        const channelId = areaEntry.trigger.parameters[0].input;
        const accessToken = await getYouTubeToken(areaEntry.userId);
        const uploadsPlaylistId = await fetchChannelDetails(accessToken, channelId);
        const recentVideoResponse = await fetchRecentVideoByChannel(accessToken, channelId);
        const recentVideo = recentVideoResponse.items.length > 0 ? recentVideoResponse.items[0].snippet : null;
        const totalUploads = await fetchTotalVideosForPlaylist(accessToken, uploadsPlaylistId);
        if (!recentVideo) return await processTriggerDataTotal(areaEntry, "videoId", "", 0);

        if (await processTriggerDataTotal(areaEntry, "videoId", recentVideo.resourceId.videoId, totalUploads)) {
            updateIngredients(areaEntry, [
                { name: "youtube_video_title", value: recentVideo.title },
                { name: "youtube_channel_name", value: recentVideo.channelTitle },
                { name: "youtube_video_url", value: `https://www.youtube.com/watch?v=${recentVideo.resourceId.videoId}` },
                { name: "youtube_published_date", value: recentVideo.publishedAt.split("T")[0] },
                { name: "youtube_video_description", value: recentVideo.description },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in newVideoByChannel function:", error);
        return false;
    }
};

export const newSubscription = async (areaEntry: AreaEntry): Promise<boolean> => {
    try {
        const accessToken = await getSpotifyToken(areaEntry.userId);
        const recentSubscription = await fetchSubscription(accessToken);
        const totalSubscription = recentSubscription.pageInfo.totalResults;
        if (!recentSubscription) return await processTriggerDataTotal(areaEntry, "subscriptionId", "", 0);

        if (await processTriggerDataTotal(areaEntry, "subscriptionId", recentSubscription.resourceId.channelId, totalSubscription)) {
            updateIngredients(areaEntry, [
                { name: "youtube_channel_name", value: recentSubscription.title },
                { name: "youtube_channel_url", value: `https://www.youtube.com/channel/${recentSubscription.resourceId.channelId}` },
                { name: "youtube_subscribed_date", value: recentSubscription.publishedAt.split("T")[0] },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in newSubscription function:", error);
        return false;
    }
};


export const likeVideo = async (userId: string, videoId: string): Promise<boolean> => {
    try {
        const accessToken = await getYouTubeToken(userId);
        const success = await fetchLikeVideo(accessToken, videoId);

        return success;
    } catch (error) {
        console.error("Error in likeVideo function:", error);
        throw error;
    }
};
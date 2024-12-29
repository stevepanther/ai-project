'use client'
import React from "react";
import ReactPlayer from "react-player";

// Utility to generate embed URL from videoId
function generateYouTubeEmbedUrl(videoId: string) {
    const baseUrl = new URL("https://www.youtube.com/embed/");
    baseUrl.pathname += videoId;
    return baseUrl.href;
}

interface YouTubePlayerProps {
    videoId: string;
}

export default function YouTubePlayer({
    videoId,
}: Readonly<YouTubePlayerProps>) {
    if (!videoId) return null;

    // Check if the videoId is a full URL or just a videoId
    let videoUrl = videoId;
    if (!videoUrl.toLowerCase().startsWith("http")) {
        // Generate a valid embed URL if it's just a videoId
        videoUrl = generateYouTubeEmbedUrl(videoUrl);
    }

    return (
        <div className="relative aspect-video rounded-md overflow-hidden">
            <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls
                className="absolute top-0 left-0"
            />
        </div>
    );
}

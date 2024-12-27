'use client'
import React from "react";
import ReactPlayer from "react-player";

function generateYouTubeUrl (videoId: string) {
    const baseUrl = new URL("https://www.youtube.com/watch");
    baseUrl.searchParams.append("v", videoId);
    return baseUrl.href;
}

interface YouTubePlayerProps {
    videoId: string;
}

export default function YouTubePlayer({
    videoId,
}: Readonly<YouTubePlayerProps>) {
    if (!videoId) return null;
    let videoUrl;
    if(!videoId.toLowerCase().startsWith("http")) {
        videoUrl = generateYouTubeUrl(videoId);
    }
    else {
        videoUrl = videoId;
    }
    console.log(videoUrl)

    return (
        <div className="relative aspect-video rounded-md overflow-hidden">
            <ReactPlayer
                url = {videoUrl}
                width='100%'
                height='100%'
                controls
                className = "absolute top-0 left-0 "
            />
        </div>
    )
}
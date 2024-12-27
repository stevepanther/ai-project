"use client"

import dynamic from "next/dynamic"

const YouTubePlayer = dynamic(
    () => import("@/components/custom/client-youtube-player/youtube-player"),
    {ssr: false}
);

export default function ClientYouTubePlayer({videoId}: {videoId: string}){
    console.log("videoID", videoId)
    return <YouTubePlayer videoId={videoId} />;
}
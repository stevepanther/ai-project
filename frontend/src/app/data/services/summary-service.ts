export async function generateYoutubeSummaryService(videoId:string) {
    const url = "/api/summarize";
    
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ videoId: videoId }),
        });
        return await response.json();
    } catch (error) {
        console.error("Failed to generate summary:", error);
        if (error instanceof Error) return {error: {message: error.message}};
        return {data: null, error: {message: "Unknown error"}};
    }
}

export async function generateLocalVideoSummaryService(script:string) {
    const url = "/api/localVideoSummarize";
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ script: script }),
        });
        return await response.json();
    } catch (error) {
        console.error("Failed to generate summary:", error);
        if (error instanceof Error) return {error: {message: error.message}};
        return {data: null, error: {message: "Unknown error"}};
    }
}

export async function generateTranscriptService(inputFile:File | null) {
    if (!inputFile) {
        console.error("No input file provided");
        return { data: null, error: { message: "No input file provided" } };
    }
    const url = "/api/transcript";
    const formData = new FormData();
    formData.append("inputFile", inputFile);
    
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error("Failed to generate transcript:", error);
        if (error instanceof Error) return {error: {message: error.message}};
        return {data: null, error: {message: "Unknown error"}};
    }
}
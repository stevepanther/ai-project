import { NextRequest } from "next/server";
import { getUserMeLoader } from "@/app/data/services/get-user-me-loader";
import { getAuthToken } from "@/app/data/services/get-token";

import {ChatGroq} from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const TEMPLATE = `
    INSTRUCTIONS:
        For the this {text} complete the following steps/
        Generate the title for based on the content provided
        Summarize the following content and include 5 key topics, writing in first person using 

        Write a video description
            - Include heading and sections.
            - Incorporate keywords and key takeaways

        Generate bulleted list of key points and benefits

        Return possible and best recommended key words
`

async function generateSummary(content:string, template:string) {

    // Initialize the ChatGroq model
    const chat = new ChatGroq({
        modelName: 'llama3-8b-8192', // GroqCloud model
        temperature: 0.7,
        apiKey: process.env.GROQ_API_KEY,
    });

    // Create the summarization prompt
    const messages = [
        new SystemMessage('You are a helpful assistant that summarizes transcripts.'),
        new HumanMessage(`${template}\n\ntranscript:${content}`),
    ];

    // Generate the summary
    const response = await chat.invoke(messages);

    return response.content; 
}


export async function POST(req: NextRequest) {
    const user = await getUserMeLoader();
    const token = await getAuthToken();


    if (!user.ok || !token) {
        return new Response(
            JSON.stringify({data: null, error: "Not authenticated"}),
            {status : 401}
        )
    }

    if(user.data.credits < 1) {
        return new Response(
            JSON.stringify({
                data: null,
                error: "Insufficient credits",
            }),
            {status: 402}
        );
    }

    const body = await req.json();
    const videoId = body.videoId;
    const url = `https://deserving-harmony-9f5ca04daf.strapiapp.com/utilai/yt-transcript/${videoId}`;

    let transcriptData;

    try {
        const transcript = await fetch(url);
        transcriptData = await transcript.text();
    } catch (error) {
        console.error("Error processing request:", error);
        if (error instanceof Error)
            return new Response(JSON.stringify({error: error}))
        return new Response(JSON.stringify({error: "Unknown error"}));
    }

    let summary: Awaited<ReturnType<typeof generateSummary>>;

    try {
        summary = await generateSummary(transcriptData, TEMPLATE);
        return new Response(JSON.stringify({data: summary, error: null}));
    } catch (error) {
        console.error("Error processing request:", error);
        if (error instanceof Error)
            return new Response(JSON.stringify({error: error.message}));
        return new Response(JSON.stringify({ error: "Error generateing summary" }));
    }
}
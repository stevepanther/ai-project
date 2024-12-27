
import { NextRequest, NextResponse } from "next/server";
import { getUserMeLoader } from "@/app/data/services/get-user-me-loader";
import { getAuthToken } from "@/app/data/services/get-token";

import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";
import streamifier from 'streamifier';

export const config = {
  api: {
    bodyParser: false, 
  },
};

const ffmpegPath = process.env.FFMPEG_PATH || "C:/FFmpeg/bin/ffmpeg.exe";
ffmpeg.setFfmpegPath(ffmpegPath);

const HF_ACCESS_TOKEN = process.env.HF_TOKEN;


function convertVideoToAudio(inputVideo: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    const bufferStream = new PassThrough();
    const videoStream = streamifier.createReadStream(inputVideo);

    const command = ffmpeg()
      .input(videoStream)
      .outputOptions("-vn", "-ab", "64k", "-ar", "16000")
      .toFormat('mp3')
      .on('end', () => {
        const outputBuffer = Buffer.concat(buffers);
        resolve(outputBuffer);
      })
      .on('error', (err) => {
        console.error('Error during conversion:', err);
        reject(err);
      })
      .writeToStream(bufferStream, {end: true});
  
    bufferStream.on('data', (chunk: Buffer) => {
        buffers.push(chunk);
      })
  });
}

function splitBuffer(buffer: Buffer, chunkSize: number): Buffer[] {
  const chunks: Buffer[] = [];
  for (let i = 0; i < buffer.length; i += chunkSize) {
    chunks.push(buffer.slice(i, i + chunkSize));
  }
  return chunks;
}

async function sendAudioChunks(buffer: Buffer): Promise<string> {
  const chunkSize = 5 * 1024 * 1024; // 5 MB chunk size
  const chunks = splitBuffer(buffer, chunkSize);
  let transcript = "";

  for (const chunk of chunks) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo",
        {
          headers: {
            Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: chunk
        }
      );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${errorText}`);
    }

    const result = await response.json();
    transcript += result.text; 
  }

  return transcript;
}

export async function POST(req: NextRequest) {
  try {

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

    const formData = await req.formData();
    const file = formData.get('inputFile') as File;    

    if (!file) {
      return NextResponse.json({data: null, error: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const audioBuffer = await convertVideoToAudio(fileBuffer);
    console.log(audioBuffer);
    if (audioBuffer) {
      const transcript = await sendAudioChunks(audioBuffer);
      return new Response(JSON.stringify({ data: transcript, error: null }));
    }

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Error processing file' }, { status: 500 });
  }
}
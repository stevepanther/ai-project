"use client"
import React, { useState, ChangeEvent } from "react";
import { useUpload } from "../custom/hook/useUpload";
import { extractYouTubeID, getStrapiURL } from "@/lib/utils";
import { toast } from "sonner";
import { createSummaryAction } from "@/app/data/actions/summary-actions";
import { Link, Loader2, CloudUpload, CirclePlay } from "lucide-react";
import { generateTranscriptService } from "@/app/data/services/transcript-service";
import { generateYoutubeSummaryService } from "@/app/data/services/summary-service";
import { generateLocalVideoSummaryService } from "@/app/data/services/summary-service";


interface UploadResponse {
  url: string;
  error: string | null;
}

interface StrapiErrorsProps {
  message: string | null;
  name: string;
}

const INITIAL_STATE = {
  message: null,
  name: "",
};

function Loader({text}: {readonly text:string}) {
  return (
      <div 
      className="flex items-center"
      >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <p>{text}</p>
      </div>
  )
}

const MainComponent: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [upload, { loading }] = useUpload();
    const [file, setFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [urlInput, setUrlInput] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [summaryloading, setLoading] = useState(false);
    const [fileloading, setFileLoading] = useState(false);
    const [summaryerror, setSummaryError] = useState<StrapiErrorsProps>(INITIAL_STATE);
    const baseUrl = getStrapiURL();

    const handleFileUpload = async (): Promise<void> => {
      setUploadProgress(0);
      setFileLoading(true);
      
      if(!file) {
        toast.error("upload video file");
        setFileLoading(false);
        return;
      }
      toast.success("Generating Summary");
      const { url, error }: UploadResponse = await upload({
        file,
        onProgress: (progress: number) => {
          setUploadProgress(Math.round(progress * 100));
        },
      });
      const trancriptResponseData = await generateTranscriptService(file);
      if (trancriptResponseData.error) {
          toast.error(trancriptResponseData.error);
          setSummaryError({
              ...INITIAL_STATE,
              message: trancriptResponseData.error,
              name: "Transcript Error",
          });
          setFileLoading(false);
          return;
      } else {
        toast.success("Generating Summary");
      }

      const summaryREsponseData = await generateLocalVideoSummaryService(trancriptResponseData)

      if (summaryREsponseData.error) {
          toast.error(summaryREsponseData.error);
          setSummaryError({
              ...INITIAL_STATE,
              message: summaryREsponseData.error,
              name: "Summary Error",
          });
          setFileLoading(false);
          return;
      }
      
      const payload = {
          data: {
              title: `Summary for video: ${file?.name}`,
              videoId: `${baseUrl}${url}`,
              summary: summaryREsponseData.data,
          },
      };

      try {
          await createSummaryAction(payload);
          toast.success("Summary Created");

          setSummaryError(INITIAL_STATE);
      } catch (error) {
          let errorMessage = "An unexpected error occurred while creating the summary";

          if (error instanceof Error) {
              errorMessage = error.message;
          } else if (typeof error === "string") {
              errorMessage = error;
          }
          toast.error(errorMessage);
          setSummaryError({
              message: errorMessage,
              name: "Summary Error",
          });
          setFileLoading(false);
          return;
      }
      setFileLoading(false);

      if (error) {
        setError(error);
        return;
      }

      setUrlInput("");
      setUploadProgress(0);
    };

  const handleUrlSubmit = async (): Promise<void> => {
    setLoading(true);
    if (!urlInput) return;

    if (error) {
      setError(error);
      return;
    }

    const processedVideoId = extractYouTubeID(urlInput);
    if (!processedVideoId) {
      toast.error("Invalid Youtoube Video ID");
      setLoading(false)
      setSummaryError({
          ...INITIAL_STATE,
          message: "Invalid Youtube Video ID",
          name: "Invalid Id",
      });
      return;
    } 
  
    toast.success("Generating Summary");
    const summaryREsponseData = await generateYoutubeSummaryService(processedVideoId);

    if (summaryREsponseData.error) {
        toast.error(summaryREsponseData.error);
        setSummaryError({
            ...INITIAL_STATE,
            message: summaryREsponseData.error,
            name: "Summary Error",
        });
        setLoading(false);
        return;
    }

    const payload = {
        data: {
            title: `Summary for video: ${processedVideoId}`,
            videoId: processedVideoId,
            summary: summaryREsponseData.data,
        },
    };

    try {
        await createSummaryAction(payload);
        toast.success("Summary Created");

        setSummaryError(INITIAL_STATE);
    } catch (error) {
      let errorMessage = "An unexpected error occurred while creating the summary";

      if (error instanceof Error) {
          errorMessage = error.message;
      } else if (typeof error === "string") {
          errorMessage = error;
      }

      toast.error(errorMessage);
      setSummaryError({
          message: errorMessage,
          name: "Summary Error",
      });
      setLoading(false);
      return;
    }

    setLoading(false);
    
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUrlInput("");
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setVideoUrl(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="flex  py-12 px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col my-auto justify-center items-center h-[700px] w-[900px]  max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden p-8 border border-gray-200">
          <div className="w-full text-center mb-12 relative">
            <div className="w-full absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 blur-[100px] opacity-40"></div>
            <h1 className="w-full text-5xl font-bold text-gray-800 font-orbitron mb-4">
              Video Summarizer
            </h1>
            <p className="w-full text-xl text-blue-600 font-roboto">
              Transform Your Videos into Summaries
            </p>
          </div>
          <div className="w-full space-y-8">
            {/* URL Input */}
            <div>
              <div className="w-full flex rounded-xl bg-gray-50 p-2 border border-gray-200 hover:border-blue-300 transition-all duration-300">
                <input
                  type="url"
                  name="video-url"
                  placeholder="Youtube Video ID or URL..."
                  value={urlInput}
                  disabled={fileloading || summaryloading}
                  onChange={(e) => {setUrlInput(e.target.value); setFile(null)}}
                  className="flex-1 px-4 py-3 bg-transparent text-gray-800 placeholder-blue-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleUrlSubmit}
                  disabled={!urlInput || summaryloading}
                  className="flex items-center ml-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  
                  {summaryloading ? 
                    <Loader text = "Creating Summary" /> 
                    : 
                    <div className="flex">
                      <Link className="mr-2"/>
                      Create Summary
                    </div>
                  }
                </button>
              </div>
            </div>
            {/* File Upload */}
            <div className="flex items-center justify-center my-8 w-full">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
              <p className="mx-4 text-blue-600">or</p>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
            </div>
            <div className="relative bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 hover:border-blue-300 transition-all duration-300">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={summaryloading || fileloading}
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-200 ${
                  urlInput ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <CloudUpload className="mr-4" />
                Drop Your Video Here
              </label>
              {file && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-blue-600">{file.name}</p>
                </div>
              )}
              <button
                onClick={handleFileUpload}
                disabled={!file || fileloading}
                className="mt-6 w-full flex justify-center py-4 px-6 text-lg font-medium text-white bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fileloading ? 
                  <Loader text = "Creating Summary" /> 
                  : 
                  <div className="flex">
                    <CirclePlay className="mr-2"/>
                    Create Summary
                  </div>
                }
              </button>
            </div>
            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-4 rounded-xl border border-red-200">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;

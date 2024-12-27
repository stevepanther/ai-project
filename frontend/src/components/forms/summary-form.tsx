"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn, extractYouTubeID } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";
import { generateYoutubeSummaryService } from "@/app/data/services/summary-service";
import { createSummaryAction } from "@/app/data/actions/summary-actions";

interface StrapiErrorsProps {
  message: string | null;
  name: string;
}

const INITIAL_STATE = {
  message: null,
  name: "",
};

export function SummaryForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StrapiErrorsProps>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");

  

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const videoId = formData.get("videoId") as string;

    
    const processedVideoId = extractYouTubeID(videoId);
    
    if (!processedVideoId) {
        toast.error("Invalid Youtoube Video ID");
        setLoading(false)
        setValue(""),
        setError({
            ...INITIAL_STATE,
            message: "Invalid Youtube Video ID",
            name: "Invalid Id",
        });
        return;
    }
    
    toast.success("Generating Summary");
    const summaryREsponseData = await generateYoutubeSummaryService(processedVideoId);

    if (summaryREsponseData.error) {
        setValue("");
        toast.error(summaryREsponseData.error);
        setError({
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

        setValue("");
        setError(INITIAL_STATE);
    } catch (error) {
        let errorMessage = "An unexpected error occurred while creating the summary";

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }

        toast.error(errorMessage);
        setError({
            message: errorMessage,
            name: "Summary Error",
        });
        setLoading(false);
        return;
    }

    setLoading(false);
  }

  function clearError() {
    setError(INITIAL_STATE);
    if (error.message) setValue("");
  }

  const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

  return (
    <div className="w-full max-w-[960px]">
      <form
        onSubmit={handleFormSubmit}
        className="flex gap-2 items-center justify-center"
      >
        <Input
          name="videoId"
          placeholder={
            error.message ? error.message : "Youtube Video ID or URL"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onMouseDown={clearError}
          className={cn(
            "w-full focus:text-black focus-visible:ring-pink-500",
            errorStyles
          )}
          required
        />

        <SubmitButton
          text="Create Summary"
          loadingText="Creating Summary"
          loading={loading}
        />
      </form>
    </div>
  );
}
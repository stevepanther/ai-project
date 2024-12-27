import { useState } from "react";
import { videoFileuploadService, videofileDeleteService } from "@/app/data/services/file-service";

interface UploadOptions {
  file?: File;
  onProgress?: (progress: number) => void;
}

interface UploadResponse {
  url: string;
  error: string | null;
}

export const useUpload = (): [
  (options: UploadOptions) => Promise<UploadResponse>,
  { loading: boolean }
] => {
  const [loading, setLoading] = useState(false);
  

  const upload = async (options: UploadOptions): Promise<UploadResponse> => {
    const { file, onProgress } = options;
    if (!file) {
      return { url: "", error: "No file or URL provided for upload" };
    }
    setLoading(true);

    try {

      if (file.name) {
        try {
            await videofileDeleteService(file.name);
        } catch (error) {
          return { url: "", error: "Upload failed" };
        }
      }
      
      const data = await videoFileuploadService(file);

      if (!data[0].url) {
        throw new Error("Invalid upload response");
      }

      setLoading(false);
      return { url: data[0].url, error: null };
    } catch (error: any) {
      setLoading(false);
      return { url: "", error: error.message || "Upload failed" };
    }
  };

  return [upload, { loading }];
};
import { getAuthToken } from "./get-token";
import { mutateData } from "./mutate-data";
import { getStrapiURL } from "@/lib/utils";

export async function fileDeleteService(imageId:string) {
    const authToken = await getAuthToken();
    if (!authToken) throw new Error("No auth token found");

    const data = await mutateData("DELETE", `/api/upload/files/${imageId}`);
    return data;
}

export async function fileuploadService(image:any) {
    const authToken = await getAuthToken();
    if (!authToken) throw new Error("No auth token found");

    const baseUrl = getStrapiURL();
    const url = new URL("/api/upload", baseUrl);

    const formData = new FormData();
    formData.append("files", image, image.name);

    try {
        const response = await fetch(url, {
            headers: {Authorization: `Bearer ${authToken}`},
            method: "POST",
            body: formData,
        })

        const dataResponse = await response.json();
        return dataResponse;
    } catch (error) {
        console.error("Error uploading image:", error)
        throw error;
    }
}

export async function videoFileuploadService(video:any) {
    const authToken = await getAuthToken();
    if (!authToken) throw new Error("No auth token found");

    const baseUrl = getStrapiURL();
    const url = new URL("/api/upload", baseUrl);

    const formData = new FormData();
    formData.append("files", video, video.name);

    try {
        const response = await fetch(url, {
            headers: {Authorization: `Bearer ${authToken}`},
            method: "POST",
            body: formData,
        })

        const dataResponse = await response.json();
        return dataResponse;
    } catch (error) {
        console.error("Error uploading video:", error)
        throw error;
    }
}

export async function videofileDeleteService(videoId:string) {
    const authToken = await getAuthToken();
    if (!authToken) throw new Error("No auth token found");

    const data = await mutateData("DELETE", `/api/upload/files/${videoId}`);
    return data;
}
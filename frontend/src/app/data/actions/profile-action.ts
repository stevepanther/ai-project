"use server";
import {z} from "zod";
import qs from "qs";
import { mutateData } from "../services/mutate-data";
import { revalidatePath } from "next/cache";
import { getUserMeLoader } from "../services/get-user-me-loader";

import {
    fileDeleteService,
    fileuploadService,
} from "@/app/data/services/file-service"

export async function updateProfileAction(
    userId: string,
    prevState: any,
    formData: FormData
) {
    const rawFormData = Object.fromEntries(formData);

    const query = qs.stringify({
        populate: "*",
    });

    const payload = {
        firstName: rawFormData.firstName,
        lastName: rawFormData.lastName,
        bio: rawFormData.bio
    };

    const responseData = await mutateData(
        "PUT",
        `/api/users/${userId}?${query}`,
        payload
    );

    if (!responseData) {
        return{
            ...prevState,
            strapiErrors: null,
            message: "Ops! Something went wrong. Please try again."
        };
    }

    if (responseData.error) {
        return {
            ...prevState,
            strapiErrors: responseData.error,
            message: "Ops! Something went wrong. Please try again."
        }
    }

    revalidatePath("/dashboard/account");

    return {
        ...prevState,
        message: "Profile Updated",
        data: payload,
        strapiErrors: null,
    }
}

const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const imageSchema = z.object({
    image: z
        .any()
        .refine((file) => {
            if (file.size === 0 || file.name === undefined) return false;
            else return true;
        }, "Please update or add new image.")

        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        )
        .refine(
            (file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`
        ),
});

export async function uploadprofileImageAction(
    imageId: string,
    prevState: any,
    formData: FormData
) {
    const user = await getUserMeLoader();
    if (!user.ok)
        throw new Error("You are not authorized to perform this action.");

    const userId = user.data.id;

    const data = Object.fromEntries(formData);

    const validatedFields = imageSchema.safeParse({
        image: data.image,
    });

    if(!validatedFields.success) {
        return {
            ...prevState,
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            data: null,
            message: "Invalid Image",
        };
    };

    if (imageId) {
        try {
            await fileDeleteService(imageId);
        } catch (error) {
            return {
                ...prevState,
                strapiErrors: null,
                zodErrors: null,
                message: "Failed to Delete Previous Image.",
            };
        }
    }

    const fileUploadResponse = await fileuploadService(data.image);

    if (!fileUploadResponse) {
        return {
            ...prevState,
            strapiErrors: null,
            zodErrors: null,
            message: "Ops! Something went wrong. Please try again.",
        };
    }

    if (fileUploadResponse.error) {
        return {
            ...prevState,
            strapiErrors: fileUploadResponse.error,
            zodErrors: null,
            message: "Failed to Upload File.",
        };
    }

    const updatedImageId = fileUploadResponse[0].id;
    const payload = {image: updatedImageId}

    const updateImageResponse = await mutateData(
        "PUT",
        `/api/users/${userId}`,
        payload
    );

    revalidatePath("/dashboard/account");

    return {
        ...prevState,
        data: updateImageResponse,
        zodErrors: null,
        strapiErrors: null,
        message: "Image Uploaded",
    }


}
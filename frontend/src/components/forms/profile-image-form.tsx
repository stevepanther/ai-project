"use client";
import React from "react";
import { useActionState } from "react";

import { cn } from "@/lib/utils";
import { uploadprofileImageAction } from "@/app/data/actions/profile-action";
import { SubmitButton } from "../custom/submit-button";
import ImagePicker from "../custom/image-picker";
import { ZodErrors } from "../custom/zod-errors";
import { StrapiErrors } from "../custom/strapi-errors";

interface ProfileImageFormProps {
    id: string;
    url: string;
    alternativeText: string;
}

const initialState = {
    message: null,
    data: null,
    strapiErrors: null,
    zodErrors: null,
}

export function ProfileImageFrom({
    data,
    className,
}: {
    data: Readonly<ProfileImageFormProps>;
    className?: string;
}) {
    const uploadprofileImageWithIdAction = uploadprofileImageAction.bind(
        null,
        data?.id
    )

    const [formState, formAction] = useActionState(
        uploadprofileImageWithIdAction,
        initialState
    )

    return (
        <form className={cn("space-y-4", className)} action={formAction}>
            <div className="bg-white">
                <ImagePicker
                    id="image"
                    name="image"
                    label="Profile Image"
                    defaultValue={data?.url || ""}
                />
            </div>
            <div className="flex justify-end">
                <SubmitButton text="Update Image" loadingText="Saving Image" />
            </div>
        </form>
    )
}